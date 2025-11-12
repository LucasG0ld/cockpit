import { create } from 'zustand';
import { z } from 'zod';
import apiClient from '../api-client';

// Define the state's shape
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  inviteMember: (email: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
  updateMember: (memberId: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
}

// Create the store
export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  // Action to fetch members
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<TeamMember[]>('/team/members');
      set({ members: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch members', isLoading: false });
    }
  },

  // Action to invite a new member
  inviteMember: async (email, role) => {
    const schema = z.object({ email: z.string().email(), role: z.enum(['ADMIN', 'MEMBER']) });
    const validation = schema.safeParse({ email, role });

    if (!validation.success) {
      console.error('Invalid data for inviteMember:', validation.error.issues);
      throw new Error('Invalid invitation data');
    }

    try {
      await apiClient.post('/team/invitations', { email: validation.data.email, role: validation.data.role });
      // Refresh the list after inviting
      await get().fetchMembers();
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw new Error('Failed to send invitation');
    }
  },

  // Action to update a member's role
  updateMember: async (memberId, role) => {
    const schema = z.object({ memberId: z.string().min(1), role: z.enum(['ADMIN', 'MEMBER']) });
    const validation = schema.safeParse({ memberId, role });

    if (!validation.success) {
      console.error('Invalid data for updateMember:', validation.error.issues);
      throw new Error('Invalid member data');
    }

    try {
      await apiClient.patch(`/team/members/${validation.data.memberId}`, { role: validation.data.role });
      // Refresh the list after updating
      await get().fetchMembers();
    } catch (error) {
      console.error('Failed to update member:', error);
      throw new Error('Failed to update member role');
    }
  },
}));
