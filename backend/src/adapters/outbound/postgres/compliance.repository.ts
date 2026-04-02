import { IShipComplianceRepository } from '../../../core/ports/outbound';
import { ShipCompliance } from '../../../core/domain/ship-compliance';
import { prisma } from './prisma';

export class ShipComplianceRepository implements IShipComplianceRepository {
    async findByShipIdAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
        const compliance = await prisma.shipCompliance.findUnique({
            where: {
                shipId_year: {
                    shipId,
                    year,
                },
            },
        });
        return compliance;
    }

    async save(compliance: ShipCompliance): Promise<ShipCompliance> {
        const saved = await prisma.shipCompliance.upsert({
            where: {
                shipId_year: {
                    shipId: compliance.shipId,
                    year: compliance.year,
                },
            },
            update: {
                cbGco2eq: compliance.cbGco2eq,
            },
            create: {
                shipId: compliance.shipId,
                year: compliance.year,
                cbGco2eq: compliance.cbGco2eq,
            },
        });
        return saved;
    }
}
