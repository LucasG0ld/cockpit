import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { CLERK_CLIENT } from '../src/clerk/clerk.module';

const VALID_TOKEN_2FA_DISABLED = 'valid.token.2fa_disabled';
const SESSION_ID_2FA_DISABLED = 'sess_2fa_disabled';
const VALID_TOKEN_2FA_ENABLED = 'valid.token.2fa_enabled';
const SESSION_ID_2FA_ENABLED = 'sess_2fa_enabled';
const ORG_ID = 'org_0123456789abcdefghijklmnop';

describe('AuthController (e2e) - 2FA & Lockout', () => {
  let app: INestApplication;

  const mockSession2faDisabled = {
    id: SESSION_ID_2FA_DISABLED,
    userId: 'user_2fa_disabled',
    actor: {
      sub: 'user_2fa_disabled',
      orgId: ORG_ID,
      org_role: 'Admin',
      amr: [{ method: 'password', timestamp: Date.now() }], // 2FA (totp) est absente
    },
  };

  const mockSession2faEnabled = {
    id: SESSION_ID_2FA_ENABLED,
    userId: 'user_2fa_enabled',
    actor: {
      sub: 'user_2fa_enabled',
      orgId: ORG_ID,
      org_role: 'Admin',
      amr: [
        { method: 'password', timestamp: Date.now() },
        { method: 'totp', timestamp: Date.now() }, // 2FA est présente
      ],
    },
  };

  const mockClerkClient = {
    sessions: {
      verifySession: (sessionId: string, token: string) => {
        if (
          token === VALID_TOKEN_2FA_DISABLED &&
          sessionId === SESSION_ID_2FA_DISABLED
        ) {
          return Promise.resolve(mockSession2faDisabled);
        }
        if (
          token === VALID_TOKEN_2FA_ENABLED &&
          sessionId === SESSION_ID_2FA_ENABLED
        ) {
          return Promise.resolve(mockSession2faEnabled);
        }
        return Promise.reject(new UnauthorizedException('Invalid session'));
      },
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CLERK_CLIENT)
      .useValue(mockClerkClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject access if 2FA is not enabled for a protected route', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await request(app.getHttpServer())
      .get('/auth') // Utilise une route protégée existante
      .set('Authorization', `Bearer ${VALID_TOKEN_2FA_DISABLED}`)
      .set('x-session-id', SESSION_ID_2FA_DISABLED)
      .set('x-org-id', ORG_ID);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: 'Two-factor authentication required',
      error: 'Forbidden',
    });
  });

  it('should reject access if orgId does not match', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${VALID_TOKEN_2FA_ENABLED}`)
      .set('x-session-id', SESSION_ID_2FA_ENABLED)
      .set('x-org-id', 'org_mismatch');

    expect(response.status).toBe(403);
    expect((response.body as { message: string }).message).toBe(
      'Organization mismatch',
    );
  });

  it('should allow access if 2FA is enabled', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const response = await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', `Bearer ${VALID_TOKEN_2FA_ENABLED}`)
      .set('x-session-id', SESSION_ID_2FA_ENABLED)
      .set('x-org-id', ORG_ID);

    expect(response.status).toBe(200);
    expect((response.body as { userId: string }).userId).toBe(
      mockSession2faEnabled.userId,
    );
  });
});
