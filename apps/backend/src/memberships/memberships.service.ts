import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../../prisma/generated/client';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async createMembership(
    identityId: string,
    organizationId: string,
    role: UserRole,
  ) {
    return this.prisma.membership.create({
      data: {
        identityId,
        organizationId,
        role,
      },
    });
  }
}
