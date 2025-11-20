import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore - File doesn't exist yet
import NotFound from './not-found';

vi.mock('next/link', () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('NotFound Page', () => {
    it('renders 404 message', () => {
        render(<NotFound />);
        expect(screen.getByRole('heading', { name: /page not found/i })).toBeDefined();
        expect(screen.getByText(/could not find the page/i)).toBeDefined();
    });
});
