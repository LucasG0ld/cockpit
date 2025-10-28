import { IsEnum } from 'class-validator';
import { UserRole } from '../../../prisma/generated/client';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
