import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Public } from '../guards/public.decorator';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { ActivateInvitationDto } from './dto/activate-invitation.dto';
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

  @Public()
  @Get(':token')
  async findOneByToken(@Param('token') token: string) {
    const invitation = await this.invitationsService.findOneByToken(token);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }
    return invitation;
  }

  @Public()
  @Post(':token/accept')
  @HttpCode(HttpStatus.CREATED)
  accept(
    @Param('token') token: string,
    @Body() acceptInvitationDto: AcceptInvitationDto,
  ) {
    return this.invitationsService.accept(token, acceptInvitationDto);
  }

  @Public()
  @Post(':token/activate')
  @HttpCode(HttpStatus.CREATED)
  activate(
    @Param('token') token: string,
    @Body() activateInvitationDto: ActivateInvitationDto,
  ) {
    return this.invitationsService.activate(token, activateInvitationDto);
  }
}
