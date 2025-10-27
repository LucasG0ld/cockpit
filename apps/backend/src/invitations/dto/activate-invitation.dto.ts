import { IsString } from 'class-validator';

export class ActivateInvitationDto {
  @IsString()
  clerkId: string;
}
