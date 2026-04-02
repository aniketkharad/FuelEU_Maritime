import { IPoolingService, CreatePoolMemberDTO, IComplianceService } from '../ports/inbound';
import { IPoolRepository } from '../ports/outbound';
import { Pool, PoolMember } from '../domain/pool';

export class PoolingService implements IPoolingService {
    constructor(
        private poolRepo: IPoolRepository,
        private complianceService: IComplianceService
    ) { }

    async createPool(year: number, memberDtos: CreatePoolMemberDTO[]): Promise<Pool> {
        if (memberDtos.length < 2) {
            throw new Error('A pool requires at least 2 members');
        }

        // Fetch all adjusted CBs
        const shipsWithCB = await Promise.all(
            memberDtos.map(async (m) => {
                const compliance = await this.complianceService.getAdjustedCB(m.shipId, year);
                return { shipId: m.shipId, cbBefore: compliance.cbGco2eq, cbAfter: 0 };
            })
        );

        const totalCB = shipsWithCB.reduce((sum, s) => sum + s.cbBefore, 0);

        if (totalCB < 0) {
            throw new Error('Pool invalid: Sum of Adjusted CB is negative. The pool is in deficit.');
        }

        // Greedy allocation: Sort members desc by CB
        // Transfer surplus to deficits
        const sorted = [...shipsWithCB].sort((a, b) => b.cbBefore - a.cbBefore);

        for (const ship of sorted) {
            ship.cbAfter = ship.cbBefore;
        }

        let surplusIndex = 0;
        let deficitIndex = sorted.length - 1;

        while (surplusIndex < deficitIndex) {
            const surplusShip = sorted[surplusIndex];
            const deficitShip = sorted[deficitIndex];

            if (surplusShip.cbAfter <= 0) {
                surplusIndex++;
                continue;
            }
            if (deficitShip.cbAfter >= 0) {
                deficitIndex--;
                continue;
            }

            const availableToGive = surplusShip.cbAfter;
            const amountNeeded = Math.abs(deficitShip.cbAfter);

            const transferAmount = Math.min(availableToGive, amountNeeded);

            surplusShip.cbAfter -= transferAmount;
            deficitShip.cbAfter += transferAmount;
        }

        // Validation post-allocation per rules
        for (const ship of sorted) {
            if (ship.cbBefore < 0 && ship.cbAfter < ship.cbBefore) {
                throw new Error('Deficit ship cannot exit worse');
            }
            if (ship.cbBefore > 0 && ship.cbAfter < 0) {
                throw new Error('Surplus ship cannot exit negative');
            }
        }

        const pool: Pool = {
            year,
            members: sorted.map((s) => ({
                shipId: s.shipId,
                cbBefore: s.cbBefore,
                cbAfter: s.cbAfter,
            })),
        };

        return this.poolRepo.save(pool);
    }
}
