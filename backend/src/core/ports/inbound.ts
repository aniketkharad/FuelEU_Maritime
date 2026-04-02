import { Route, ComparisonResult } from '../domain/route';
import { ShipCompliance } from '../domain/ship-compliance';
import { BankEntry } from '../domain/bank-entry';
import { Pool, PoolMember } from '../domain/pool';

export interface IRouteService {
    getAllRoutes(): Promise<Route[]>;
    setBaseline(routeId: string): Promise<Route>;
    getComparison(): Promise<{ baseline: Route | null; comparisons: ComparisonResult[] }>;
}

export interface IComplianceService {
    getComplianceBalance(shipId: string, year: number): Promise<ShipCompliance>;
    getAdjustedCB(shipId: string, year: number): Promise<ShipCompliance>;
}

export interface IBankingService {
    getBankRecords(shipId: string, year: number): Promise<BankEntry[]>;
    bankSurplus(shipId: string, year: number): Promise<BankEntry>;
    applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry>;
}

export interface CreatePoolMemberDTO {
    shipId: string;
}

export interface IPoolingService {
    createPool(year: number, members: CreatePoolMemberDTO[]): Promise<Pool>;
}
