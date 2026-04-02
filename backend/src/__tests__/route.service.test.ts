import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RouteService } from '../core/application/route.service';
import { IRouteRepository } from '../core/ports/outbound';
import { Route } from '../core/domain/route';

describe('RouteService', () => {
    let routeService: RouteService;
    let mockRepo: IRouteRepository;

    const mockRoutes: Route[] = [
        {
            routeId: 'R001',
            vesselType: 'Container',
            fuelType: 'HFO',
            year: 2024,
            ghgIntensity: 91.64,
            fuelConsumption: 1000,
            distance: 5000,
            totalEmissions: 311200,
            isBaseline: true
        },
        {
            routeId: 'R002',
            vesselType: 'Container',
            fuelType: 'VLSFO',
            year: 2024,
            ghgIntensity: 88.50,
            fuelConsumption: 950,
            distance: 5000,
            totalEmissions: 295000,
            isBaseline: false
        }
    ];

    beforeEach(() => {
        mockRepo = {
            findAll: vi.fn().mockResolvedValue(mockRoutes),
            findById: vi.fn(),
            findBaseline: vi.fn().mockResolvedValue(mockRoutes[0]),
            update: vi.fn(),
            setAllNonBaseline: vi.fn(),
        };
        routeService = new RouteService(mockRepo);
    });

    describe('getComparison', () => {
        it('should calculate percentDiff and compliance correctly against baseline', async () => {
            const result = await routeService.getComparison();

            expect(result.baseline?.routeId).toBe('R001');
            expect(result.comparisons).toHaveLength(1);

            const compR002 = result.comparisons[0];
            expect(compR002.routeId).toBe('R002');
            // (88.50 - 91.64) / 91.64 * 100 approx -3.42%
            expect(compR002.percentDiff).toBeCloseTo(-3.42, 1);
            // 88.50 < 89.34 (2025 target), so compliant should be true
            expect(compR002.compliant).toBe(true);
        });

        it('should return empty comparisons if only baseline exists', async () => {
            mockRepo.findAll = vi.fn().mockResolvedValue([mockRoutes[0]]);
            const result = await routeService.getComparison();
            expect(result.comparisons).toHaveLength(0);
        });
    });
});
