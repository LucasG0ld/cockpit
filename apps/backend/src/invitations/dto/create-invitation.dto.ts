import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../../prisma/generated/client';

export class CreateInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
