import { create } from 'zustand';
import apiClient from '../api-client';

// Define the state's shape
export interface AuditEvent {
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

  // Action to fetch audit events
  fetchAuditEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<AuditEvent[]>('/audit-log');
      set({ events: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch audit events', isLoading: false });
    }
  },
}));
