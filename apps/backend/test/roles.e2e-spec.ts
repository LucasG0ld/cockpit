import { Test } from '@nestjs/testing';
import { execSync } from 'child_process';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '../prisma/generated/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { CLERK_CLIENT } from '../src/clerk/clerk.module';
import { UnauthorizedException } from '@nestjs/common';

const VALID_ADMIN_TOKEN = 'valid-admin-token';
const ADMIN_SESSION_ID = 'sess_admin_id';
const ORG_ID = 'org_test_id';
const ADMIN_USER_ID = 'user_admin_id';
const MEMBER_USER_ID = 'user_member_id';

describe('MembershipsController (e2e) - With Auth', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const mockAdminSession = {
    id: ADMIN_SESSION_ID,
    userId: ADMIN_USER_ID,
    actor: {
      sub: ADMIN_USER_ID,
      orgId: ORG_ID,
      org_role: 'Admin',
      amr: [
        { method: 'password', timestamp: Date.now() },
        { method: 'totp', timestamp: Date.now() },
      ],
    },
  };

  const mockClerkClient = {
    sessions: {
      verifySession: (sessionId: string, token: string) => {
        if (token === VALID_ADMIN_TOKEN && sessionId === ADMIN_SESSION_ID) {
          return Promise.resolve(mockAdminSession);
        }
        return Promise.reject(new UnauthorizedException('Invalid session'));
      },
    },
    users: {
      banUser: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CLERK_CLIENT)
      .useValue(mockClerkClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

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

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should allow an Admin to change a member role', async () => {
    const targetMembership = await prisma.membership.create({
      data: {
        organizationId: ORG_ID,
        identityId: MEMBER_USER_ID,
        role: UserRole.CSM,
      },
    });

    const newRole = UserRole.Admin;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .patch(`/memberships/${targetMembership.id}/role`)
      .set('Authorization', `Bearer ${VALID_ADMIN_TOKEN}`)
      .set('x-session-id', ADMIN_SESSION_ID)
      .send({ role: newRole })
      .expect(200);

    const updatedMembership = await prisma.membership.findUnique({
      where: { id: targetMembership.id },
    });

    expect(updatedMembership?.role).toBe(newRole);

    const auditEvent = await prisma.auditEvent.findFirst({
      where: {
        type: 'user.role.changed',
        targetId: targetMembership.id,
      },
    });

    expect(auditEvent).toBeDefined();
    expect(auditEvent?.actorId).toBe(ADMIN_USER_ID);

    expect(mockClerkClient.users.banUser).toHaveBeenCalledWith(
      'clerk_member_id',
    );
  });

  it('PATCH /memberships/:id/role should fail without auth', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await request(app.getHttpServer())
      .patch('/memberships/some-id/role')
      .send({ role: UserRole.Admin });
    expect(response.status).toBe(403); // Changed to 403 because the global guard will now run
  });
});
