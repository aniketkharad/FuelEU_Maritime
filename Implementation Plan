# FuelEU Maritime Compliance Platform — Implementation Plan

Build a full-stack Fuel EU Maritime compliance module with a React+TypeScript+TailwindCSS frontend and a Node.js+TypeScript+PostgreSQL backend, both following hexagonal (ports & adapters) architecture.

## User Review Required

> [!IMPORTANT]
> **PostgreSQL**: We will use Docker Compose to run a local PostgreSQL instance. This requires Docker to be installed on your machine. If you prefer a different setup (e.g., a local Postgres install), let us know.

> [!IMPORTANT]
> **TailwindCSS**: Since you explicitly requested TailwindCSS, we'll use **TailwindCSS v3** with Vite. Confirm if v4 is preferred.

> [!IMPORTANT]
> **Charting Library**: For the Compare tab chart, we'll use **Recharts** (lightweight, React-native). Let us know if you prefer Chart.js or another library.

---

## Proposed Changes

### Backend — Project Initialization & Config

#### [NEW] [package.json](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/package.json)
Node.js project with dependencies: `express`, `prisma`, `@prisma/client`, `cors`, `dotenv`. Dev deps: `typescript`, `tsx`, `vitest`, `supertest`, `@types/*`, `eslint`, `prettier`.

#### [NEW] [tsconfig.json](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/tsconfig.json)
TypeScript strict mode, ES2022 target, path aliases for `@core/*`, `@adapters/*`, `@shared/*`.

#### [NEW] [docker-compose.yml](file:///Users/aniketkharad/projects/FuelEU_martitine/docker-compose.yml)
PostgreSQL 16 container with volume persistence. Ports `5432:5432`.

#### [NEW] [.env](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/.env)
`DATABASE_URL`, `PORT=3001`.

---

### Backend — Database (Prisma)

#### [NEW] [schema.prisma](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/prisma/schema.prisma)
Models: `Route`, `ShipCompliance`, `BankEntry`, `Pool`, `PoolMember` matching the spec schema.

#### [NEW] [seed.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/prisma/seed.ts)
Seed 5 routes (R001–R005) from the spec dataset. Set R001 as baseline.

---

### Backend — Core Domain

#### [NEW] [route.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/domain/route.ts)
`Route` entity with properties: `routeId`, `vesselType`, `fuelType`, `year`, `ghgIntensity`, `fuelConsumption`, `distance`, `totalEmissions`, `isBaseline`.

#### [NEW] [ship-compliance.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/domain/ship-compliance.ts)
`ShipCompliance` entity: `shipId`, `year`, `cbGco2eq`.

#### [NEW] [bank-entry.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/domain/bank-entry.ts)
`BankEntry` entity: `shipId`, `year`, `amountGco2eq`.

#### [NEW] [pool.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/domain/pool.ts)
`Pool` & `PoolMember` entities with CB allocation logic.

#### [NEW] [formulas.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/domain/formulas.ts)
Pure functions: `computeEnergyInScope(fuelConsumption)`, `computeComplianceBalance(target, actual, energy)`, `computePercentDiff(comparison, baseline)`.

---

### Backend — Core Ports

#### [NEW] [inbound.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/ports/inbound.ts)
Interfaces: `IRouteService`, `IComplianceService`, `IBankingService`, `IPoolingService`.

#### [NEW] [outbound.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/ports/outbound.ts)
Interfaces: `IRouteRepository`, `IShipComplianceRepository`, `IBankEntryRepository`, `IPoolRepository`.

---

### Backend — Core Application (Use Cases)

#### [NEW] [route.service.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/application/route.service.ts)
- `getAllRoutes()` — fetch all routes
- `setBaseline(routeId)` — mark a route as baseline
- `getComparison()` — compute baseline vs others with `percentDiff` and `compliant` flags

#### [NEW] [compliance.service.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/application/compliance.service.ts)
- `getComplianceBalance(shipId, year)` — compute & store CB
- `getAdjustedCB(shipId, year)` — CB after bank applications

#### [NEW] [banking.service.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/application/banking.service.ts)
- `getBankRecords(shipId, year)`
- `bankSurplus(shipId, year)` — bank positive CB
- `applyBanked(shipId, year, amount)` — apply surplus to deficit

#### [NEW] [pooling.service.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/core/application/pooling.service.ts)
- `createPool(year, members[])` — validate rules, greedy allocation, return cb_after per member

---

### Backend — Outbound Adapters (Postgres)

#### [NEW] [route.repository.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/outbound/postgres/route.repository.ts)
Prisma implementation of `IRouteRepository`.

#### [NEW] [compliance.repository.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/outbound/postgres/compliance.repository.ts)
Prisma implementation of `IShipComplianceRepository`.

#### [NEW] [bank.repository.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/outbound/postgres/bank.repository.ts)
Prisma implementation of `IBankEntryRepository`.

#### [NEW] [pool.repository.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/outbound/postgres/pool.repository.ts)
Prisma implementation of `IPoolRepository`.

---

### Backend — Inbound Adapters (HTTP)

#### [NEW] [route.controller.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/inbound/http/route.controller.ts)
Express router: `GET /routes`, `POST /routes/:id/baseline`, `GET /routes/comparison`.

#### [NEW] [compliance.controller.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/inbound/http/compliance.controller.ts)
Express router: `GET /compliance/cb`, `GET /compliance/adjusted-cb`.

#### [NEW] [banking.controller.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/inbound/http/banking.controller.ts)
Express router: `GET /banking/records`, `POST /banking/bank`, `POST /banking/apply`.

#### [NEW] [pool.controller.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/adapters/inbound/http/pool.controller.ts)
Express router: `POST /pools`.

---

### Backend — Infrastructure

#### [NEW] [server.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/infrastructure/server.ts)
Express app setup, CORS, JSON parsing, route mounting, error handler.

#### [NEW] [index.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/backend/src/index.ts)
Composition root: instantiate repositories → services → controllers → start server.

---

### Frontend — Project Initialization

#### [NEW] [package.json](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/package.json)
Vite + React + TypeScript. Dependencies: `recharts`, `axios`. Dev deps: `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`.

#### [NEW] [tailwind.config.js](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/tailwind.config.js)
Custom theme with maritime-inspired color palette.

---

### Frontend — Core Domain & Ports

#### [NEW] [entities.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/core/domain/entities.ts)
TypeScript interfaces: `Route`, `ComparisonResult`, `ComplianceBalance`, `BankRecord`, `PoolMember`, `Pool`.

#### [NEW] [ports.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/core/ports/ports.ts)
Outbound port interfaces: `IRouteApi`, `IComplianceApi`, `IBankingApi`, `IPoolingApi`.

---

### Frontend — Infrastructure Adapters

#### [NEW] [route.api.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/infrastructure/route.api.ts)
Axios implementation of `IRouteApi`.

#### [NEW] [compliance.api.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/infrastructure/compliance.api.ts)
Axios implementation of `IComplianceApi`.

#### [NEW] [banking.api.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/infrastructure/banking.api.ts)
Axios implementation of `IBankingApi`.

#### [NEW] [pooling.api.ts](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/infrastructure/pooling.api.ts)
Axios implementation of `IPoolingApi`.

---

### Frontend — UI Adapters (React Components)

#### [NEW] [App.tsx](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/App.tsx)
Main app with tab navigation (Routes / Compare / Banking / Pooling). Premium dark-mode dashboard theme.

#### [NEW] [RoutesTab.tsx](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/ui/RoutesTab.tsx)
Data table with filters (vesselType, fuelType, year) and "Set Baseline" button.

#### [NEW] [CompareTab.tsx](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/ui/CompareTab.tsx)
Comparison table + Recharts bar chart for GHG intensity.

#### [NEW] [BankingTab.tsx](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/ui/BankingTab.tsx)
KPI cards (cb_before, applied, cb_after), bank/apply action buttons.

#### [NEW] [PoolingTab.tsx](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/adapters/ui/PoolingTab.tsx)
Member list with before/after CBs, pool sum indicator, "Create Pool" button.

#### [NEW] [index.css](file:///Users/aniketkharad/projects/FuelEU_martitine/frontend/src/index.css)
Tailwind directives + custom utility classes, glassmorphism effects, animations.

---

### Documentation

#### [NEW] [README.md](file:///Users/aniketkharad/projects/FuelEU_martitine/README.md)
Project overview, setup instructions, architecture diagrams, API docs.

#### [NEW] [AGENT_WORKFLOW.md](file:///Users/aniketkharad/projects/FuelEU_martitine/AGENT_WORKFLOW.md)
AI-agent usage documentation: prompts used, generation strategy, refactoring steps, validation.

#### [NEW] [REFLECTION.md](file:///Users/aniketkharad/projects/FuelEU_martitine/REFLECTION.md)
Reflection on AI collaboration, what worked, lessons learned.

---

## Verification Plan

### Automated Tests

**Backend Unit Tests** (domain logic):
```bash
cd /Users/aniketkharad/projects/FuelEU_martitine/backend
npx vitest run
```
Tests for:
- `formulas.ts`: `computeEnergyInScope`, `computeComplianceBalance`, `computePercentDiff`
- `route.service.ts`: `getComparison` returns correct percentDiff and compliant flags
- `banking.service.ts`: `bankSurplus` rejects negative CB, `applyBanked` validates amount
- `pooling.service.ts`: `createPool` validates sum ≥ 0, deficit/surplus constraints, greedy allocation

**Backend Integration Tests** (HTTP via Supertest):
```bash
cd /Users/aniketkharad/projects/FuelEU_martitine/backend
npx vitest run --config vitest.integration.config.ts
```
Tests for all endpoints: GET/POST routes, compliance, banking, pools. Requires running DB.

**Frontend Tests**:
```bash
cd /Users/aniketkharad/projects/FuelEU_martitine/frontend
npx vitest run
```
Tests for domain logic and React component rendering.

### Manual Verification

1. **Start the platform**:
   ```bash
   # Terminal 1: Start PostgreSQL
   cd /Users/aniketkharad/projects/FuelEU_martitine && docker compose up -d

   # Terminal 2: Start backend
   cd /Users/aniketkharad/projects/FuelEU_martitine/backend && npm run dev

   # Terminal 3: Start frontend
   cd /Users/aniketkharad/projects/FuelEU_martitine/frontend && npm run dev
   ```

2. **Routes Tab**: Open browser → verify 5 routes displayed → use filters → click "Set Baseline"
3. **Compare Tab**: Verify baseline vs comparison table, chart renders, compliant flags correct
4. **Banking Tab**: Verify CB KPIs display, bank/apply buttons work, errors shown for invalid ops
5. **Pooling Tab**: Verify member list, pool sum indicator, "Create Pool" validates rules

### Browser Verification
We will use the browser subagent tool to navigate the frontend and verify each tab visually renders correctly and responds to interactions.
