import { IRouteService } from '../ports/inbound';
import { IRouteRepository } from '../ports/outbound';
import { Route, ComparisonResult } from '../domain/route';
import { computePercentDiff, TARGET_INTENSITY_2025 } from '../domain/formulas';

export class RouteService implements IRouteService {
    constructor(private routeRepo: IRouteRepository) { }

    async getAllRoutes(): Promise<Route[]> {
        return this.routeRepo.findAll();
    }

    async setBaseline(routeId: string): Promise<Route> {
        const route = await this.routeRepo.findById(routeId);
        if (!route) {
            throw new Error(`Route ${routeId} not found`);
        }
        return this.routeRepo.setBaseline(routeId);
    }

    async getComparison(): Promise<{ baseline: Route | null; comparisons: ComparisonResult[] }> {
        const baseline = await this.routeRepo.findBaseline();
        const allRoutes = await this.routeRepo.findAll();

        // We compare non-baseline routes to baseline
        // If no baseline, we just use 0 as baselineIntensity for calculations or return baseline null
        const baselineIntensity = baseline?.ghgIntensity || 0;

        const comparisons = allRoutes
            .filter((r) => r.routeId !== baseline?.routeId)
            .map((r) => {
                const percentDiff = computePercentDiff(r.ghgIntensity, baselineIntensity);
                // Formula per spec target is 89.3368
                // Or if the spec wants us to check against baseline...?
                // Spec says: Use target = 89.3368 gCO₂e/MJ (2 % below 91.16). Compliant if <= target
                const compliant = r.ghgIntensity <= TARGET_INTENSITY_2025;

                return {
                    ...r,
                    percentDiff,
                    compliant,
                };
            });

        return { baseline, comparisons };
    }
}
