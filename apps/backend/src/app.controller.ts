import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';
import type { ClerkAuthContext } from './guards/clerk-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('auth')
  getAuth(
    @Req() req: Request & { auth?: ClerkAuthContext },
  ): ClerkAuthContext | null {
    return req.auth ?? null;
  }
}
