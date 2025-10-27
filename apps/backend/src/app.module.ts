import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  ClerkAuthGuard,
  ClerkSdkTokenVerifier,
  CLERK_TOKEN_VERIFIER,
} from './guards/clerk-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './audit/audit.module';
import { InvitationsModule } from './invitations/invitations.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, AuditModule, InvitationsModule, EmailModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: CLERK_TOKEN_VERIFIER,
      useClass: ClerkSdkTokenVerifier,
    },
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
