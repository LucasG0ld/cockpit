import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import type { Request as ExpressRequest } from 'express';
import type { ClerkAuthContext, ClerkRole } from './clerk-auth-context';
import { CLERK_CLIENT } from '../clerk/clerk.module';
import type { ClerkClient } from '@clerk/backend';

interface AuthenticatedRequest extends ExpressRequest {
  auth: ClerkAuthContext;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(CLERK_CLIENT) private clerkClient: ClerkClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const sessionToken = request.headers.authorization?.split(' ')[1];

    if (!sessionToken) {
      throw new UnauthorizedException('Authorization token not found.');
    }

    try {
      // The session ID is often required along with the token for verification
      const sessionId = request.headers['x-session-id'] as string;
      if (!sessionId) {
        throw new UnauthorizedException('Session ID not found in headers.');
      }

      const session = await this.clerkClient.sessions.verifySession(
        sessionId,
        sessionToken,
      );

      if (!session || !session.actor) {
        throw new UnauthorizedException('Invalid session or actor.');
      }

      const amr = session.actor.amr as { method: string; timestamp: number }[];
      const isTwoFactorEnabled = amr?.some((entry) => entry.method === 'totp');

      if (!isTwoFactorEnabled) {
        throw new ForbiddenException('Two-factor authentication required');
      }

      const orgId = session.actor.orgId as string;
      if (!orgId) {
        throw new UnauthorizedException('Organization ID not found in session');
      }

      const requestOrgId = request.headers['x-org-id'] as string;
      if (orgId !== requestOrgId) {
        throw new ForbiddenException('Organization mismatch');
      }

      request.auth = {
        userId: session.userId,
        sessionId: session.id,
        orgId: orgId,
        role: session.actor.org_role as ClerkRole,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token or session.');
    }

    return true;
  }
}
