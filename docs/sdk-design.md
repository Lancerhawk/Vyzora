# Vyzora SDK Design

## Overview

The Vyzora SDK is a lightweight, zero-dependency analytics client for the browser. Distributed as an ESM/CJS npm package (`@vyzora/sdk`) and a CDN-hosted IIFE that exposes `window.Vyzora`.

---

## Module Architecture

```mermaid
graph LR
    A["index.ts\nPublic API\ninit · track · destroy"] --> B["tracker.ts\nEvent assembly\ntrack · trackPageView"]
    A --> C["session.ts\nSession lifecycle\ngetSessionId · resetSession"]
    A --> D["batch.ts\nQueue + flush\nenqueue · flush · destroyBatch"]
    B --> C
    B --> D
```

---

## Batching Strategy

```mermaid
flowchart TD
    E["event tracked"] --> Q["Add to queue"]
    Q --> SIZE{queue.length\n>= 10?}
    SIZE -- Yes --> FLUSH["flush()"]
    SIZE -- No --> TIMER{Timer fired?\n5s interval}
    TIMER -- Yes --> FLUSH
    TIMER -- No --> UNLOAD{Page hidden?\nvisibilitychange}
    UNLOAD -- Yes --> BEACON["flush via\nnavigator.sendBeacon"]
    UNLOAD -- No --> Q

    FLUSH --> FETCH["fetch() POST\n/api/ingest"]
    BEACON --> END["Guaranteed delivery\non tab close"]
    FETCH --> END2["202 Accepted"]
```

### Flush Triggers

| Trigger | Condition |
|---------|-----------|
| Size-based | Queue reaches 10 events |
| Time-based | Every 5 seconds |
| Page unload | `visibilitychange` → `hidden` |

### Flush Mechanism

- **Normal**: `fetch()` with `keepalive: true`
- **Page unload**: `navigator.sendBeacon()` — guaranteed even when tab closes

---

## Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> NoSession: First page load
    NoSession --> Active: generateId() → sessionStorage
    Active --> Active: getSessionId() returns existing ID
    Active --> NoSession: Tab closed (sessionStorage cleared)
    Active --> Reset: resetSession() called
    Reset --> NoSession
```

- Session ID is a UUIDv4 stored in `sessionStorage`
- Resets automatically when the browser tab closes
- `resetSession()` exposed publicly for post-logout use

---

## Retry Logic (Phase 2)

```mermaid
flowchart LR
    FAIL["Fetch fails"] --> R1["Retry 1s"]
    R1 --> R2["Retry 2s"]
    R2 --> R3["Retry 4s"]
    R3 --> MAX{Max retries\nreached?}
    MAX -- No --> R1
    MAX -- Yes --> LS["Persist to localStorage\nfor next page load"]
```

---

## Fail-Safe Behaviour

| Scenario | Behaviour |
|----------|-----------|
| Called in SSR / Node context | All methods guard `typeof window === 'undefined'` |
| `init()` called twice | No-op with console warning |
| `sendBeacon` unavailable | Falls back to `fetch()` |
| Network offline | Error caught silently (Phase 2: retry queue) |

---

## CDN Usage

```html
<script src="https://cdn.vyzora.io/sdk.js" defer></script>
<script>
  window.addEventListener('load', function () {
    Vyzora.init({ apiKey: 'vyz_your_project_key' });
  });
</script>
```

## npm Usage

```bash
npm install @vyzora/sdk
```

```ts
import { init, track } from '@vyzora/sdk';

init({ apiKey: 'vyz_your_project_key' });
track('button_click', { properties: { buttonId: 'cta-signup' } });
```

---

## Build Output

| Format | File | Use case |
|--------|------|----------|
| ESM | `dist/index.js` | Bundlers (Vite, Next.js) |
| CJS | `dist/index.cjs` | Node.js / `require()` |
| Types | `dist/index.d.ts` | TypeScript consumers |
| IIFE | `dist/sdk.global.js` | CDN `<script>` tag |
