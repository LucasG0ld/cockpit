import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserNav } from './user-nav';

// Mock @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
    UserButton: ({ afterSignOutUrl }: { afterSignOutUrl: string }) => (
        <div data-testid="mock-user-button" data-after-sign-out-url={afterSignOutUrl}>
            Mock User Button
        </div>
    ),
}));

describe('UserNav', () => {
    it('renders the Clerk UserButton with correct props', () => {
        render(<UserNav />);

        const userButton = screen.getByTestId('mock-user-button');
        expect(userButton).toBeDefined();
        expect(userButton.getAttribute('data-after-sign-out-url')).toBe('/sign-in');
    });
});
