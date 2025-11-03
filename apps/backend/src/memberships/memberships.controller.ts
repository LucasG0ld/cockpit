import { Controller, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import type { AuthedRequest } from '../guards/authed-request';
import { MembershipsService } from './memberships.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, UserStatus } from '../../prisma/generated/client';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';

@Controller('memberships')
@UseGuards(ClerkAuthGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Patch(':id/role')
  @Roles(UserRole.Admin)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: AuthedRequest,
  ) {
    const { orgId, sub: actorId } = req.auth;
    return this.membershipsService.updateRole(
      id,
      updateRoleDto.role,
      orgId,
      actorId,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.Admin)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req: AuthedRequest,
  ) {
    const { orgId, sub: actorId } = req.auth;
    return this.membershipsService.updateStatus(
      id,
      updateStatusDto.status,
      orgId,
      actorId,
    );
  }
}
