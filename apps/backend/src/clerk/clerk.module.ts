import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClerkService],
  exports: [ClerkService],
})
export class ClerkModule {}
