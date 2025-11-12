import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Invitation, UserRole } from '../prisma/generated/client';
import { CLERK_CLIENT } from '../src/clerk/clerk.module';
import { EmailService, IEmailService } from '../src/email/email.service';

const VALID_TOKEN = 'valid.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';
const SESSION_ID = 'sess_123';

import { PrismaService } from '../src/prisma/prisma.service';

describe('InvitationsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let emailService: IEmailService;

  const verifiedTokenClaims = {
    sub: 'user_123',
    orgId: ORG_ID,
    role: 'Admin',
    sid: SESSION_ID,
  };

  const baseSession = {
    id: SESSION_ID,
    userId: verifiedTokenClaims.sub,
    actor: {
      orgId: ORG_ID,
      org_role: verifiedTokenClaims.role,
      amr: [{ method: 'totp', timestamp: Date.now() }],
    },
  };

  beforeEach(async () => {
    const mockClerkClient = {
      sessions: {
        verifySession: jest.fn((sessionId: string, token: string) => {
          if (sessionId !== SESSION_ID || token !== VALID_TOKEN) {
            return Promise.reject(new UnauthorizedException('Invalid token'));
          }

          return Promise.resolve(baseSession);
        }),
      },
    };

    const mockEmailService: IEmailService = {
      sendInvitationEmail: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CLERK_CLIENT)
      .useValue(mockClerkClient)
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    emailService = moduleFixture.get<IEmailService>(EmailService);

    await prisma.$transaction([
      prisma.membership.deleteMany(),
      prisma.invitation.deleteMany(),
      prisma.identity.deleteMany(),
      prisma.organization.deleteMany(),
      prisma.organization.create({
        data: {
          id: ORG_ID,
          externalId: 'ext-org-123',
          name: 'Test Org',
        },
      }),
      prisma.identity.create({
        data: {
          id: verifiedTokenClaims.sub,
          clerkId: 'clerk-user-123',
          email: 'inviter@test.com',
        },
      }),
    ]);

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /invitations', () => {
    it('should create an invitation and send an email', async () => {
      const invitationPayload = {
        email: 'new.user@example.com',
        role: UserRole.Admin,
      };

      const sendInvitationEmailSpy = jest
        .spyOn(emailService, 'sendInvitationEmail')
        .mockImplementation(async () => {});

      await request(app.getHttpServer())
        .post('/invitations')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .set('x-session-id', SESSION_ID)
        .send(invitationPayload)
        .expect(201);

      expect(sendInvitationEmailSpy).toHaveBeenCalledWith(
        invitationPayload.email,
        expect.any(String),
      );
    });

    it('should create an invitation for a new user', async () => {
      const invitationPayload = {
        email: 'new.user@example.com',
        role: UserRole.Admin,
      };

      return request(app.getHttpServer())
        .post('/invitations')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .set('x-session-id', SESSION_ID)
        .send(invitationPayload)
        .expect(201)
        .expect(({ body }: { body: Invitation }) => {
          expect(body).toEqual({
            ...invitationPayload,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(String),
            organizationId: ORG_ID,
            invitedById: verifiedTokenClaims.sub,
            status: 'Pending',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            token: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            expiresAt: expect.any(String), // Dates are serialized to strings
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        .expect(({ body }: { body: Partial<Invitation> }) => {
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

      const usedInvitation = await prisma.invitation.findUnique({
        where: { id: invitation.id },
      });
      expect(usedInvitation?.status).toBe('Accepted');
    });
  });
});
