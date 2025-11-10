import { create } from 'zustand';
import { z } from 'zod';

// Define the state's shape
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status: 'active' | 'pending';
}

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  inviteMember: (email: string, role: 'admin' | 'member') => Promise<void>;
  updateMember: (memberId: string, role: 'admin' | 'member') => Promise<void>;
}

// Create the store
export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  isLoading: false,
  error: null,

  // Action to fetch members (simulated API call)
  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, you would fetch data from an API
      const fakeMembers: TeamMember[] = [
        { id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin', status: 'active' },
        { id: '2', name: 'Bob', email: 'bob@example.com', role: 'member', status: 'active' },
        { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'member', status: 'pending' },
      ];
      set({ members: fakeMembers, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch members', isLoading: false });
    }
  },

  // Action to invite a new member (simulated API call)
  inviteMember: async (email, role) => {
    const schema = z.object({ email: z.string().email(), role: z.enum(['admin', 'member']) });
    const validation = schema.safeParse({ email, role });

    if (!validation.success) {
      console.error('Invalid data for inviteMember:', validation.error.issues);
      return;
    }

    // Here you would typically make an API call to your backend
    const newMember: TeamMember = {
        id: new Date().toISOString(), // temporary ID
        name: 'Invited User',
        email: validation.data.email,
        role: validation.data.role,
        status: 'pending',
    };
    set((state) => ({ members: [...state.members, newMember] }));
  },

  // Action to update a member's role (simulated API call)
  updateMember: async (memberId, role) => {
    const schema = z.object({ memberId: z.string().min(1), role: z.enum(['admin', 'member']) });
    const validation = schema.safeParse({ memberId, role });

    if (!validation.success) {
      console.error('Invalid data for updateMember:', validation.error.issues);
      return;
    }

    // Here you would typically make an API call to your backend
    set((state) => ({
      members: state.members.map((member) =>
        member.id === validation.data.memberId ? { ...member, role: validation.data.role } : member
      ),
    }));
  },
}));
