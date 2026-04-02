import dotenv from 'dotenv';
dotenv.config();

import { createServer } from './infrastructure/server';

// Repositories
import { RouteRepository } from './adapters/outbound/postgres/route.repository';
import { ShipComplianceRepository } from './adapters/outbound/postgres/compliance.repository';
import { BankEntryRepository } from './adapters/outbound/postgres/bank.repository';
import { PoolRepository } from './adapters/outbound/postgres/pool.repository';

// Services
import { RouteService } from './core/application/route.service';
import { ComplianceService } from './core/application/compliance.service';
import { BankingService } from './core/application/banking.service';
import { PoolingService } from './core/application/pooling.service';

// Controllers
import { createRouteController } from './adapters/inbound/http/route.controller';
import { createComplianceController } from './adapters/inbound/http/compliance.controller';
import { createBankingController } from './adapters/inbound/http/banking.controller';
import { createPoolController } from './adapters/inbound/http/pool.controller';

async function main() {
    console.log('Wiring up dependencies...');

    // Initialize outbound adapters
    const routeRepo = new RouteRepository();
    const complianceRepo = new ShipComplianceRepository();
    const bankRepo = new BankEntryRepository();
    const poolRepo = new PoolRepository();

    // Initialize application services
    const routeService = new RouteService(routeRepo);
    const complianceService = new ComplianceService(complianceRepo, routeRepo, bankRepo);
    const bankingService = new BankingService(bankRepo, complianceService);
    const poolingService = new PoolingService(poolRepo, complianceService);

    // Initialize inbound adapters (controllers)
    const routeRouter = createRouteController(routeService);
    const complianceRouter = createComplianceController(complianceService);
    const bankingRouter = createBankingController(bankingService);
    const poolingRouter = createPoolController(poolingService);

    // Initialize server
    const app = createServer({
        routeRouter,
        complianceRouter,
        bankingRouter,
        poolingRouter,
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`🚀 FuelEU Maritime Platform API running on http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
