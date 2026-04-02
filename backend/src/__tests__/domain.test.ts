import { describe, it, expect } from 'vitest';
import { computeEnergyInScope, computeComplianceBalance, computePercentDiff, TARGET_INTENSITY_2025 } from '../core/domain/formulas';

describe('Domain Formulas', () => {
    describe('computeEnergyInScope', () => {
        it('should compute energy correctly for given fuel consumption (41000 MJ/t)', () => {
            // 1000 tonnes
            // Energy = 1,000 * 41,000 = 41,000,000 MJ
            expect(computeEnergyInScope(1000)).toBe(41000000);
        });
    });

    describe('computeComplianceBalance', () => {
        it('should compute surplus CB when actual < target', () => {
            const actualIntensity = 80;
            const consumption = 1000;
            const energy = 1000 * 41000;
            const expected = (TARGET_INTENSITY_2025 - actualIntensity) * energy;
            expect(computeComplianceBalance(actualIntensity, consumption)).toBe(expected);
        });

        it('should compute deficit CB when actual > target', () => {
            const actualIntensity = 100;
            const consumption = 1000;
            const energy = 1000 * 41000;
            const expected = (TARGET_INTENSITY_2025 - actualIntensity) * energy;
            expect(computeComplianceBalance(actualIntensity, consumption)).toBe(expected);
        });
    });

    describe('computePercentDiff', () => {
        it('should compute percentage difference correctly', () => {
            // ((100 / 80) - 1) * 100 = 25%
            expect(computePercentDiff(100, 80)).toBe(25);
            // ((60 / 80) - 1) * 100 = -25%
            expect(computePercentDiff(60, 80)).toBe(-25);
        });

        it('should return 0 when baseline and comparison are same', () => {
            expect(computePercentDiff(80, 80)).toBe(0);
        });
    });
});
