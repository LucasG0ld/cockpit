import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MockAuthInterceptor implements NestInterceptor {
  constructor(private readonly auth: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    req.auth = this.auth;
    return next.handle();
  }
}
