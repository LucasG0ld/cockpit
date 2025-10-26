import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import type { Request } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export interface ClerkAuthContext {
  userId: string;
  orgId: string;
  role: ClerkRole;
  sessionId?: string;
}

export type ClerkRole = 'Admin' | 'CSM' | 'Closer' | 'Client' | 'Temporaire';

export interface ClerkTokenVerifier {
  verify(token: string): Promise<Record<string, unknown>>;
}

export const CLERK_TOKEN_VERIFIER = Symbol('CLERK_TOKEN_VERIFIER');

@Injectable()
export class ClerkSdkTokenVerifier implements ClerkTokenVerifier {
  async verify(token: string): Promise<Record<string, unknown>> {
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new UnauthorizedException('Clerk secret key is not configured');
    }

    return clerkClient.verifyToken(token, { secretKey });
  }
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private static readonly ORG_ID_PATTERN = /^org_[0-9a-z]{26,32}$/;

  constructor(
    private reflector: Reflector,
    @Inject(CLERK_TOKEN_VERIFIER)
    private readonly tokenVerifier: ClerkTokenVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { auth?: ClerkAuthContext }>();

    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const verifiedClaims = await this.verifyToken(token);
    const authContext = this.buildAuthContext(verifiedClaims);

    this.ensureOrgConsistency(request, authContext.orgId);

    request.auth = authContext;

    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    return token;
  }

  private async verifyToken(token: string): Promise<Record<string, unknown>> {
    try {
      return await this.tokenVerifier.verify(token);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new UnauthorizedException('Failed to verify token');
    }
  }

  private buildAuthContext(claims: Record<string, unknown>): ClerkAuthContext {
    const userId = this.extractString(claims, ['sub']);
    const orgId = this.extractString(claims, ['orgId', 'org_id', 'orgID']);
    const roleRaw = this.extractString(claims, [
      'role',
      'org_role',
      'roleName',
    ]);
    const sessionId = this.extractString(
      claims,
      ['sid', 'session_id', 'sessionId'],
      false,
    );

    if (!userId) {
      throw new UnauthorizedException('Missing user identifier (sub claim)');
    }

    if (!orgId) {
      throw new UnauthorizedException(
        'Missing organization identifier (orgId claim)',
      );
    }

    if (!ClerkAuthGuard.ORG_ID_PATTERN.test(orgId)) {
      throw new UnauthorizedException('Invalid organization identifier format');
    }

    if (!roleRaw) {
      throw new UnauthorizedException('Missing role claim');
    }

    const role = this.normalizeRole(roleRaw);

    if (!role) {
      throw new UnauthorizedException('Unsupported role');
    }

    return {
      userId,
      orgId,
      role,
      sessionId: sessionId ?? undefined,
    };
  }

  private extractString(
    claims: Record<string, unknown>,
    keys: string[],
    required: boolean = true,
  ): string | null {
    for (const key of keys) {
      const value = claims[key];

      if (typeof value === 'string' && value.trim().length > 0) {
        return value;
      }
    }

    return required ? null : null;
  }

  private normalizeRole(rawRole: string): ClerkRole | null {
    const normalized = rawRole.trim().toLowerCase();

    switch (normalized) {
      case 'admin':
        return 'Admin';
      case 'csm':
        return 'CSM';
      case 'closer':
        return 'Closer';
      case 'client':
        return 'Client';
      case 'temporaire':
      case 'temporary':
        return 'Temporaire';
      default:
        return null;
    }
  }

  private ensureOrgConsistency(request: Request, orgId: string): void {
    const headerOrgId = this.normalizeCandidate(request.headers['x-org-id']);
    const paramOrgId = this.normalizeCandidate(
      typeof request.params?.orgId === 'string'
        ? request.params.orgId
        : undefined,
    );
    const queryOrgId = this.normalizeCandidate(
      typeof request.query?.orgId === 'string'
        ? request.query.orgId
        : undefined,
    );

    const expectedOrgIds = [headerOrgId, paramOrgId, queryOrgId].filter(
      (value): value is string => Boolean(value),
    );

    for (const candidate of expectedOrgIds) {
      if (candidate !== orgId) {
        throw new ForbiddenException('Organization mismatch');
      }
    }
  }

  private normalizeCandidate(
    candidate: string | string[] | undefined,
  ): string | null {
    if (!candidate) {
      return null;
    }

    if (Array.isArray(candidate)) {
      return candidate[0] ?? null;
    }

    const trimmed = candidate.trim();

    return trimmed.length > 0 ? trimmed : null;
  }
}
