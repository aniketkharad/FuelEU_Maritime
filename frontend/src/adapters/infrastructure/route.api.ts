import { api } from './api';
import { IRouteApi } from '../../core/ports/ports';
import { Route, ComparisonResult } from '../../core/domain/entities';

export class RouteApi implements IRouteApi {
    async getAllRoutes(): Promise<Route[]> {
        const response = await api.get('/routes');
        return response.data;
    }

    async setBaseline(routeId: string): Promise<Route> {
        const response = await api.post(`/routes/${routeId}/baseline`);
        return response.data;
    }

    async getComparison(): Promise<{ baseline: Route | null; comparisons: ComparisonResult[] }> {
        const response = await api.get('/routes/comparison');
        return response.data;
    }
}

export const routeApi = new RouteApi();
