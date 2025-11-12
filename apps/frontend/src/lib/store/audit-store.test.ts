import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAuditStore } from './audit-store';
import apiClient from '../api-client';

// Mock the apiClient
vi.mock('../api-client');

describe('useAuditStore', () => {
  beforeEach(() => {
    // Reset the store's state before each test
    useAuditStore.setState({
      events: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch audit events successfully', async () => {
    const mockEvents = [
      {
        id: 'evt_1',
        actor: { id: 'user_1', name: 'Alice' },
        action: 'member.invited',
        target: { id: 'user_3', type: 'user' },
        createdAt: new Date(),
      },
    ];
    (apiClient.get as vi.Mock).mockResolvedValue({ data: mockEvents });

    const { fetchAuditEvents } = useAuditStore.getState();
    await fetchAuditEvents();

    expect(useAuditStore.getState().events).toEqual(mockEvents);
    expect(useAuditStore.getState().isLoading).toBe(false);
    expect(useAuditStore.getState().error).toBe(null);
  });

  it('should handle error when fetching audit events fails', async () => {
    (apiClient.get as vi.Mock).mockRejectedValue(new Error('Network Error'));

    const { fetchAuditEvents } = useAuditStore.getState();
    await fetchAuditEvents();

    expect(useAuditStore.getState().events).toEqual([]);
    expect(useAuditStore.getState().isLoading).toBe(false);
    expect(useAuditStore.getState().error).toBe('Failed to fetch audit events');
  });
});
