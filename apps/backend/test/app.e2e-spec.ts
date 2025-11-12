import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { CLERK_CLIENT } from '../src/clerk/clerk.module';

const VALID_TOKEN = 'valid.token.example';
const INVALID_TOKEN = 'invalid.token.example';
const MISMATCH_TOKEN = 'mismatch.token.example';
const ORG_ID = 'org_0123456789abcdefghijklmnop';
const MISMATCH_ORG_ID = 'org_abcdefghijklmnopqrstuvwxyzab';
const SESSION_ID = 'sess_123';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

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
          if (sessionId !== SESSION_ID) {
            return Promise.reject(new UnauthorizedException('Invalid session'));
          }

          if (token === VALID_TOKEN) {
            return Promise.resolve(baseSession);
          }

          if (token === MISMATCH_TOKEN) {
            return Promise.resolve({
              ...baseSession,
              actor: {
                ...baseSession.actor,
                orgId: MISMATCH_ORG_ID,
              },
            });
          }

          return Promise.reject(new UnauthorizedException('Invalid token'));
        }),
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CLERK_CLIENT)
      .useValue(mockClerkClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('allows access with a valid token', async () => {
    await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .set('x-org-id', ORG_ID)
      .set('x-session-id', SESSION_ID)
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
      .set('Authorization', `Bearer ${INVALID_TOKEN}`)
      .set('x-org-id', ORG_ID)
      .set('x-session-id', SESSION_ID);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('rejects requests with mismatched orgId', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${MISMATCH_TOKEN}`)
      .set('x-org-id', ORG_ID)
      .set('x-session-id', SESSION_ID);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Organization mismatch');
  });
});
