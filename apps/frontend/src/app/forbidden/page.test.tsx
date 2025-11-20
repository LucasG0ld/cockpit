import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore - File doesn't exist yet
import ForbiddenPage from './page';

vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Forbidden Page', () => {
    it('renders access denied message', () => {
        render(<ForbiddenPage />);
        expect(screen.getByRole('heading', { name: /access denied/i })).toBeDefined();
        expect(screen.getByText(/you do not have permission/i)).toBeDefined();
    });
});
