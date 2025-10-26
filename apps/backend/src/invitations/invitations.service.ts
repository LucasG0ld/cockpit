import { Injectable } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createInvitationDto: CreateInvitationDto,
    organizationId: string,
    invitedById: string,
  ) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 3); // Expires in 3 days

    return this.prisma.invitation.create({
      data: {
        ...createInvitationDto,
        organizationId,
        token,
        expiresAt,
        invitedById,
      },
    });
  }
}

