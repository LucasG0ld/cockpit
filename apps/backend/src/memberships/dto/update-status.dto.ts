import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../../prisma/generated/client';

export class UpdateStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
