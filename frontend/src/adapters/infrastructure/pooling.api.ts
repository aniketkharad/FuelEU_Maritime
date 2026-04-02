import { api } from './api';
import type { IPoolingApi, CreatePoolMemberDTO } from '../../core/ports/ports';
import type { Pool } from '../../core/domain/entities';

export class PoolingApi implements IPoolingApi {
    async createPool(year: number, members: CreatePoolMemberDTO[]): Promise<Pool> {
        const response = await api.post('/pools', { year, members });
        return response.data;
    }
}

export const poolingApi = new PoolingApi();
