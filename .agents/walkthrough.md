# FuelEU Maritime Compliance Platform - Walkthrough

The platform is now fully implemented, tested, and verified. It follow a strict **Hexagonal (Ports & Adapters) Architecture** to ensure maintainability and separation of concerns.

## 🏗️ Architecture Overview

The system is split into a **Backend (Node.js/TypeScript)** and a **Frontend (React/TypeScript)**, both communicated via REST APIs defined in the application layer.

- **Core Domain**: Contains the business logic for GHG intensity calculations, compliance balances, banking constraints (Article 20), and pooling greedy allocation (Article 21).
- **Application Services**: Orchestrate use cases (Route management, Banking, Pooling).
- **Adapters**:
    - **UI**: React components (`RoutesTab`, `CompareTab`, `BankingTab`, `PoolingTab`).
    - **Infrastructure**: Prisma-based database persistence and Axios-based API clients.

## ✅ Verification Results

### Backend Testing (16 Tests)
Comprehensive unit and integration tests covering:
- **Domain logic**: CB formulas and GHG calculations.
- **Banking Service**: Ledger-based surplus/deficit management.
- **Pooling Service**: Greedy allocation of compliance balances among ships.
- **API Integration**: Supertest validated Express controllers and Prisma repositories.

### Frontend Testing (10 Tests)
Component-level unit tests using Vitest, JSDOM, and Testing Library:
- **Routes & Baseline**: Mocked API responses to verify table rendering and badge logic.
- **Comparisons**: Verified Recharts-based visualization and intensity calculations.
- **Banking & Pooling**: Validated complex user interactions and form submissions.

## 🚀 Deployment & Usage

The application is fully dockerized. To start the platform:

```bash
docker-compose up --build
```

Access the dashboard at `http://localhost:3000`.

## 🌐 GitHub Repository
All code, tests, and configuration have been pushed to:
[https://github.com/aniketkharad/FuelEU_Maritime](https://github.com/aniketkharad/FuelEU_Maritime)

---
*Verified by Antigravity*
