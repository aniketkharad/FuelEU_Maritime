import express, { Express } from 'express';
import cors from 'cors';

export function createServer(routers: {
    routeRouter: express.Router;
    complianceRouter: express.Router;
    bankingRouter: express.Router;
    poolingRouter: express.Router;
}): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/routes', routers.routeRouter);
    app.use('/compliance', routers.complianceRouter);
    app.use('/banking', routers.bankingRouter);
    app.use('/pools', routers.poolingRouter);

    // Global error handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    return app;
}
