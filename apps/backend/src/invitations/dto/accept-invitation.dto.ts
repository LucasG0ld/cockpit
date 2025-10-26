import { IsNotEmpty, IsString } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  acceptingUserId: string;
}
