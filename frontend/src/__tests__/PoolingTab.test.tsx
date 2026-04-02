import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PoolingTab } from '../adapters/ui/PoolingTab';
import { poolingApi } from '../adapters/infrastructure/pooling.api';

vi.mock('../adapters/infrastructure/pooling.api', () => ({
    poolingApi: {
        createPool: vi.fn(),
    },
}));

describe('PoolingTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('allows changing member IDs', async () => {
        render(<PoolingTab />);
        const input = screen.getByPlaceholderText(/Ship IDs \(comma separated/i);
        fireEvent.change(input, { target: { value: 'R001, R002, R003' } });
        expect((input as HTMLInputElement).value).toBe('R001, R002, R003');
    });

    it('calls createPool when Submit is clicked', async () => {
        (poolingApi.createPool as any).mockResolvedValue({ id: 1, members: [] });
        render(<PoolingTab />);

        const input = screen.getByPlaceholderText(/Ship IDs \(comma separated/i);
        fireEvent.change(input, { target: { value: 'R001,R002' } });

        fireEvent.click(screen.getByText(/Create Pool/i));

        expect(poolingApi.createPool).toHaveBeenCalledWith(2024, [{ shipId: 'R001' }, { shipId: 'R002' }]);
    });
});
