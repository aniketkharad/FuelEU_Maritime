export interface PoolMember {
    id?: number;
    poolId?: number;
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}

export interface Pool {
    id?: number;
    year: number;
    createdAt?: Date;
    members: PoolMember[];
}
