export type ClerkRole = 'Admin' | 'CSM' | 'Closer' | 'Client' | 'Temporaire';

export interface ClerkAuthContext {
  userId: string;
  orgId: string;
  role: ClerkRole;
  sessionId?: string;
}
