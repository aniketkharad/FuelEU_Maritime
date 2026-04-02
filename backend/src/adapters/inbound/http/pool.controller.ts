import { Router, Request, Response } from 'express';
import { IPoolingService } from '../../../core/ports/inbound';

export function createPoolController(poolingService: IPoolingService): Router {
    const router = Router();

    router.post('/', async (req: Request, res: Response) => {
        try {
            const { year, members } = req.body;
            if (!year || !Array.isArray(members)) {
                return res.status(400).json({ error: 'year and members array are required' });
            }

            const pool = await poolingService.createPool(year, members);
            res.json(pool);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
}
