export interface Route {
    id?: number;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number; // gCO₂e/MJ
    fuelConsumption: number; // tonnes
    distance: number; // km
    totalEmissions: number; // tonnes
    isBaseline: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ComparisonResult extends Route {
    percentDiff: number;
    compliant: boolean; // True if intensity is less than or equal to target (calculated or compared to baseline)
}
