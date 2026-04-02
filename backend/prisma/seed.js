"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Clear existing data
    await prisma.poolMember.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.bankEntry.deleteMany();
    await prisma.shipCompliance.deleteMany();
    await prisma.route.deleteMany();
    // Seed routes
    const routes = [
        {
            routeId: 'R001',
            vesselType: 'Container',
            fuelType: 'HFO',
            year: 2024,
            ghgIntensity: 91.0,
            fuelConsumption: 5000,
            distance: 12000,
            totalEmissions: 4500,
            isBaseline: true,
        },
        {
            routeId: 'R002',
            vesselType: 'BulkCarrier',
            fuelType: 'LNG',
            year: 2024,
            ghgIntensity: 88.0,
            fuelConsumption: 4800,
            distance: 11500,
            totalEmissions: 4200,
            isBaseline: false,
        },
        {
            routeId: 'R003',
            vesselType: 'Tanker',
            fuelType: 'MGO',
            year: 2024,
            ghgIntensity: 93.5,
            fuelConsumption: 5100,
            distance: 12500,
            totalEmissions: 4700,
            isBaseline: false,
        },
        {
            routeId: 'R004',
            vesselType: 'RoRo',
            fuelType: 'HFO',
            year: 2025,
            ghgIntensity: 89.2,
            fuelConsumption: 4900,
            distance: 11800,
            totalEmissions: 4300,
            isBaseline: false,
        },
        {
            routeId: 'R005',
            vesselType: 'Container',
            fuelType: 'LNG',
            year: 2025,
            ghgIntensity: 90.5,
            fuelConsumption: 4950,
            distance: 11900,
            totalEmissions: 4400,
            isBaseline: false,
        },
    ];
    for (const route of routes) {
        await prisma.route.create({ data: route });
    }
    console.log(`✅ Seeded ${routes.length} routes`);
    // Seed ship compliance records (computed from formulas)
    // Energy = fuelConsumption × 41000 MJ/t
    // CB = (Target - Actual) × Energy   where Target = 89.3368 gCO₂e/MJ
    const TARGET_INTENSITY = 89.3368;
    const complianceRecords = routes.map((r) => {
        const energy = r.fuelConsumption * 41000; // MJ
        const cb = (TARGET_INTENSITY - r.ghgIntensity) * energy; // gCO₂e
        return {
            shipId: r.routeId,
            year: r.year,
            cbGco2eq: cb,
        };
    });
    for (const record of complianceRecords) {
        await prisma.shipCompliance.create({ data: record });
    }
    console.log(`✅ Seeded ${complianceRecords.length} compliance records`);
    console.log('🎉 Seeding complete!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map