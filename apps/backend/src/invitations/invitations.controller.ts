import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AuthContext } from '../guards/auth-context.decorator';
import type { ClerkAuthContext } from '../guards/clerk-auth.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createInvitationDto: CreateInvitationDto,
    @AuthContext() { userId, orgId }: ClerkAuthContext,
  ) {
    return this.invitationsService.create(createInvitationDto, orgId, userId);
  }
}
