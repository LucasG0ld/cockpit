import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { createClerkClient } from '@clerk/backend';
import type { Request as ExpressRequest } from 'express';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<ExpressRequest>();

    try {
      // Clerk's SDK expects a standard Request object, but NestJS provides an Express Request object.
      // We need to construct a standard Request from the Express one.
      const standardRequest = new Request(
        `${request.protocol}://${request.get('host')}${request.originalUrl}`,
        {
          headers: request.headers as HeadersInit,
          method: request.method,
        },
      );

      const requestState = await clerkClient.authenticateRequest(standardRequest);

      if (requestState.status !== 'signed-in') {
        throw new UnauthorizedException('Invalid session');
      }

      (request as any).auth = requestState.toAuth();
    } catch (error) {
      throw new UnauthorizedException('Invalid token or session.');
    }

    return true;
  }
}
