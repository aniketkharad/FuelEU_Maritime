import { Router, Request, Response } from 'express';
import { IComplianceService } from '../../../core/ports/inbound';

export function createComplianceController(complianceService: IComplianceService): Router {
    const router = Router();

    router.get('/cb', async (req: Request, res: Response) => {
        try {
            const shipId = req.query.shipId as string;
            const year = parseInt(req.query.year as string, 10);

            if (!shipId || isNaN(year)) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }

            const cb = await complianceService.getComplianceBalance(shipId, year);
            res.json(cb);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.get('/adjusted-cb', async (req: Request, res: Response) => {
        try {
            const shipId = req.query.shipId as string;
            const year = parseInt(req.query.year as string, 10);

            if (!shipId || isNaN(year)) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }

            const cb = await complianceService.getAdjustedCB(shipId, year);
            res.json(cb);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
}
