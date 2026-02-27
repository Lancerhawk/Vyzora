# Vyzora

> Privacy-first, developer-focused analytics service. Track events, reconstruct sessions, and query aggregated metrics — without compromising user privacy.

[![Version](https://img.shields.io/badge/version-v1.0.0-indigo)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Backend](https://img.shields.io/badge/backend-v0.5.2-blue)](backend/package.json)
[![Scalable-API](https://img.shields.io/badge/scalable--api-v0.1.0-blue)](backend-scalable/api/package.json)
[![SDK](https://img.shields.io/badge/sdk-v0.2.3-violet)](runtime-sdk/package.json)
[![Frontend](https://img.shields.io/badge/frontend-v0.6.2-purple)](frontend/package.json)

---

Vyzora is a high-performance analytics service designed for modern developers. It provides:

1. **[`vyzora-sdk`](./runtime-sdk)** — A lightweight TypeScript browser SDK (`< 3 KB` gzipped). Drop it into any JavaScript or TypeScript project. It auto-collects pageviews, tracks SPA navigation, and batches events before sending them to the scalable gateway.

2. **Scalable Ingestion Engine** — A horizontally scalable, asynchronous backend built on **Express, Redis, and BullMQ**. It decouples event reception from database writes, ensuring sub-millisecond API responsiveness even under massive traffic spikes.

3. **Developer Dashboard** — A powerful Next.js interface. Log in with GitHub, create projects, and immediately see pageviews, session counts, top pages, and daily trend charts.

No third-party trackers. No data sampling. No invasive cookies. You own the relationship with your users' data.

---

## Architecture

```mermaid
flowchart TD
    A["Client Website\n(vyzora-sdk)"]
    LB["Nginx Load Balancer\n(8080)"]
    API["Scalable API\n(3 Replicas)"]
    REDIS[("Redis / BullMQ\nEvent Queue")]
    WRK["Scalable Worker\n(3 Replicas)"]
    DB[("PostgreSQL\nindexed on projectId + createdAt")]
    D["Dashboard\n(Next.js · App Router)"]
    E["GitHub OAuth"]

    A -- "POST /api/ingest" --> LB
    LB -- "RR Proxy" --> API
    API -- "Enqueue" --> REDIS
    REDIS -- "Listen" --> WRK
    WRK -- "Bulk Insert" --> DB
    DB -- "Aggregation query" --> API
    API -- "GET /api/projects/:id/metrics" --> D
    D -- "Login" --> E
    E -- "OAuth callback" --> API
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant SDK as vyzora-sdk
    participant API as Backend (Express)
    participant DB as PostgreSQL
    participant UI as Dashboard (Next.js)

    SDK->>SDK: Collect events, manage visitor/session IDs
    SDK->>API: POST /api/ingest { apiKey, events[] }
    API->>DB: Validate apiKey → prisma.event.createMany()
    UI->>API: GET /api/projects/:id/metrics (JWT cookie)
    API->>DB: Aggregate query (pageviews, sessions, top pages)
    DB-->>API: Aggregated rows
    API-->>UI: JSON metrics response
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime SDK** | TypeScript, tsup (ESM + CJS), sendBeacon + fetch transport |
| **Scalable API** | Node.js 20, Express 5, BullMQ (Producer), IORedis |
| **Scalable Worker** | Node.js 20, BullMQ (Consumer), Bulk Insertion Engine |
| **Infrastructure** | Nginx (Load Balancer), Redis, Docker Compose |
| **Database** | PostgreSQL ≥ 15 (Supabase Transaction Mode), Prisma 7 |
| **Frontend** | Next.js 16 (App Router), Tailwind CSS v4, Zustand, React Query |
| **Auth** | GitHub OAuth (Passport.js) for dashboard, project-scoped API keys for ingest |
| **Rate Limiting** | `express-rate-limit` with per-route policies |

---

## SDK Highlights

The `vyzora-sdk` is designed to be zero-overhead and production-safe:

- **Auto pageviews**: fires on `window.load`, `pushState`, `replaceState`, and `popstate` — full SPA support
- **Visitor identity**: stable UUID stored in `localStorage` (`vyzora_vid`), never rotates, in-memory fallback for private browsing
- **Session identity**: UUID (`vyzora_sid`) with 30-minute inactivity expiry, refreshed on every event
- **Batching**: in-memory queue, flushes every 10 seconds, on batch overflow (20 events), on `visibilitychange`, and on `pagehide`
- **Transport**: `navigator.sendBeacon` first, `fetch` with `keepalive: true` as fallback, single retry on 5xx/network errors, silent drop on 4xx
- **Safety**: all `localStorage` access wrapped in `try/catch`, SDK never throws, no-ops in SSR (`window === undefined`)

---

## Scalable Ingestion Highlights

- **Asynchronous Ingestion** (`POST /api/ingest`): The API gateway enqueues events to Redis in milliseconds. Jobs are processed in the background by specialized workers, protecting the API from database-induced latency.
- **Bulk Database Writing**: Workers utilize a dedicated ingestion engine that performs bulk inserts via `prisma.event.createMany({ skipDuplicates: true })`.
- **Database Resilience**: Configured for **Supabase Transaction Mode (Port 6543)** with explicit connection pooling limits, allowing dozens of concurrent workers to handle millions of events without connection overflows.
- **Horizontal Scaling**: Fully containerized architecture allows you to scale up by simply adding replicas (`--scale api=3 --scale worker=3`).
- **Nginx Load Balancer**: Distributes traffic across healthy API replicas and handles automatic failover.
- **Metrics APIs**: Aggregated metrics are calculated in real-time using optimized indices on `(projectId, createdAt)`.

---

## Monorepo Structure

```
vyzora/
├── backend-scalable/         # NEW Scalable Architecture (Recommended)
│   ├── api/                  # API Service (Producer)
│   ├── worker/               # Worker Service (Consumer)
│   ├── nginx/                # Load Balancer config
│   └── scripts/              # Stress testing & maintenance
├── backend/                  # Legacy Monolithic API
│   ├── src/
│   │   ├── controllers/      # auth, ingest, project, metrics
│   │   ├── routes/           # route definitions
│   │   ├── middleware/        # JWT auth, rate limiter
│   │   ├── services/          # business logic
│   │   └── index.ts           # entry point + CORS + session
│   ├── prisma/
│   │   └── schema.prisma      # User, Project, Event models
│   └── .env.example
│
├── frontend/                 # Next.js dashboard + marketing site
│   ├── app/
│   │   ├── page.tsx           # Homepage (marketing)
│   │   ├── docs/              # SDK documentation (17 sections)
│   │   ├── login/             # GitHub OAuth entry
│   │   └── dashboard/         # Project dashboard (metrics, charts)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ChangelogButton.tsx
│   │   ├── DocsSidebar.tsx
│   │   └── dashboard/         # MetricCard, EventTable, TrendChart, etc.
│   └── data/
│       └── versions.json      # Changelog modal data
│
├── runtime-sdk/              # vyzora-sdk npm package
│   ├── src/
│   │   ├── core.ts            # Vyzora class, constructor, track, pageview
│   │   ├── queue.ts           # In-memory event queue + flush logic
│   │   ├── transport.ts       # sendBeacon + fetch + retry
│   │   ├── visitor.ts         # Visitor ID (vyzora_vid)
│   │   ├── session.ts         # Session ID (vyzora_sid) + rotation
│   │   ├── storage.ts         # Safe localStorage wrappers
│   │   └── metadata.ts        # Auto browser metadata collection
│   └── tsup.config.ts
│
├── package.json              # Workspace root (npm workspaces)
├── README.md
└── CHANGELOG.md
```

---

---

## Local Development

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 15
- npm ≥ 9

### 1. Clone

```bash
git clone https://github.com/your-org/vyzora.git
cd vyzora
npm install
```

### 2. Launch Scalable Stack (Default)

The scalable stack uses Docker Compose to orchestrate API replicas, workers, Nginx, and Redis.

```bash
# From the project root
npm run dev:scalable
```

This command will:
1. Spin up **3 API replicas** and **3 Worker replicas**.
2. Launch the **Nginx** Load Balancer at `http://localhost:8080`.
3. Start the **Redis** message bus.
4. Launch the **Next.js Dashboard** at `http://localhost:3000`.

### 3. Stress Test (Verification)

Confirm the system can handle concurrent ingestion:

```bash
npm run stress
```

### 4. SDK (for development)

```bash
cd runtime-sdk
cp .env.example .env
# VYZORA_API_URL=http://localhost:4000/api/ingest
npm run dev   # tsup watch mode
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Express session secret (any long random string) |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `https://your-app.vercel.app`) |
| `PORT` | Backend port (default: `4000`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |

### SDK (`runtime-sdk/.env`)

| Variable | Description |
|---|---|
| `VYZORA_API_URL` | Ingest endpoint (e.g. `http://localhost:4000/api/ingest`) |

---

## Privacy & Security

Vyzora is built from the ground up to be the most private way to track web analytics.

- **No Third-Party Cookies**: Vyzora uses standard first-party identification.
- **GDPR Ready**: We don't track PII by default. Identifiers (Visitor/Session IDs) are anonymous UUIDs.
- **Data Integrity**: Our ingest API uses 64-character cryptographic API keys to ensure only your data reaches your dashboard.
- **Secure Auth**: Dashboard access is protected by GitHub OAuth and secure JWT-based sessions.

---

## SDK Usage

```bash
npm install vyzora-sdk
```

```typescript
import { Vyzora } from 'vyzora-sdk';

const vyzora = new Vyzora({
  apiKey: 'your_project_api_key',  // from dashboard
  enabled: true,
});

// Track a custom event
vyzora.track('upgrade_clicked', { plan: 'pro' });

// Identify a known user
vyzora.identify('user_db_id_123');

// Manual flush (e.g. before logout)
await vyzora.flush();
```

Pageviews are tracked automatically on load and every SPA navigation. No additional setup needed.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

---

## License

[MIT](LICENSE)