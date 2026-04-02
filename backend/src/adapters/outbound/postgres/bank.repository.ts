import { IBankEntryRepository } from '../../../core/ports/outbound';
import { BankEntry } from '../../../core/domain/bank-entry';
import { prisma } from './prisma';

export class BankEntryRepository implements IBankEntryRepository {
    async findByShipIdAndYear(shipId: string, year: number): Promise<BankEntry[]> {
        const entries = await prisma.bankEntry.findMany({
            where: {
                shipId,
                year,
            },
            orderBy: { id: 'asc' },
        });
        return entries;
    }

    async save(entry: BankEntry): Promise<BankEntry> {
        const saved = await prisma.bankEntry.create({
            data: {
                shipId: entry.shipId,
                year: entry.year,
                amountGco2eq: entry.amountGco2eq,
            },
        });
        return saved;
    }

    async getTotalBanked(shipId: string, upToYear: number): Promise<number> {
        // Sum all bank entries for a specific ship up to a given year
        const result = await prisma.bankEntry.aggregate({
            _sum: {
                amountGco2eq: true,
            },
            where: {
                shipId,
                year: {
                    lte: upToYear,
                },
            },
        });

        return result._sum.amountGco2eq || 0;
    }
}
