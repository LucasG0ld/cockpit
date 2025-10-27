import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '../prisma/generated/client';
import { CLERK_TOKEN_VERIFIER } from '../src/guards/clerk-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

const VALID_TOKEN = 'valid.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';

describe('Activation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const verifiedTokenClaims = {
    sub: 'user_123',
    orgId: ORG_ID,
    role: 'Admin',
    sid: 'sess_123',
  };

  const mockVerifier = {
    verify: (token: string) => {
      if (token === VALID_TOKEN) {
        return Promise.resolve(verifiedTokenClaims);
      }
      return Promise.reject(new UnauthorizedException('Invalid token'));
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CLERK_TOKEN_VERIFIER)
      .useValue(mockVerifier)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await prisma.invitation.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.identity.deleteMany();
    await prisma.organization.deleteMany();

    await prisma.organization.create({
      data: {
        id: ORG_ID,
        externalId: 'ext-org-123',
        name: 'Test Org',
      },
    });

    await prisma.identity.create({
      data: {
        id: verifiedTokenClaims.sub,
        clerkId: 'clerk-user-123',
        email: 'inviter@test.com',
      },
    });

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /invitations/:token/activate', () => {
    it('should accept an invitation and create a membership', async () => {
      const invitation = await prisma.invitation.create({
        data: {
          email: 'acceptable@example.com',
          role: UserRole.Admin,
          organizationId: ORG_ID,
          invitedById: verifiedTokenClaims.sub,
          token: 'acceptable-token',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const activationPayload = { clerkId: 'new-clerk-user-123' };

      await request(app.getHttpServer())
        .post(`/invitations/${invitation.token}/activate`)
        .send(activationPayload)
        .expect(201);

      const identity = await prisma.identity.findUnique({
        where: { clerkId: activationPayload.clerkId },
      });
      expect(identity).not.toBeNull();

      const membership = await prisma.membership.findFirst({
        where: {
          identityId: identity!.id,
          organizationId: ORG_ID,
        },
      });

      expect(membership).not.toBeNull();
      expect(membership?.role).toBe(invitation.role);

      const usedInvitation = await prisma.invitation.findUnique({
        where: { id: invitation.id },
      });
      expect(usedInvitation?.status).toBe('Accepted');
    });
  });
});
