import { Router, Request, Response } from 'express';
import { IRouteService } from '../../../core/ports/inbound';

export function createRouteController(routeService: IRouteService): Router {
    const router = Router();

    router.get('/', async (req: Request, res: Response) => {
        try {
            const routes = await routeService.getAllRoutes();
            res.json(routes);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/:id/baseline', async (req: Request, res: Response) => {
        try {
            const route = await routeService.setBaseline(req.params.id as string);
            res.json(route);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.get('/comparison', async (req: Request, res: Response) => {
        try {
            const comparison = await routeService.getComparison();
            res.json(comparison);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
}
