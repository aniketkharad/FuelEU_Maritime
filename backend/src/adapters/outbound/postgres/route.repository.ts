import { IRouteRepository } from '../../../core/ports/outbound';
import { Route } from '../../../core/domain/route';
import { prisma } from './prisma';

export class RouteRepository implements IRouteRepository {
    async findAll(): Promise<Route[]> {
        const routes = await prisma.route.findMany({ orderBy: { routeId: 'asc' } });
        return routes;
    }

    async findById(id: string): Promise<Route | null> {
        const route = await prisma.route.findUnique({ where: { routeId: id } });
        return route;
    }

    async findBaseline(): Promise<Route | null> {
        const baseline = await prisma.route.findFirst({ where: { isBaseline: true } });
        return baseline;
    }

    async clearBaselines(): Promise<void> {
        await prisma.route.updateMany({
            where: { isBaseline: true },
            data: { isBaseline: false },
        });
    }

    async setBaseline(id: string): Promise<Route> {
        await this.clearBaselines();
        const updated = await prisma.route.update({
            where: { routeId: id },
            data: { isBaseline: true },
        });
        return updated;
    }
}
