# Vyzora System Architecture

## Overview

Vyzora is a multi-tenant analytics SaaS platform. Developers instrument their apps with the Vyzora SDK, which batches events and sends them to the backend API. Metrics are aggregated and served to the dashboard.

---

## Component Architecture

```mermaid
graph TD
    subgraph Client["Client Website"]
        SDK["Vyzora Runtime SDK\n• Event collection\n• Session management\n• Batch queue"]
    end

    subgraph Backend["Backend (Express + TypeScript)"]
        INGEST["Ingestion Controller\nPOST /api/ingest"]
        AUTH["Auth Controller\nGitHub OAuth + JWT"]
        PROJECTS["Projects Controller\nGET /api/projects/:id"]
        METRICS["Metrics Controller\nGET /api/projects/:id/metrics"]
        MW["Middleware\nJWT auth · API key validation · Error handler"]
    end

    subgraph DB["PostgreSQL (Prisma ORM)"]
        USERS[("users")]
        PROJECTS_T[("projects")]
        API_KEYS[("api_keys")]
        EVENTS[("events")]
    end

    subgraph Frontend["Dashboard (Next.js)"]
        LOGIN["/login\nGitHub OAuth button"]
        DASH["/dashboard\nProject overview"]
        DETAIL["Project Detail\nMetrics + charts"]
    end

    SDK -- "POST /api/ingest\n(apiKey + events[])" --> INGEST
    INGEST --> MW
    MW --> EVENTS
    PROJECTS --> MW
    METRICS --> MW
    MW --> EVENTS
    USERS --- PROJECTS_T
    PROJECTS_T --- API_KEYS
    PROJECTS_T --- EVENTS
    LOGIN -- "GET /auth/github" --> AUTH
    AUTH -- "JWT" --> DASH
    DASH --> DETAIL
    DETAIL -- "GET metrics" --> METRICS
```

---

## Data Flow

### Event Ingestion

```mermaid
sequenceDiagram
    participant SDK
    participant API as Backend API
    participant DB as PostgreSQL

    SDK->>SDK: Collect event
    SDK->>SDK: Enqueue (max 10 or 5s)
    SDK->>API: POST /api/ingest {apiKey, events[]}
    API->>DB: SELECT project WHERE api_key = ?
    DB-->>API: Project found
    API->>DB: INSERT INTO events (batch)
    DB-->>API: OK
    API-->>SDK: 202 Accepted
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant API as Backend API
    participant GitHub

    User->>Dashboard: Click "Continue with GitHub"
    Dashboard->>API: GET /auth/github
    API->>GitHub: Redirect to OAuth
    GitHub-->>API: GET /auth/github/callback?code=...
    API->>API: Verify code, upsert user in DB
    API-->>Dashboard: Redirect with JWT
    Dashboard->>Dashboard: Store JWT, navigate to /dashboard
```

---

## Multi-Tenant Model

```mermaid
erDiagram
    USER {
        uuid id PK
        string githubId
        string email
        string name
    }
    PROJECT {
        uuid id PK
        string name
        string domain
        uuid userId FK
    }
    API_KEY {
        uuid id PK
        string key
        uuid projectId FK
    }
    EVENT {
        uuid id PK
        string type
        string url
        string sessionId
        json properties
        datetime timestamp
        uuid projectId FK
    }

    USER ||--o{ PROJECT : owns
    PROJECT ||--o{ API_KEY : has
    PROJECT ||--o{ EVENT : receives
```

---

## Scalability Notes

| Concern | Strategy |
|---------|----------|
| Stateless backend | JWT auth — horizontally scalable behind a load balancer |
| Ingest throughput | Client-side batching reduces HTTP requests 10× |
| Query performance | Index `events (projectId, timestamp)` for fast metric aggregation |
| Future | Decouple ingestion with BullMQ/Redis message queue |
