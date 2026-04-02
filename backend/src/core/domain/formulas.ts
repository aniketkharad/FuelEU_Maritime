export const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ
export const ENERGY_FACTOR = 41000; // MJ/t

/**
 * Energy in scope (MJ) ≈ fuelConsumption × 41 000 MJ/t
 */
export function computeEnergyInScope(fuelConsumptionTonnes: number): number {
    return fuelConsumptionTonnes * ENERGY_FACTOR;
}

/**
 * Compliance Balance = ( Target − Actual ) × Energy in scope
 * Positive CB → Surplus ; Negative → Deficit
 */
export function computeComplianceBalance(actualIntensity: number, fuelConsumption: number): number {
    const energy = computeEnergyInScope(fuelConsumption);
    return (TARGET_INTENSITY_2025 - actualIntensity) * energy;
}

/**
 * percentDiff = ((comparison / baseline) − 1) × 100
 */
export function computePercentDiff(comparisonIntensity: number, baselineIntensity: number): number {
    if (baselineIntensity === 0) return 0;
    return ((comparisonIntensity / baselineIntensity) - 1) * 100;
}
