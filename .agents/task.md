# FuelEU Maritime Compliance Platform

## Phase 1 — Backend
- [x] Initialize Node.js + TypeScript project with hexagonal structure
- [x] Set up PostgreSQL with Docker Compose, Prisma ORM, migrations & seeds
- [x] Implement domain models (Route, ShipCompliance, BankEntry, Pool)
- [x] Implement core use-cases (ComputeCB, ComputeComparison, BankSurplus, ApplyBanked, CreatePool)
- [x] Implement ports (inbound + outbound interfaces)
- [x] Implement outbound adapters (Postgres repositories via Prisma)
- [x] Implement inbound adapters (Express HTTP controllers)
- [x] Wire up dependency injection and server startup
- [x] Write unit tests for domain logic and use-cases
- [x] Write integration tests for HTTP endpoints
- [x] Verify backend runs correctly

## Phase 2 — Frontend
- [x] Initialize React + TypeScript + Vite + TailwindCSS project with hexagonal structure
- [x] Implement domain entities and port interfaces
- [x] Implement infrastructure adapters (API clients)
- [x] Implement Routes tab (table + filters + set-baseline)
- [x] Implement Compare tab (table + chart)
- [x] Implement Banking tab (KPIs + bank/apply actions)
- [x] Implement Pooling tab (member list + pool creation)
- [x] Wire up tabs/routing and polish UI
- [x] Write unit tests for use-cases and components
- [x] Verify frontend runs correctly against backend

## Phase 3 — Documentation & Integration
- [x] Write walkthrough.md
- [x] Final code cleanup and documentation
- [x] Final integration test (frontend + backend verification)

## Phase 4 — Dockerization & GitHub Integration (Step-by-step)
- [x] Initialize Git repo and push initial backend scaffold
- [x] Create Backend Dockerfile and update docker-compose.yml
- [x] Push backend dockerization
- [x] Scaffold Frontend and create Frontend Dockerfile
- [x] Push frontend scaffold
- [x] Final code push with 26 verified tests
- [x] Documentation of completion
