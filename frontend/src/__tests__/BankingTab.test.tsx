import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BankingTab } from '../adapters/ui/BankingTab';
import { complianceApi } from '../adapters/infrastructure/compliance.api';
import { bankingApi } from '../adapters/infrastructure/banking.api';

// Path must match exactly what is in the imports
vi.mock('../adapters/infrastructure/compliance.api', () => ({
    complianceApi: {
        getComplianceBalance: vi.fn(),
        getAdjustedCB: vi.fn(),
    },
}));

vi.mock('../adapters/infrastructure/banking.api', () => ({
    bankingApi: {
        getBankRecords: vi.fn(),
        bankSurplus: vi.fn(),
        applyBanked: vi.fn(),
    },
}));

describe('BankingTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (complianceApi.getComplianceBalance as any).mockResolvedValue({ shipId: 'R001', year: 2024, cbGco2eq: 1000000 });
        (complianceApi.getAdjustedCB as any).mockResolvedValue({ shipId: 'R001', year: 2024, cbGco2eq: 1000000 });
        (bankingApi.getBankRecords as any).mockResolvedValue([]);
    });

    it('fetches and displays compliance balance', async () => {
        render(<BankingTab />);
        fireEvent.change(screen.getByPlaceholderText(/Ship \/ Route ID/i), { target: { value: 'R001' } });
        fireEvent.click(screen.getByText(/Load Portfolios/i));

        await waitFor(() => {
            // Use regex to match parts of combined text nodes
            expect(screen.getAllByText(/1,000,000/)[0]).toBeInTheDocument();
        });
    });

    it('calls bankSurplus when Bank button is clicked', async () => {
        (bankingApi.bankSurplus as any).mockResolvedValue({ id: 1 });
        render(<BankingTab />);
        fireEvent.change(screen.getByPlaceholderText(/Ship \/ Route ID/i), { target: { value: 'R001' } });
        fireEvent.click(screen.getByText(/Load Portfolios/i));

        await waitFor(() => screen.getByText('Bank Surplus'));
        fireEvent.click(screen.getByText('Bank Surplus'));

        expect(bankingApi.bankSurplus).toHaveBeenCalledWith('R001', 2024);
    });
});
