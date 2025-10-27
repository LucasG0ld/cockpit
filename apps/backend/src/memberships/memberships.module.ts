import { Module } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
