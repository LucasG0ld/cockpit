import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '../prisma/generated/client';
import { CLERK_TOKEN_VERIFIER } from '../src/guards/clerk-auth.guard';

const VALID_TOKEN = 'valid.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';

import { PrismaService } from '../src/prisma/prisma.service';

describe('InvitationsController (e2e)', () => {
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

    // Clean up database before each test
    await prisma.invitation.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.identity.deleteMany();
    await prisma.organization.deleteMany();

    // Create test organization and user
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

  describe('POST /invitations', () => {
    it('should create an invitation for a new user', async () => {
      const invitationPayload = {
        email: 'new.user@example.com',
        role: UserRole.Admin,
      };

      return request(app.getHttpServer())
        .post('/invitations')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .send(invitationPayload)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toEqual({
            ...invitationPayload,
            id: expect.any(String),
            organizationId: ORG_ID,
            invitedById: verifiedTokenClaims.sub,
            status: 'Pending',
            token: expect.any(String),
            expiresAt: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });
  });

  describe('GET /invitations/:token', () => {
    it('should return an invitation by token', async () => {
      const invitation = await prisma.invitation.create({
        data: {
          email: 'retrievable@example.com',
          role: UserRole.Admin,
          organizationId: ORG_ID,
          invitedById: verifiedTokenClaims.sub,
          token: 'a-valid-token',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        },
      });

      return request(app.getHttpServer())
        .get(`/invitations/${invitation.token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toEqual({
            email: invitation.email,
            role: invitation.role,
            expiresAt: invitation.expiresAt.toISOString(),
          });
        });
    });
  });

  describe('POST /invitations/:token/accept', () => {
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

            const acceptingUser = await prisma.identity.create({
        data: {
          clerkId: 'clerk-new-user-123',
          email: invitation.email, // Use the invited email
        },
      });

      const acceptPayload = {
        acceptingUserId: acceptingUser.id,
      };

      await request(app.getHttpServer())
        .post(`/invitations/${invitation.token}/accept`)
        .send(acceptPayload)
        .expect(201);

      const membership = await prisma.membership.findFirst({
        where: {
          identityId: acceptPayload.acceptingUserId,
          organizationId: ORG_ID,
        },
      });

      expect(membership).not.toBeNull();
      expect(membership?.role).toBe(invitation.role);

      const usedInvitation = await prisma.invitation.findUnique({ where: { id: invitation.id } });
      expect(usedInvitation?.status).toBe('Accepted');
    });
  });
});
