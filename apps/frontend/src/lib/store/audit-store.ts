import { create } from 'zustand';

// Define the state's shape
interface AuditEvent {
  id: string;
  actor: { id: string; name: string };
  action: string;
  target: { id: string; type: string };
  createdAt: Date;
}

interface AuditState {
  events: AuditEvent[];
  isLoading: boolean;
  error: string | null;
  fetchAuditEvents: () => Promise<void>;
}

// Create the store
export const useAuditStore = create<AuditState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  // Action to fetch audit events (simulated API call)
  fetchAuditEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In a real app, you would fetch data from an API
      const fakeEvents: AuditEvent[] = [
        {
          id: 'evt_1',
          actor: { id: 'user_1', name: 'Alice' },
          action: 'member.invited',
          target: { id: 'user_3', type: 'user' },
          createdAt: new Date(),
        },
        {
          id: 'evt_2',
          actor: { id: 'user_1', name: 'Alice' },
          action: 'member.role.updated',
          target: { id: 'user_2', type: 'user' },
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
        },
      ];
      set({ events: fakeEvents, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch audit events', isLoading: false });
    }
  },
}));
