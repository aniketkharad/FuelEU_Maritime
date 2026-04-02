import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankingService } from '../core/application/banking.service';
import { IBankEntryRepository } from '../core/ports/outbound';
import { IComplianceService } from '../core/ports/inbound';

describe('BankingService', () => {
    let bankingService: BankingService;
    let mockBankRepo: IBankEntryRepository;
    let mockComplianceService: IComplianceService;

    beforeEach(() => {
        mockBankRepo = {
            findByShipIdAndYear: vi.fn().mockResolvedValue([]),
            save: vi.fn().mockImplementation((d) => Promise.resolve({ id: 1, ...d, createdAt: new Date() })),
            getTotalBanked: vi.fn().mockResolvedValue(0),
        };
        mockComplianceService = {
            getComplianceBalance: vi.fn(),
            getAdjustedCB: vi.fn().mockResolvedValue({ shipId: 'S1', year: 2024, cbGco2eq: 1000000 }),
        };
        bankingService = new BankingService(mockBankRepo, mockComplianceService);
    });

    describe('bankSurplus', () => {
        it('should bank positive surplus when CB is positive', async () => {
            const result = await bankingService.bankSurplus('S1', 2024);
            expect(result.amountGco2eq).toBe(-1000000);
            expect(mockBankRepo.save).toHaveBeenCalled();
        });

        it('should throw error if CB is negative (deficit)', async () => {
            // @ts-ignore
            mockComplianceService.getAdjustedCB = vi.fn().mockResolvedValue({ shipId: 'S1', year: 2024, cbGco2eq: -500 });
            await expect(bankingService.bankSurplus('S1', 2024)).rejects.toThrow('Ship has no positive CB to bank');
        });
    });

    describe('applyBanked', () => {
        it('should apply banked amount to deficit', async () => {
            // @ts-ignore
            mockComplianceService.getAdjustedCB = vi.fn().mockResolvedValue({ shipId: 'S1', year: 2024, cbGco2eq: -2000000 });
            const result = await bankingService.applyBanked('S1', 2024, 500000);
            expect(result.amountGco2eq).toBe(500000);
            expect(mockBankRepo.save).toHaveBeenCalled();
        });

        it('should throw error if attempting to apply to surplus', async () => {
            // @ts-ignore
            mockComplianceService.getAdjustedCB = vi.fn().mockResolvedValue({ shipId: 'S1', year: 2024, cbGco2eq: 1000 });
            await expect(bankingService.applyBanked('S1', 2024, 500)).rejects.toThrow('Can only apply banked surplus to a deficit');
        });
    });
});
