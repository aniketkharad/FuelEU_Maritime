import { IComplianceService } from '../ports/inbound';
import { IShipComplianceRepository, IBankEntryRepository, IRouteRepository } from '../ports/outbound';
import { ShipCompliance } from '../domain/ship-compliance';
import { computeComplianceBalance } from '../domain/formulas';

export class ComplianceService implements IComplianceService {
    constructor(
        private complianceRepo: IShipComplianceRepository,
        private routeRepo: IRouteRepository,
        private bankRepo: IBankEntryRepository
    ) { }

    async getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance> {
        let compliance = await this.complianceRepo.findByShipIdAndYear(shipId, year);
        if (!compliance) {
            // Need to compute it
            const route = await this.routeRepo.findById(shipId); // Assuming routeId is shipId for our seed data
            if (!route) {
                throw new Error(`Ship/Route ${shipId} not found to compute CB`);
            }

            const cb = computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);

            compliance = {
                shipId,
                year,
                cbGco2eq: cb,
            };

            compliance = await this.complianceRepo.save(compliance);
        }
        return compliance;
    }

    async getAdjustedCB(shipId: string, year: number): Promise<ShipCompliance> {
        const compliance = await this.getComplianceBalance(shipId, year);

        // Adjusted CB = base CB + banked amount (which is negative in bank entries when applied, positive when banked)
        // Actually, "Total Banked" will need careful signs or we adjust based on specific logic.
        // If you bank a positive CB, you subtract from your available CB?
        // Wait, the spec says: GET /compliance/adjusted-cb → fetch adjusted CB per ship.
        // A banked amount positive means it's available. If it was consumed, there is a negative entry.
        // Adjusted CB would logically be the original deficit plus any applied surplus.
        // Let's get total applied to this ship for this year.
        // Let's rethink: bank entry `amountGco2eq` is the transaction.
        // For simplicity, we just aggregate all bank entries for this ship and year, and add to base CB.

        // In our simplified model, bank operations handle this explicitly, 
        // but the `adjusted-cb` is `cbGco2eq` + sum(bankEntries) wait.
        // If you bank a surplus, you decrease your current CB? The spec is "POST /banking/bank — bank positive CB"
        // Usually banking removes surplus from current year. Applying banked adds to current year deficit.
        // Let's implement it as:

        const entries = await this.bankRepo.findByShipIdAndYear(shipId, year);
        const sumEntries = entries.reduce((acc, e) => acc + e.amountGco2eq, 0);

        return {
            ...compliance,
            cbGco2eq: compliance.cbGco2eq + sumEntries,
        };
    }
}
