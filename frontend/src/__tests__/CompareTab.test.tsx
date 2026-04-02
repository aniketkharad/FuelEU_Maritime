import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CompareTab } from '../adapters/ui/CompareTab';
import { routeApi } from '../adapters/infrastructure/route.api';

vi.mock('../adapters/infrastructure/route.api', () => ({
    routeApi: {
        getComparison: vi.fn(),
    },
}));

describe('CompareTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (routeApi.getComparison as any).mockReturnValue(new Promise(() => { }));
        render(<CompareTab />);
        expect(screen.getByText(/Loading comparison data.../i)).toBeInTheDocument();
    });

    it('renders "No Baseline Selected" if baseline is null', async () => {
        (routeApi.getComparison as any).mockResolvedValue({ baseline: null, comparisons: [] });
        render(<CompareTab />);
        await waitFor(() => {
            expect(screen.getByText(/No Baseline Selected/i)).toBeInTheDocument();
        });
    });

    it('renders chart and comparison table when data is available', async () => {
        const mockData = {
            baseline: { routeId: 'R001', ghgIntensity: 91.64 },
            comparisons: [
                { routeId: 'R002', vesselType: 'Container', ghgIntensity: 88.50, percentDiff: -3.42, compliant: true }
            ]
        };
        (routeApi.getComparison as any).mockResolvedValue(mockData);
        render(<CompareTab />);

        await waitFor(() => {
            expect(screen.getByText(/Intensity Comparison/i)).toBeInTheDocument();
            expect(screen.getByText('R002')).toBeInTheDocument();
            expect(screen.getByText('-3.42%')).toBeInTheDocument();
            expect(screen.getByText('Yes')).toBeInTheDocument();
        });
    });
});
