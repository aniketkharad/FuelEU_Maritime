import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../infrastructure/server';
import { IRouteService } from '../core/ports/inbound';
import { createRouteController } from '../adapters/inbound/http/route.controller';

describe('Route Controller Integration', () => {
    let app: any;
    let mockRouteService: IRouteService;

    beforeEach(() => {
        mockRouteService = {
            getAllRoutes: vi.fn().mockResolvedValue([{ routeId: 'R001' }]),
            setBaseline: vi.fn().mockResolvedValue({ routeId: 'R001', isBaseline: true }),
            getComparison: vi.fn().mockResolvedValue({ baseline: { routeId: 'R001' }, comparisons: [] }),
        };

        app = createServer({
            routeRouter: createRouteController(mockRouteService),
            complianceRouter: vi.fn() as any,
            bankingRouter: vi.fn() as any,
            poolingRouter: vi.fn() as any,
        });
    });

    it('GET /routes should return all routes', async () => {
        const res = await request(app).get('/routes');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].routeId).toBe('R001');
    });

    it('POST /routes/:id/baseline should set baseline', async () => {
        const res = await request(app).post('/routes/R001/baseline');
        expect(res.status).toBe(200);
        expect(res.body.isBaseline).toBe(true);
    });

    it('GET /routes/comparison should return comparison data', async () => {
        const res = await request(app).get('/routes/comparison');
        expect(res.status).toBe(200);
        expect(res.body.baseline.routeId).toBe('R001');
    });
});
