import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ClerkModule } from './clerk/clerk.module';
import { EmailModule } from './email/email.module';
import { AuditModule } from './audit/audit.module';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    InvitationsModule,
    EmailModule,
    MembershipsModule,
    ClerkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
