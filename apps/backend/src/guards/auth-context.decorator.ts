import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ClerkAuthContext } from './clerk-auth-context';

export const AuthContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ClerkAuthContext => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { auth: ClerkAuthContext }>();
    return request.auth;
  },
);
