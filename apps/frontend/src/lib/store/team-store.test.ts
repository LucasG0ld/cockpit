import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTeamStore } from './team-store';
import apiClient from '../api-client';

// Mock the apiClient
vi.mock('../api-client');

describe('useTeamStore', () => {
  beforeEach(() => {
    // Reset the store's state before each test
    useTeamStore.setState({
      members: [],
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it('should fetch members successfully', async () => {
    const mockMembers = [{ id: '1', name: 'Test User', email: 'test@test.com', role: 'MEMBER', status: 'ACTIVE' }];
    (apiClient.get as vi.Mock).mockResolvedValue({ data: mockMembers });

    const { fetchMembers } = useTeamStore.getState();
    await fetchMembers();

    expect(useTeamStore.getState().members).toEqual(mockMembers);
    expect(useTeamStore.getState().isLoading).toBe(false);
    expect(useTeamStore.getState().error).toBe(null);
  });

  it('should handle error when fetching members fails', async () => {
    (apiClient.get as vi.Mock).mockRejectedValue(new Error('Network Error'));

    const { fetchMembers } = useTeamStore.getState();
    await fetchMembers();

    expect(useTeamStore.getState().members).toEqual([]);
    expect(useTeamStore.getState().isLoading).toBe(false);
    expect(useTeamStore.getState().error).toBe('Failed to fetch members');
  });

  it('should invite a member and refetch the list', async () => {
    (apiClient.post as vi.Mock).mockResolvedValue({});
    (apiClient.get as vi.Mock).mockResolvedValue({ data: [] }); // For the refetch

    const { inviteMember } = useTeamStore.getState();
    await inviteMember('new@test.com', 'MEMBER');

    expect(apiClient.post).toHaveBeenCalledWith('/team/invitations', { email: 'new@test.com', role: 'MEMBER' });
    expect(apiClient.get).toHaveBeenCalledWith('/team/members');
  });

  it('should update a member and refetch the list', async () => {
    (apiClient.patch as vi.Mock).mockResolvedValue({});
    (apiClient.get as vi.Mock).mockResolvedValue({ data: [] }); // For the refetch

    const { updateMember } = useTeamStore.getState();
    await updateMember('1', 'ADMIN');

    expect(apiClient.patch).toHaveBeenCalledWith('/team/members/1', { role: 'ADMIN' });
    expect(apiClient.get).toHaveBeenCalledWith('/team/members');
  });
});
