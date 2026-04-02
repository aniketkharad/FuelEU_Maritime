import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RoutesTab } from '../adapters/ui/RoutesTab';
import { routeApi } from '../adapters/infrastructure/route.api';

// Mock the API
vi.mock('../adapters/infrastructure/route.api', () => ({
    routeApi: {
        getAllRoutes: vi.fn(),
        setBaseline: vi.fn(),
    },
}));

describe('RoutesTab', () => {
    const mockRoutes = [
        {
            routeId: 'R001',
            vesselType: 'Container',
            fuelType: 'HFO',
            year: 2024,
            ghgIntensity: 91.64,
            fuelConsumption: 1000,
            distance: 5000,
            totalEmissions: 311200,
            isBaseline: true,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (routeApi.getAllRoutes as any).mockReturnValue(new Promise(() => { })); // Never resolves
        render(<RoutesTab />);
        expect(screen.getByText(/Loading routes.../i)).toBeInTheDocument();
    });

    it('renders routes after fetching', async () => {
        (routeApi.getAllRoutes as any).mockResolvedValue(mockRoutes);
        render(<RoutesTab />);

        await waitFor(() => {
            expect(screen.getByText('R001')).toBeInTheDocument();
            expect(screen.getByText('Container')).toBeInTheDocument();
            expect(screen.getByText('HFO')).toBeInTheDocument();
        });
    });

    it('displays baseline badge for baseline routes', async () => {
        (routeApi.getAllRoutes as any).mockResolvedValue(mockRoutes);
        render(<RoutesTab />);

        await waitFor(() => {
            expect(screen.getByText('Baseline')).toBeInTheDocument();
        });
    });
});
