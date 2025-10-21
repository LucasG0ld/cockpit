import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { CLERK_TOKEN_VERIFIER } from '../src/guards/clerk-auth.guard';

const VALID_TOKEN = 'valid.token.example';
const INVALID_TOKEN = 'invalid.token.example';
const MISMATCH_TOKEN = 'mismatch.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';
const MISMATCH_ORG_ID = 'org_abcdefghijklmnopqrstuvwxyzab';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

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
      if (token === MISMATCH_TOKEN) {
        return Promise.resolve({
          ...verifiedTokenClaims,
          orgId: MISMATCH_ORG_ID,
        });
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

  it('allows access with a valid token', async () => {
    await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('x-org-id', ORG_ID)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          userId: verifiedTokenClaims.sub,
          orgId: ORG_ID,
          role: 'Admin',
          sessionId: verifiedTokenClaims.sid,
        });
      });
  });

  it('rejects requests without a token', async () => {
    await request(app.getHttpServer()).get('/auth').expect(401);
  });

  it('rejects requests with an invalid token', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${INVALID_TOKEN}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('rejects requests with mismatched orgId', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${MISMATCH_TOKEN}`)
      .set('x-org-id', ORG_ID);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Organization mismatch');
  });
});
