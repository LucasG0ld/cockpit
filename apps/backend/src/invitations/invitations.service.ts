import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { ActivateInvitationDto } from './dto/activate-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ClerkService } from '../clerk/clerk.service';
import { MembershipsService } from '../memberships/memberships.service';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private clerkService: ClerkService,
    private membershipsService: MembershipsService,
  ) {}

  async create(
    createInvitationDto: CreateInvitationDto,
    organizationId: string,
    invitedById: string,
  ) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days

    const invitation = await this.prisma.invitation.create({
      data: {
        ...createInvitationDto,
        organizationId,
        token,
        expiresAt,
        invitedById,
      },
    });

    await this.emailService.sendInvitationEmail(invitation.email, token);

    return invitation;
  }

  async findOneByToken(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return null;
    }

    return {
      email: invitation.email,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    };
  }

  async accept(token: string, acceptInvitationDto: AcceptInvitationDto) {
    return this.prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.status !== 'Pending') {
        throw new ConflictException(
          'Invitation has already been accepted or has expired',
        );
      }

      if (invitation.expiresAt < new Date()) {
        throw new ConflictException('Invitation has expired');
      }

      await tx.membership.create({
        data: {
          organizationId: invitation.organizationId,
          identityId: acceptInvitationDto.acceptingUserId,
          role: invitation.role,
        },
      });

      const updatedInvitation = await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: 'Accepted' },
      });

      return updatedInvitation;
    });
  }

  async activate(token: string, activateInvitationDto: ActivateInvitationDto) {
    return this.prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.findUnique({
        where: { token },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.status !== 'Pending') {
        throw new ConflictException(
          'Invitation has already been accepted or has expired',
        );
      }

      if (invitation.expiresAt < new Date()) {
        throw new ConflictException('Invitation has expired');
      }

      const identity = await this.clerkService.findOrCreateIdentity(
        invitation.email,
        activateInvitationDto.clerkId,
      );

      await this.membershipsService.createMembership(
        identity.id,
        invitation.organizationId,
        invitation.role,
      );

      const updatedInvitation = await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: 'Accepted' },
      });

      return updatedInvitation;
    });
  }
}
