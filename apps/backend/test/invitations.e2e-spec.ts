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
});
