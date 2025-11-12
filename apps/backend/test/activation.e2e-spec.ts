import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRole } from '../prisma/generated/client';
import { CLERK_CLIENT } from '../src/clerk/clerk.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { EmailService, IEmailService } from '../src/email/email.service';

const VALID_TOKEN = 'valid.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';
const SESSION_ID = 'sess_123';

describe('Activation (e2e)', () => {
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
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /invitations/:token/activate', () => {
    it('should accept an invitation and create a membership', async () => {
      const createPayload = {
        email: 'acceptable@example.com',
        role: UserRole.Admin,
      };

      const sendInvitationEmailSpy = jest
        .spyOn(emailService, 'sendInvitationEmail')
        .mockResolvedValue(undefined);

      const invitationResponse = await request(app.getHttpServer())
        .post('/invitations')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .set('x-session-id', SESSION_ID)
        .send(createPayload)
        .expect(201);

      expect(sendInvitationEmailSpy).toHaveBeenCalled();

      const invitationToken = invitationResponse.body
        .token as string | undefined;

      const invitationRecord = invitationToken
        ? await prisma.invitation.findUnique({
            where: { token: invitationToken },
          })
        : await prisma.invitation.findFirst({
            where: { email: createPayload.email },
            orderBy: { createdAt: 'desc' },
          });

      if (!invitationRecord) {
        throw new Error('Invitation not created in database');
      }

      const activationToken = invitationRecord.token;

      const activationPayload = { clerkId: 'new-clerk-user-123' };

      await request(app.getHttpServer())
        .post(`/invitations/${activationToken}/activate`)
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .set('x-session-id', SESSION_ID)
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
      expect(membership?.role).toBe(invitationRecord.role);

      const usedInvitation = await prisma.invitation.findUnique({
        where: { id: invitationRecord.id },
      });
      expect(usedInvitation?.status).toBe('Accepted');
    });
  });
});
