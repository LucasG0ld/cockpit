import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleApiError } from './api-client';

describe('handleApiError', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { href: '' },
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('should redirect to /forbidden on 403 error', async () => {
        const error = {
            response: { status: 403 },
        };

        try {
            await handleApiError(error);
        } catch (e) {
            // Expected to reject
        }

        expect(window.location.href).toBe('/forbidden');
    });

    it('should redirect to /sign-in on 401 error', async () => {
        const error = {
            response: { status: 401 },
        };

        try {
            await handleApiError(error);
        } catch (e) {
            // Expected to reject
        }

        expect(window.location.href).toBe('/sign-in');
    });

    it('should not redirect on other errors', async () => {
        const error = {
            response: { status: 500 },
        };

        try {
            await handleApiError(error);
        } catch (e) {
            // Expected to reject
        }

        expect(window.location.href).toBe('');
    });
});
