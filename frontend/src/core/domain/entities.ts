export interface Route {
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
}

export interface ComparisonResult extends Route {
    percentDiff: number;
    compliant: boolean;
}

export interface ComplianceBalance {
    shipId: string;
    year: number;
    cbGco2eq: number;
}

export interface BankRecord {
    id: number;
    shipId: string;
    year: number;
    amountGco2eq: number;
    createdAt: string;
}

export interface PoolMember {
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}

export interface Pool {
    id: number;
    year: number;
    members: PoolMember[];
    createdAt: string;
}

export const TARGET_INTENSITY_2025 = 89.3368;
