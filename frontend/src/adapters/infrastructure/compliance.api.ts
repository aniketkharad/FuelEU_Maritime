import { api } from './api';
import { IComplianceApi } from '../../core/ports/ports';
import { ComplianceBalance } from '../../core/domain/entities';

export class ComplianceApi implements IComplianceApi {
    async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
        const response = await api.get(`/compliance/cb?shipId=${shipId}&year=${year}`);
        return response.data;
    }

    async getAdjustedCB(shipId: string, year: number): Promise<ComplianceBalance> {
        const response = await api.get(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
        return response.data;
    }
}

export const complianceApi = new ComplianceApi();
