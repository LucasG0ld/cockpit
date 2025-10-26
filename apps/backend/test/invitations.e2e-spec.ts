import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CLERK_TOKEN_VERIFIER } from '../src/guards/clerk-auth.guard';

const VALID_TOKEN = 'valid.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';

describe('InvitationsController (e2e)', () => {
  let app: INestApplication;

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
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /invitations', () => {
    it('should create an invitation for a new user', async () => {
      const invitationPayload = {
        email: 'new.user@example.com',
        role: 'Member',
      };

      return request(app.getHttpServer())
        .post('/invitations')
        .set('Authorization', `Bearer ${VALID_TOKEN}`)
        .set('x-org-id', ORG_ID)
        .send(invitationPayload)
        .expect(201);
    });
  });
});
