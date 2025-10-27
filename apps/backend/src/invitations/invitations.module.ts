import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ClerkModule } from '../clerk/clerk.module';
import { MembershipsModule } from '../memberships/memberships.module';

@Module({
  imports: [PrismaModule, EmailModule, ClerkModule, MembershipsModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
