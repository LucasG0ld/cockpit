import { create } from 'zustand';

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
    console.log(`Inviting ${email} with role ${role}`);
    // Here you would typically make an API call to your backend
    // For now, we can add a placeholder member to the state
    const newMember: TeamMember = {
        id: new Date().toISOString(), // temporary ID
        name: 'Invited User',
        email,
        role,
        status: 'pending',
    };
    set((state) => ({ members: [...state.members, newMember] }));
  },

  // Action to update a member's role (simulated API call)
  updateMember: async (memberId, role) => {
    console.log(`Updating member ${memberId} to role ${role}`);
    // Here you would typically make an API call to your backend
    set((state) => ({
      members: state.members.map((member) =>
        member.id === memberId ? { ...member, role } : member
      ),
    }));
  },
}));
