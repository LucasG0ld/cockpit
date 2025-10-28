import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkService {
  constructor(private prisma: PrismaService) {}

  // Placeholder for user creation logic
  async findOrCreateIdentity(email: string, clerkId: string) {
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
  }

  async banUser(clerkId: string): Promise<void> {
    await users.banUser(clerkId);
  }
}
