# Changelog

All notable changes to Vyzora are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.3] - 2026-03-16

### Fixed
- **Ingest**: Resolved timestamp compression by removing hardcoded `createdAt` in bulk ingestion, allowing the database to provide accurate arrival timestamps.
- **Security**: Unified environment configuration (env.ts) across legacy backend, scalable API, and scalable worker. Added professional startup assertions for `JWT_SECRET` in all relevant production services.
- **Architectural Cleanup**: Removed redundant `.env.example` files from sub-packages to follow the root-based environment strategy.

---

## [1.0.2] - 2026-03-16

### Fixed
- **API Security**: Secured the global error middleware to prevent leaking internal stack traces or database schema details to clients during 500 Internal Server Errors in production. Applied to both legacy and scalable backends.
- **OAuth Resilience**: Scoped the GitHub authentication rate limiter specifically to the `/github` redirect endpoint, preventing false-positive lockouts during the OAuth callback phase.

---

## [1.0.1] - 2026-02-27

### Changed
- **SDK — Production Endpoint Update (v0.2.4)**: Updated the default production ingestion endpoint in the SDK distribution to match the newly deployed scalable infrastructure.
- **SDK — Version Synchronization**: Bumped SDK to v0.2.4 and Root to v1.0.1 to reflect the production-ready transport configuration.

---

## [1.0.0] - 2026-02-27

### Added
- **System — High-Performance Scalable Ingestion (v0.1.0)**: Officially stabilized and released the new microservice architecture as the primary backend.
- **System — Load Balancing**: Integrated Nginx as a reverse proxy/load balancer to horizontal targets.
- **System — Asynchronous Processing**: Fully decoupled event ingestion from database persistence using BullMQ and Redis.
- **Verification — Stress Testing**: Included a custom high-performance stress testing tool (`npm run stress`) to validate ingestion throughput.

### Changed
- **Infrastructure**: Defaulted `npm run dev:scalable` to a high-density 3x API and 3x Worker cluster.
- **Database**: Migrated to Supabase Transaction Mode (Port 6543) and implemented client-side connection pooling limits for massive horizontal scale.
- **Observability**: Upgraded all service logs to professional, color-coded status indicators.

### Fixed
- **Types — Redis Integration**: Resolved TypeScript mismatches between BullMQ and IORedis with safe type casting and ESLint suppression.

---

## [0.9.5] - 2026-02-26

### Added
- **System — Scalable Architecture Foundation (v0.0.1)**: Architected and implemented a new horizontally scalable microservice foundation in `backend-scalable/`.
- **System — Infrastructure**: 
    - Isolated the new architecture into `api`, `worker`, and `nginx` components.
    - Integrated with **Redis** and **BullMQ** for asynchronous "Producer-Consumer" event processing.
    - Added comprehensive **Docker Compose** orchestration for local and production-parity testing.
- **System — Workspace Integration**: Added `npm run dev:scalable` to concurrently launch the new microservice stack and the dashboard.

### Fixed
- **System — Version Sync**: Bumped Root to v0.9.5 and initialized Scalable Architecture components at v0.0.1.

---

## [0.9.4] - 2026-02-25

### Added
- **Frontend (v0.6.2) — Feedback System**: Implemented a professional feedback modal with glassmorphism design. Integrated with SendGrid to provide automated email notifications for new submissions.
- **Frontend (v0.6.2) — Email Infrastructure**: Added robust email deliverability features including plain-text alternatives, reply-to headers, and premium HTML templates with badges for feedback types (Bug, feature, fix).

### Changed
- **Frontend (v0.6.2) — Mobile Optimization**: 
  - Simplified mobile navbar animations to prevent layout jumping on scroll.
  - Optimized homepage hero section for mobile viewports by hiding the top badge and refining vertical centering.
  - Reconfigured hero stats bar for horizontal alignment on small screens with simplified labels.
  - Hardened `/docs` page layout with optimized heading sizes and increased top padding for better clearance from the sticky navbar.

### Fixed
- **System — Version Sync**: Bumped Root to v0.9.4 and Frontend to v0.6.2 to reflect the feedback system and mobile accessibility milestone.

---

## [0.9.3] - 2026-02-24

### Fixed
- **Backend (v0.5.2) — CORS Refinement**: Replaced the wildcard (`*`) origin policy on the ingestion route with a dynamic reflected-origin strategy. This resolves a critical browser security error where wildcard origins are blocked for requests containing credentials (like cookies or auth headers).
- **System — Version Sync**: Bumped Root to v0.9.3 and Backend to v0.5.2 to finalize the cross-domain ingestion infrastructure.

---

## [0.9.2] - 2026-02-24

### Changed
- **Backend (v0.5.1) — Ingestion Accessibility**: Split CORS configuration to allow universal access (`*`) for the ingestion endpoint while maintaining strict protection for authentication and project management routes. This allows tracking from any external domain.
- **System — Version Sync**: Bumped Root to v0.9.2 and SDK to v0.2.3 to reflect the transition to a universal analytics infrastructure.

### Fixed
- **Analytics SDK (v0.2.3) — Initialization Reliability**: Hardened the SDK's initialization logic. It now checks `document.readyState` to trigger tracking immediately if the library loads after the page is already interactive or complete, ensuring no pageviews are missed in fast-loading SPAs.
- **Analytics SDK (v0.2.3) — Type & Build Cleanup**: Resolved TypeScript property errors and fixed `history.pushState` wrapping types to ensure a clean build and full ESM/CJS compatibility.

---

## [0.9.1] - 2026-02-24

### Fixed
- **Frontend (v0.6.1) — Mobile Sidebar Fix**: Resolved a critical interactivity bug where the dashboard sidebar would immediately close on mobile viewports due to a misplaced event reference on the hidden desktop sidebar.
- **Frontend (v0.6.1) — UX Refinement**: Added explicit `cursor-pointer` styles to all interactive sidebar elements (project selection, sign-out) to provide consistent visual feedback across desktop and mobile.
- **System — Version Sync**: Bumped Root to v0.9.1 and Frontend to v0.6.1 to reflect the dashboard accessibility pass.

---

## [0.9.0] - 2026-02-24

### Added
- **Frontend (v0.6.0) — Dashboard Redesign**: Completely overhauled the dashboard layout to a modern two-column structure. Added a dedicated right-side panel for core project statistics.
- **Frontend (v0.6.0) — Sparklines**: Integrated live trend sparklines into `StatCard` components using Recharts `AreaChart`, providing instant visual context for metrics like Pageviews and Unique Visitors.
- **Frontend (v0.6.0) — Side-by-Side Charts**: Reconfigured the main dashboard view to display "Activity Over Time" (60%) and "Browser Distribution" (40%) side-by-side in a responsive grid.
- **Frontend (v0.6.0) — Enhanced Code Blocks**: Introduced a `CodeBlock` component with manual regex-based syntax highlighting and copy-to-clipboard functionality for a premium documentation experience.

### Changed
- **Frontend (v0.6.0) — UI Polish & Alignment**: 
  - Implemented flex-based height equalization for all side-by-side dashboard panels.
  - Added vertical centering for chart contents to ensure visual balance.
  - Improved `BrowserPieChart` responsiveness: legend now supports vertical scrolling with a "hide-until-hover" custom scrollbar to prevent height overflow.
  - Refined table layouts for Top Pages and Top Events to wrap correctly on smaller viewports.

---

## [0.8.0] - 2026-02-24

### Changed
- **Frontend (v0.5.0) — Homepage Rewrite**: Completely replaced the homepage with a professional, technically accurate landing page. New sections: SDK code preview panel with syntax highlighting, tech stack grid (6 components with exact versions and roles), redesigned 2×2 feature cards using SVG icons instead of emojis with per-card gradient accents and 3 technical bullet points per card. Copy rewritten to remove marketing language and reference real code behavior.
- **Frontend (v0.5.0) — Docs Rewrite**: Replaced the entire `/docs` page with 17 technically accurate sections derived directly from SDK and backend source code — no invented features, no vague descriptions.

### Fixed
- **Frontend (v0.5.0) — Docs Mobile Responsiveness**: Fixed horizontal overflow on mobile caused by `white-space: pre` code blocks lacking `max-width: 100%`. Fixed fixed-width (`w-48`, `w-28`, `w-40`) flex rows in metadata and API reference cards — now stack vertically on mobile, side-by-side from `sm` breakpoint up.
- **Frontend (v0.5.0) — ChangelogButton Mobile**: Modal now uses `min(600px, 100vh - 2rem)` height. Two-column version sidebar replaced with a horizontal scrollable pill selector on mobile (`md:hidden`). Original two-column layout preserved on desktop.
- **Frontend (v0.5.0) — Features Section**: Removed emoji FeatureCard grid. Replaced with inline 2×2 card design using SVG icons in colored icon wells, Tailwind JIT-safe static `dotColor` class per card, and visible bullet points at `text-gray-400`.

---

## [0.7.2] - 2026-02-23

### Added
- **Backend (v0.5.0)**: Integrated a request logger for API health monitoring and detailed trace logs for the GitHub OAuth flow.

### Fixed
- **Backend (v0.5.0)**: Resolved cross-domain authentication failures by enabling `SameSite=None` and `Secure` cookie session persistence for production deployments (Vercel to EC2/OCI).

---

## [0.7.1] - 2026-02-23

### Fixed
- **Analytics SDK (v0.2.1)**: Corrected package entry point paths in `package.json` to ensure valid ESM/CJS distribution.

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
