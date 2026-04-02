import { Route } from '../domain/route';
import { ShipCompliance } from '../domain/ship-compliance';
import { BankEntry } from '../domain/bank-entry';
import { Pool } from '../domain/pool';

export interface IRouteRepository {
    findAll(): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    clearBaselines(): Promise<void>;
    setBaseline(id: string): Promise<Route>;
}

export interface IShipComplianceRepository {
    findByShipIdAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
    save(compliance: ShipCompliance): Promise<ShipCompliance>;
}

export interface IBankEntryRepository {
    findByShipIdAndYear(shipId: string, year: number): Promise<BankEntry[]>;
    save(entry: BankEntry): Promise<BankEntry>;
    getTotalBanked(shipId: string, upToYear: number): Promise<number>;
}

export interface IPoolRepository {
    save(pool: Pool): Promise<Pool>;
    findByYear(year: number): Promise<Pool[]>;
}
