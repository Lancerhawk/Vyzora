# Changelog

All notable changes to the Vyzora SDK will be documented in this file.

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
