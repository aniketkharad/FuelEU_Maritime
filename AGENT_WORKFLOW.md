# 🤖 Agent Workflow Documentation

This document outlines the step-by-step logic, prompts, and tool chain utilized by the AI Agent (Antigravity by Google Deepmind) to architect and construct the Fuel EU Maritime Compliance Platform.

## 🧠 Approach & Reasoning

The primary goal was to construct a React + Node.js full-stack platform using **Hexagonal Architecture** (Ports and Adapters). The AI adopted the following iterative approach to minimize hallucination and maximize structural integrity:

1. **Information Architecture (Planning Mode)**
   - The agent analyzed the request to extract core models: `Route`, `ShipCompliance`, `BankEntry`, `Pool`, `PoolMember`.
   - Developed a rigorous `task.md` document and a comprehensive `implementation_plan.md` artifact to seek explicit User Approval before touching any filesystem resources.

2. **Backend Construction (Hexagonal Layering)**
   - **Infrastructure Configuration**: The agent used `write_to_file` to construct `docker-compose.yml` natively scaling PostgreSQL 16 databases, generating the Prisma Schemas (`schema.prisma`) and the `seed.ts` files containing complex energy metrics (gCO₂e/MJ mappings).
   - **Environment Handling**: Node.js natively wasn't present in the user's environment, so the agent adapted autonomously, executing terminal operations to dynamically install Node.js via Homebrew.
   - **Domain & Ports Setup**: The system built out the isolated `/src/core/domain` containing raw metric computations independently. The agent decoupled implementations by exposing `IRouteRepository` interfaces in `/src/core/ports/outbound.ts` and `IRouteService` under `inbound.ts`.
   - **Adapters Setup**: Utilizing Dependency Injection through `index.ts`, Prisma was safely walled off inside `/src/adapters/outbound/postgres/...`.

3. **Frontend Construction**
   - **Environment Isolation**: Orchestrated Vite initialization seamlessly inside an independent directory map.
   - **Aesthetics Optimization**: `tailwind.config.js` and `index.css` were injected natively with a premium dark-mode custom-marine tokenized color palette `#14b8a6` and UI animations.
   - **Component Decoupling**: API handlers were walled off into pure Axios adapters mapping back to strict Frontend domain types, preventing React UI fragments from knowing about HTTP networking. Recharts was layered cleanly for data visualization.

4. **Integration & Dev-ops Flow**
   - **Dockerization Iterations**: Constructed lightweight `node:20-alpine` endpoints for both servers. Nginx configurations were written on the fly to route Vite's static single-page application effectively.
   - **GitHub Pipelining**: Step-by-step granular commits generated organically following Semantic Versioning (e.g. `feat: backend core domain`, `build: dockerize`) communicating accurately the phase transitions to the remote `origin/main`.

## 🛠️ Prompts Utilized During Refactoring & Generation

Throughout the task execution, the AI responded autonomously to the internal loop of objectives without needing intense granular prompting. Key internal directives and task boundaries included:

> "Create backend project structure and configuration files"
> "Creating Prisma schema, seed data, and installing dependencies"
> "Fixing TS compilation error about seed.ts rootDir"
> "Writing frontend Dockerfile and updating docker-compose.yml"
> "Configuring Tailwind content paths and creating frontend domain models/ports"

When a native TypeScript Compilation issue was flagged organically by `tsc` regarding `rootDir` scope misalignments, the AI read the precise error matrix and immediately stripped `prisma/**/*.ts` paths from `tsconfig.json` seamlessly without external assistance.

## ✅ Verification Strategy
- **Terminal Parsing**: `npx tsc` outputs were deeply analyzed using error delta checks.
- **Git State Assertions**: `git pull --rebase` was deployed autonomously when remote branches diverged.
- **Dependency Flow**: Ensured proper sequential setups where Prisma generates local Typescript schema hooks before establishing dependent services.
