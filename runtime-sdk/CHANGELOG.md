# Changelog

All notable changes to the Vyzora SDK will be documented in this file.


## [0.2.2] - 2026-02-23

### Changed
- **Internal Optimization**: Internal updates to ensure compatibility with production deployment of the Vyzora platform.


## [0.2.1] - 2026-02-23

### Fixed
- **Package Distribution**: Corrected `package.json` entry point paths (`main`, `module`, `exports`) to match actual `dist` filenames (`index.js` for CJS, `index.mjs` for ESM). Fixes "Module not found" errors in some bundlers.

## [0.2.0] - 2026-02-23

### Added
- **Safe Storage Layer** (`storage.ts`) — New `safeGet`, `safeSet`, `safeRemove` utilities wrap all `localStorage` access. Silent on all failures (Safari private mode, `SecurityError`, `QuotaExceededError`). Never throws, never crashes.
- **In-Memory Visitor Fallback** — If `localStorage` is unavailable, `visitorId` falls back to a stable module-level variable for the page lifetime instead of generating a new UUID on every call.
- **`historyWrapped` Singleton Guard** — Prevents `pushState` / `replaceState` from being wrapped more than once, even if the SDK is instantiated multiple times.

### Changed
- **Session Storage** — Migrated from `sessionStorage` to `localStorage`. Keys renamed to `vyzora_sid` and `vyzora_session_ts` for persistence across tabs.
- **Visitor ID Key** — Renamed from `vyzora_visitor_id` to `vyzora_vid` for conciseness.
- **Full-Path Pageview Deduplication** — `pageview()` now compares `pathname + search` (not just `pathname`). Hash-only changes (`#anchor`) are correctly ignored.
- **Session Timestamp** — `vyzora_session_ts` is updated on **every** `getSessionId()` call, not only on session creation. Prevents mid-activity session expiry.
- **Flush Race Guard** — Added `flushing` boolean flag to `Queue`. Concurrent flush calls (e.g., simultaneous `visibilitychange` + `pagehide`) are blocked until the first finishes.
- **Flush Safety** — `sendBatch` is now wrapped in `try/finally`, ensuring the `flushing` lock always resets — even if the transport layer throws. Prevents permanent queue deadlock.
- **Retry Policy** — `fetchWithRetry` now only retries on `status >= 500` or network failures. `4xx` responses (`401`, `403`, `429`) are dropped silently to prevent hammering the backend.
- **`lastTrackedPath` Ordering** — Updated **after** `queue.push()` in `pageview()`, ensuring a failed enqueue does not corrupt the deduplication state.

### Removed
- **`batch.ts`** — Legacy global-state batching module. Redundant with the class-based `Queue`. Removed to reduce bundle risk and dead code.
- **`tracker.ts`** — Legacy functional tracking layer that depended on `batch.ts`. Also not exported from the public API. Removed.

## [0.1.1] - 2026-02-23

### Fixed
- **Stability**: Prevented duplicate interval creation for auto-flushing.
- **Reliability**: Confirmed `visibilitychange` and `pagehide` flush handling.
- **Lifecycle**: Stabilized batching and interval lifecycle management.

### Changed
- Increased default `batchSize` to 20.
- Increased default `flushInterval` to 10 seconds (10000ms).

## [0.1.0] - 2026-02-23

### Added
- Initial release of the production-grade Vyzora Analytics SDK.
- Support for framework-agnostic usage (Vanilla JS, React, Next.js, SPAs).
- Batched event delivery with configurable `batchSize` and `flushInterval`.
- Reliable transport using `navigator.sendBeacon` and `fetch(keepalive)`.
- Automatic metadata collection: Browser, OS, Screen resolution, Language, Referrer, and Timezone.
- Automatic SPA pageview tracking (wraps `pushState`, `replaceState`, and listens to `popstate`).
- Intelligent 30-minute inactivity session management.
- Persistent `visitorId` management via `localStorage`.
- Explicit `enabled` flag to ensure zero-cost when inactive.
- Centralized `Logger` for safe debug output without lint warnings.
