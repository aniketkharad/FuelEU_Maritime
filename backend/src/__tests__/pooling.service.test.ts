import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolingService } from '../core/application/pooling.service';
import { IPoolRepository } from '../core/ports/outbound';
import { IComplianceService } from '../core/ports/inbound';

describe('PoolingService', () => {
    let poolingService: PoolingService;
    let mockPoolRepo: IPoolRepository;
    let mockComplianceService: IComplianceService;

    beforeEach(() => {
        mockPoolRepo = {
            save: vi.fn().mockImplementation((p) => Promise.resolve({
                id: 1,
                ...p,
                createdAt: new Date(),
            })),
            findByYear: vi.fn().mockResolvedValue([]),
        };
        mockComplianceService = {
            getComplianceBalance: vi.fn(),
            getAdjustedCB: vi.fn(),
        };
        poolingService = new PoolingService(mockPoolRepo, mockComplianceService);
    });

    describe('createPool', () => {
        it('should allocate surplus to deficit correctly (greedy)', async () => {
            // S1 has 1000 surplus, S2 has 600 deficit.
            mockComplianceService.getAdjustedCB = vi.fn()
                .mockResolvedValueOnce({ shipId: 'S1', year: 2024, cbGco2eq: 1000 })
                .mockResolvedValueOnce({ shipId: 'S2', year: 2024, cbGco2eq: -600 });

            const result = await poolingService.createPool(2024, [{ shipId: 'S1' }, { shipId: 'S2' }]);

            expect(result.members).toHaveLength(2);
            const s1 = result.members.find(m => m.shipId === 'S1');
            const s2 = result.members.find(m => m.shipId === 'S2');

            expect(s2?.cbAfter).toBe(0); // Deficit fully covered
            expect(s1?.cbAfter).toBe(400); // Surplus reduced
            expect(mockPoolRepo.save).toHaveBeenCalled();
        });

        it('should throw error if net balance is negative', async () => {
            mockComplianceService.getAdjustedCB = vi.fn()
                .mockResolvedValueOnce({ shipId: 'S1', year: 2024, cbGco2eq: 100 })
                .mockResolvedValueOnce({ shipId: 'S2', year: 2024, cbGco2eq: -600 });

            await expect(poolingService.createPool(2024, [{ shipId: 'S1' }, { shipId: 'S2' }]))
                .rejects.toThrow('Pool invalid: Sum of Adjusted CB is negative. The pool is in deficit.');
        });
    });
});
