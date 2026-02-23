# Changelog

All notable changes to Vyzora are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.7.0] - 2026-02-23

### Changed
- **Analytics SDK v0.2.0 — Production Safety Hardening**:
  - New `storage.ts` safe layer: all `localStorage` access wrapped in `try/catch` (`SecurityError`, `QuotaExceededError` handled silently)
  - Visitor ID key renamed to `vyzora_vid`; stable in-memory fallback for Safari private mode
  - Session migrated from `sessionStorage` → `localStorage` (keys: `vyzora_sid`, `vyzora_session_ts`)
  - Session timestamp updated on every `track()` call — prevents mid-activity expiry
  - `flushing` lock flag on `Queue` prevents concurrent `visibilitychange` + `pagehide` double-sends
  - `sendBatch` wrapped in `try/finally` — flush lock always resets, no queue deadlock possible
  - Retry policy tightened: only `5xx` and network errors retry; `4xx` dropped silently
  - Full-path pageview deduplication (`pathname + search`) — hash changes ignored
  - History wrap singleton (`historyWrapped`) — no double-wrapping on re-initialization
  - `lastTrackedPath` updated after enqueue, never before
  - Removed legacy `batch.ts` and `tracker.ts` (dead code)
  - Full SDK README rewritten with framework integrations, API reference, and storage key documentation

---

## [0.6.1] - 2026-02-23

### Added
- **Production-Grade Analytics SDK (v0.1.1)**:
  - Stabilized batching logic and interval-based flush cycles
  - Increased default batch size to 20 and flush interval to 10 seconds for reduced network overhead
  - Prevented duplicate interval creation for a cleaner singleton footprint
  - Verified reliable data delivery during `visibilitychange` and `pagehide` events
- **Frontend (v0.4.2)**:
  - Re-implemented SDK integration using the new `@vyzora/sdk` v0.1.1
  - Added build-time environmental variable injection for default ingest endpoints

---

## [0.6.0] - 2026-02-23

### Added
- **Production-Grade Analytics SDK (v0.1.0) Initial Release**:
  - Launched a lightweight (< 7KB) TypeScript SDK for reliable event tracking
  - Built-in batched event delivery system with `sendBeacon` resilience
  - Automatic environment metadata collection (Browser, OS, Screen, etc.)
  - Intelligent SPA pageview tracking supporting React, Next.js, and Vanilla JS
  - 30-minute inactivity-based session management
  - Explicit opt-in architecture for zero-cost performance when disabled
  - Resilient single-retry transport layer for high data durability
  - Comprehensive documentation and usage guides for developers

---

## [0.5.1] - 2026-02-23

### Added
- **Frontend (v0.4.1)**:
  - Built a professional preloader animation for the homepage — logo fade-in, brand name reveal, gradient progress bar fill, and curtain-lift exit (`translateY(-100%)`)
  - Preloader now only fires on the homepage (`/`) and only once per real browser page load (module-level flag prevents duplicate triggers on client-side navigation)
  - Fixed Next.js hydration mismatch caused by `typeof window` in SSR — preloader now activates exclusively via `useEffect`, ensuring server/client render parity
  - Updated browser tab title and meta description to professional engineering-focused copy
  - Updated favicon to use `logo.svg`
  - Refined Footer brand description copy

---

## [0.5.0] - 2026-02-23


### Added
- **Backend (v0.4.0)**:
  - Added time-series analytics endpoint (events, visitors, sessions by day)
  - Added top pages aggregation
  - Added top events aggregation
  - Added session explorer endpoint with duration calculation
  - Added browser distribution analytics from metadata
  - Optimized DB queries using raw SQL and `COUNT(DISTINCT)`
  - Enforced strict ownership validation before analytics queries
  - Maintained rate limiting and project caps
- **Frontend (v0.4.0)**:
  - Implemented full analytics dashboard layout
  - Added Events Over Time line chart
  - Added Top Pages and Top Events tables
  - Implemented Session Explorer UI
  - Added Browser Distribution pie chart
  - Integrated all new backend analytics endpoints
  - Improved loading and empty states
- **System**:
  - Verified complete ingestion → aggregation → visualization pipeline
  - Dashboard now reflects real behavioral analytics, not just counters


## [0.4.0] - 2026-02-22

### Added
- **Backend (v0.3.0)**:
  - Implemented full GitHub OAuth flow with JWT (HttpOnly cookie)
  - Added authentication middleware (cookie-based verification)
  - Added project CRUD with ownership validation
  - Introduced rate limiting (auth, project creation, ingest, metrics)
  - Enforced 50-project lifetime cap per user
  - Replaced distinct findMany metrics with optimized raw SQL aggregation
  - Implemented secure API key validation for ingest
- **Frontend (v0.3.0)**:
  - Integrated full auth flow (GitHub login + session context)
  - Implemented protected dashboard routing
  - Connected dashboard to real backend APIs
  - Added project creation + deletion UI
  - Implemented live metrics fetching (events, visitors, sessions, pageviews)
  - Established end-to-end ingestion → metrics → UI pipeline


## [0.3.0] - 2026-02-22

### Added
- **Frontend**: Implemented SaaS landing page, docs layout, and dynamic sticky navbar (v0.2.0)
  - Responsive SaaS-style landing page with hero, features, architecture, and CTA sections
  - Scroll-reactive navbar (absolute → fixed with blur, border, and shadow)
  - Reusable components: `Navbar`, `Footer`, `FeatureCard`, `DocsSidebar`
  - Documentation page with fixed sidebar and anchor-based navigation
  - Styled placeholders for `/dashboard` and `/login` routes
  - Dark theme design system with gradient text and glow utilities
  - Consistent container layout (`max-w-7xl`, `mx-auto`, `px-6`)
  - Smooth transitions, hover effects, and scroll-margin adjustments

## [0.2.0] - 2026-02-22


### Added
- **Backend**: Core ingestion layer with Supabase integration
  - Implemented PostgreSQL schema models: `User`, `Project`, `Event`
  - Added model-level and composite indexing for high-performance time-range queries
  - Integrated Supabase via `DATABASE_URL` (Prisma PostgreSQL adapter)
  - Implemented secure 64-character hex API key generation
  - Added `ProjectService` (create, list, validate) and `IngestService` (bulk insertion)
  - Enforced strict Zod validation matching database schema constraints
  - Added request body size guard (1mb)
  - Added seeding and API verification scripts
- **Prisma**: Configured `prisma.config.ts` for Prisma 7 compatibility and migrations

## [0.1.0] - 2026-02-22

### Added
- Monorepo structure created (`backend/`, `frontend/`, `runtime-sdk/`, `docs/`)
- **Backend** scaffolded with Node.js + TypeScript + Express + Prisma
  - Folder structure: `src/routes`, `src/controllers`, `src/middleware`, `src/services`, `src/config`
  - Express server entry point (`src/index.ts`)
  - Prisma schema initialized (`prisma/schema.prisma`)
  - `.env.example` with all required environment variable keys
- **Frontend** scaffolded with Next.js 15 (App Router) + TypeScript + TailwindCSS
  - Dark theme configured by default
  - Route stubs: `/dashboard`, `/login`
  - Folder structure: `app/`, `components/`, `lib/`, `styles/`
- **Runtime SDK** scaffolded as a TypeScript npm package
  - Source modules: `tracker.ts`, `session.ts`, `batch.ts`
  - Build system configured with `tsup` (ESM + CJS dual output)
- **Documentation** initialized
  - `docs/architecture.md` — system architecture and data flow
  - `docs/sdk-design.md` — SDK batching and session strategy
  - `docs/api-spec.md` — REST API endpoint specifications
- Root `README.md` with project overview, architecture diagram, and setup guide
