import { IPoolRepository } from '../../../core/ports/outbound';
import { Pool } from '../../../core/domain/pool';
import { prisma } from './prisma';

export class PoolRepository implements IPoolRepository {
    async save(pool: Pool): Promise<Pool> {
        const saved = await prisma.pool.create({
            data: {
                year: pool.year,
                members: {
                    create: pool.members.map((m) => ({
                        shipId: m.shipId,
                        cbBefore: m.cbBefore,
                        cbAfter: m.cbAfter,
                    })),
                },
            },
            include: {
                members: true,
            },
        });

        return saved as Pool;
    }

    async findByYear(year: number): Promise<Pool[]> {
        const pools = await prisma.pool.findMany({
            where: { year },
            include: { members: true },
            orderBy: { id: 'desc' },
        });
        return pools as Pool[];
    }
}
