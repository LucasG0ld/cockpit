import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { PrismaModule } from '../prisma/prisma.module';
import { createClerkClient } from '@clerk/backend';

export const CLERK_CLIENT = 'CLERK_CLIENT';

const clerkProvider = {
  provide: CLERK_CLIENT,
  useValue: createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }),
};

@Module({
  imports: [PrismaModule],
  providers: [ClerkService, clerkProvider],
  exports: [ClerkService, clerkProvider],
})
export class ClerkModule {}
