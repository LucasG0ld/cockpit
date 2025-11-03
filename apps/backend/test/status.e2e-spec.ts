/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole, UserStatus } from '../prisma/generated/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { ClerkAuthGuard } from '../src/guards/clerk-auth.guard';
import { ClerkService } from '../src/clerk/clerk.service';
import { ExecutionContext } from '@nestjs/common';
import { AuthedRequest } from '../src/guards/authed-request';

const VALID_ADMIN_TOKEN = 'valid-admin-token';
const ORG_ID = 'org_test_id';
const ADMIN_USER_ID = 'user_admin_id';
const MEMBER_USER_ID = 'user_member_id';

describe('MembershipsController (e2e) - Status Lifecycle', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let moduleFixture: TestingModule;
  let clerkService: ClerkService;

  const adminClaims = {
    sub: ADMIN_USER_ID,
    orgId: ORG_ID,
    role: 'Admin',
  };

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ClerkAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req: AuthedRequest = context.switchToHttp().getRequest();
          req.auth = adminClaims;
          return true;
        },
      })
      .overrideProvider(ClerkService)
      .useValue({ banUser: jest.fn(), unbanUser: jest.fn() })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    clerkService = moduleFixture.get<ClerkService>(ClerkService);

    execSync('pnpm prisma migrate reset --force', {
      cwd: 'f:/dev/cockpit/apps/backend',
      stdio: 'inherit',
    });

    await prisma.organization.create({
      data: {
        id: ORG_ID,
        externalId: 'ext-org-123',
        name: 'Test Org',
      },
    });

    await prisma.identity.createMany({
      data: [
        {
          id: ADMIN_USER_ID,
          clerkId: 'clerk_admin_id',
          email: 'admin@test.com',
        },
        {
          id: MEMBER_USER_ID,
          clerkId: 'clerk_member_id',
          email: 'member@test.com',
        },
      ],
    });
  }, 30000);

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should allow an Admin to disable a member', async () => {
    const targetMembership = await prisma.membership.create({
      data: {
        organizationId: ORG_ID,
        identityId: MEMBER_USER_ID,
        role: UserRole.CSM,
        status: UserStatus.Active,
      },
    });

    await request(app.getHttpServer())
      .patch(`/memberships/${targetMembership.id}/status`)
      .set('Authorization', `Bearer ${VALID_ADMIN_TOKEN}`)
      .send({ status: UserStatus.Disabled })
      .expect(200);

    const updatedMembership = await prisma.membership.findUnique({
      where: { id: targetMembership.id },
    });

    expect(updatedMembership?.status).toBe(UserStatus.Disabled);
    expect(updatedMembership?.disabledAt).not.toBeNull();

    const auditEvent = await prisma.auditEvent.findFirst({
      where: {
        type: 'user.status.changed',
        targetId: targetMembership.id,
      },
    });

    expect(auditEvent).toBeDefined();
    expect(auditEvent?.actorId).toBe(ADMIN_USER_ID);
    const metadata = auditEvent?.metadata as { from: string; to: string };
    expect(metadata.from).toBe(UserStatus.Active);
    expect(metadata.to).toBe(UserStatus.Disabled);

    expect(clerkService.banUser).toHaveBeenCalledWith('clerk_member_id');
  });
});
