import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus } from '../../prisma/generated/client';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private clerkService: ClerkService,
  ) {}

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

  async updateRole(
    membershipId: string,
    newRole: UserRole,
    orgId: string,
    actorId: string,
  ) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: { identity: true },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.organizationId !== orgId) {
      throw new ForbiddenException('Permission denied');
    }

    if (membership.role === newRole) {
      return membership;
    }

    const [updatedMembership] = await this.prisma.$transaction([
      this.prisma.membership.update({
        where: { id: membershipId },
        data: { role: newRole },
      }),
      this.prisma.auditEvent.create({
        data: {
          type: 'user.role.changed',
          actorId,
          targetId: membership.id,
          organizationId: orgId,
          metadata: {
            from: membership.role,
            to: newRole,
            identityId: membership.identityId,
          },
        },
      }),
    ]);

    if (membership.identity.clerkId) {
      await this.clerkService.banUser(membership.identity.clerkId);
    }

    return updatedMembership;
  }

  async updateStatus(
    membershipId: string,
    newStatus: UserStatus,
    orgId: string,
    actorId: string,
  ) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: { identity: true },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.organizationId !== orgId) {
      throw new ForbiddenException('Permission denied');
    }

    if (membership.status === newStatus) {
      return membership;
    }

    // Placeholder for business logic checks (CSM/Closer)

    const [updatedMembership] = await this.prisma.$transaction([
      this.prisma.membership.update({
        where: { id: membershipId },
        data: {
          status: newStatus,
          disabledAt: newStatus === UserStatus.Disabled ? new Date() : null,
          role: newStatus === UserStatus.Active ? UserRole.Temporaire : membership.role,
        },
      }),
      this.prisma.auditEvent.create({
        data: {
          type: 'user.status.changed',
          actorId,
          targetId: membership.id,
          organizationId: orgId,
          metadata: {
            from: membership.status,
            to: newStatus,
            identityId: membership.identityId,
          },
        },
      }),
    ]);

    if (membership.identity.clerkId) {
      if (newStatus === UserStatus.Disabled) {
        await this.clerkService.banUser(membership.identity.clerkId);
      } else {
        await this.clerkService.unbanUser(membership.identity.clerkId);
      }
    }

    return updatedMembership;
  }
}
