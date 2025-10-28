import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from '../audit/audit.service';
import { ClerkService } from '../clerk/clerk.service';
import { ClerkModule } from '../clerk/clerk.module';
import {
  ClerkAuthGuard,
  ClerkSdkTokenVerifier,
  CLERK_TOKEN_VERIFIER,
} from '../guards/clerk-auth.guard';

@Module({
  imports: [PrismaModule, ClerkModule],
  controllers: [MembershipsController],
  providers: [
    MembershipsService,
    AuditService,
    ClerkService,
    {
      provide: CLERK_TOKEN_VERIFIER,
      useClass: ClerkSdkTokenVerifier,
    },
    ClerkAuthGuard,
  ],
  exports: [MembershipsService],
})
export class MembershipsModule {}
