import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);

  constructor(private prisma: PrismaService) {}

  // Placeholder for user creation logic
  async findOrCreateIdentity(email: string, clerkId: string) {
    try {
      const existingIdentity = await this.prisma.identity.findUnique({
        where: { clerkId },
      });

      if (existingIdentity) {
        return existingIdentity;
      }

      return this.prisma.identity.create({
        data: {
          email,
          clerkId,
        },
      });
    } catch (error) {
      this.logger.error(
        'Failed to find or create identity in clerk.service.ts',
        error,
      );
      throw new InternalServerErrorException(
        'Could not find or create identity.',
      );
    }
    return this.prisma.identity.create({
      data: {
        email,
        clerkId,
      },
    });
  }

  async banUser(clerkId: string): Promise<void> {
    await clerkClient.users.banUser(clerkId);
  }
}
