# 🚢 Fuel EU Maritime Compliance Platform

A complete Hexagonal Architecture (Ports and Adapters) platform for maritime emissions tracking, compliant with Fuel EU Article 20 (Banking) and Article 21 (Pooling).

## 🚀 Features
- **Routes Tracking**: Visualize and track GHG Intensity (gCO₂e/MJ) per route metrics.
- **Baseline Comparatives**: Designate baselines dynamically to gauge total fuel emission deviations via Recharts data-visualizations.
- **Article 20 (Banking)**: Transparent ledgers tracking surpluses securely into consecutive periods and offsetting temporal deficiencies securely.
- **Article 21 (Pooling)**: Group disparate vessels into mathematical compliance hubs deploying Greedy Algorithm mechanisms transferring surplus efficiently to deficit entities without punitive regressions.

## 🏗️ Architecture Matrix
Both endpoints utilize **Ports & Adapters**, ensuring strict separation.
- **Backend (Node.js + Postgres)**: Express acts purely as the `Inbound Adapter`, Prisma as the `Outbound Adapter`. Application logic and pure mathematical formulas reside deep within the pristine `Core`.
- **Frontend (React + Vite + Tailwind)**: Axios serves as `Infrastructure Adapters` translating external dependencies to isolated React `UI Components` and `Domain Entities`.

## ⚙️ Quick Start Installation (Docker)

Ensure Docker Desktop / daemon is executing before performing operations.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aniketkharad/FuelEU_Maritime.git
   cd FuelEU_Maritime
   ```

2. **Boot the Cluster:**
   ```bash
   # Initiates Postgres database, Node backend, and Nginx frontend
   docker-compose up --build -d
   ```

3. **Initialize the Backend Schemas & Data:**
   ```bash
   # Run prisma migrations on the host or inside the container to seed
   cd backend
   npm install
   npx prisma db push
   npx prisma db seed
   ```

4. **Navigate to Platform:**
   Open `http://localhost:8080/`

## 🛠️ Local Development Server setup

If executing natively without Docker is preferable:
1. Turn on DB `docker-compose up postgres -d`
2. Backend: `cd backend && npm install && npx prisma db push && npx prisma db seed && npm run dev` (Available on `http://localhost:3001`)
3. Frontend: `cd frontend && npm install && npm run dev` (Available on `http://localhost:5173`)