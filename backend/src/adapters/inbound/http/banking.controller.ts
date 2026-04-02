import { Router, Request, Response } from 'express';
import { IBankingService } from '../../../core/ports/inbound';

export function createBankingController(bankingService: IBankingService): Router {
    const router = Router();

    router.get('/records', async (req: Request, res: Response) => {
        try {
            const shipId = req.query.shipId as string;
            const year = parseInt(req.query.year as string, 10);

            if (!shipId || isNaN(year)) {
                return res.status(400).json({ error: 'shipId and year are required' });
            }

            const records = await bankingService.getBankRecords(shipId, year);
            res.json(records);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post('/bank', async (req: Request, res: Response) => {
        try {
            const { shipId, year } = req.body;
            if (!shipId || !year) {
                return res.status(400).json({ error: 'shipId, year are required' });
            }

            const entry = await bankingService.bankSurplus(shipId, year);
            res.json(entry);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    router.post('/apply', async (req: Request, res: Response) => {
        try {
            const { shipId, year, amount } = req.body;
            if (!shipId || !year || !amount) {
                return res.status(400).json({ error: 'shipId, year, amount are required' });
            }

            const entry = await bankingService.applyBanked(shipId, year, amount);
            res.json(entry);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    });

    return router;
}
