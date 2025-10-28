import { Controller, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ClerkAuthGuard } from '../guards/clerk-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../prisma/generated/client';

@Controller('memberships')
@UseGuards(ClerkAuthGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Patch(':id/role')
  @Roles(UserRole.Admin)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    const { orgId, sub: actorId } = req.auth;
    return this.membershipsService.updateRole(
      id,
      updateRoleDto.role,
      orgId,
      actorId,
    );
  }
}
