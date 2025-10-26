import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('invitations')
export class InvitationsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create() {
    return {};
  }
}
