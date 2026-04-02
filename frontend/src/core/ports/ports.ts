import type { Route, ComparisonResult, ComplianceBalance, BankRecord, Pool } from '../domain/entities';

export interface IRouteApi {
    getAllRoutes(): Promise<Route[]>;
    setBaseline(routeId: string): Promise<Route>;
    getComparison(): Promise<{ baseline: Route | null; comparisons: ComparisonResult[] }>;
}

export interface IComplianceApi {
    getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
    getAdjustedCB(shipId: string, year: number): Promise<ComplianceBalance>;
}

export interface IBankingApi {
    getBankRecords(shipId: string, year: number): Promise<BankRecord[]>;
    bankSurplus(shipId: string, year: number): Promise<BankRecord>;
    applyBanked(shipId: string, year: number, amount: number): Promise<BankRecord>;
}

export interface CreatePoolMemberDTO {
    shipId: string;
}

export interface IPoolingApi {
    createPool(year: number, members: CreatePoolMemberDTO[]): Promise<Pool>;
}
