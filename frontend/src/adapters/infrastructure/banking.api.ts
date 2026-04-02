import { api } from './api';
import type { IBankingApi } from '../../core/ports/ports';
import type { BankRecord } from '../../core/domain/entities';

export class BankingApi implements IBankingApi {
    async getBankRecords(shipId: string, year: number): Promise<BankRecord[]> {
        const response = await api.get(`/banking/records?shipId=${shipId}&year=${year}`);
        return response.data;
    }

    async bankSurplus(shipId: string, year: number): Promise<BankRecord> {
        const response = await api.post('/banking/bank', { shipId, year });
        return response.data;
    }

    async applyBanked(shipId: string, year: number, amount: number): Promise<BankRecord> {
        const response = await api.post('/banking/apply', { shipId, year, amount });
        return response.data;
    }
}

export const bankingApi = new BankingApi();
