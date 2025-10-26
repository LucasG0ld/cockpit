import { UserRole } from '../../../prisma/generated/client';

export class InvitationDto {
  email: string;
  role: UserRole;
  expiresAt: Date;
}
