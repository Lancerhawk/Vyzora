# vyzora-sdk

> Lightweight, production-grade analytics SDK for Vyzora. Framework-agnostic, under 7KB minified, zero dependencies, built for reliability.

[![npm version](https://img.shields.io/npm/v/vyzora-sdk.svg?color=orange)](https://www.npmjs.com/package/vyzora-sdk)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/Lancerhawk/Vyzora/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/vyzora-sdk?color=brightgreen)](https://bundlephobia.com/package/vyzora-sdk)
[![Repo](https://img.shields.io/badge/repo-GitHub-indigo)](https://github.com/Lancerhawk/Vyzora/tree/main/runtime-sdk)

---

## Features

- **Framework Agnostic** — Works with Vanilla JS, React, Next.js, Vue, Svelte, and any SPA.
- **Lightweight** — < 7KB minified (~2KB gzipped). Zero runtime dependencies.
- **Resilient Batching** — Batches events and flushes intelligently. Prevents empty sends, duplicate flushes, and race conditions.
- **Smart Transport** — Uses `navigator.sendBeacon` for unload reliability, with `fetch(keepalive)` fallback.
- **Auto-Tracking** — Collects browser, OS, screen, and language metadata automatically.
- **SPA Navigation** — Wraps `pushState` and `replaceState` to track all client-side route changes.
- **Persistent Identity** — Stable `visitorId` in `localStorage` (`vyzora_vid`). Falls back to in-memory if storage is unavailable.
- **Session Management** — 30-minute inactivity-based session rotation. Stored in `localStorage` (`vyzora_sid`).
- **Privacy First** — Explicit opt-in. Zero listeners and zero timers until `enabled: true`.
- **Safari Safe** — All storage access wrapped in `try/catch`. Never crashes in private mode.

---

## Installation

```bash
npm install vyzora-sdk
# or
yarn add vyzora-sdk
# or
pnpm add vyzora-sdk
```

---

## Quick Start

```typescript
import { Vyzora } from 'vyzora-sdk';

const vyzora = new Vyzora({
  apiKey: 'your_project_api_key',
  enabled: true,
});
```

The SDK starts tracking automatically: visitor ID is generated, session begins, and the initial pageview is recorded on `window.load`.

---

## Framework Integration

### Next.js (App Router)

Create a client component provider and add it to your root layout:

```tsx
// components/VyzoraProvider.tsx
'use client';

import { useEffect } from 'react';
import { Vyzora } from 'vyzora-sdk';

export default function VyzoraProvider() {
  useEffect(() => {
    new Vyzora({
      apiKey: process.env.NEXT_PUBLIC_VYZORA_KEY!,
      enabled: process.env.NEXT_PUBLIC_VYZORA_ENABLED === 'true',
    });
  }, []);

  return null;
}
```

```tsx
// app/layout.tsx
import VyzoraProvider from '@/components/VyzoraProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <VyzoraProvider />
        {children}
      </body>
    </html>
  );
}
```

### React (CRA / Vite)

```tsx
// src/main.tsx
import { Vyzora } from 'vyzora-sdk';

new Vyzora({
  apiKey: import.meta.env.VITE_VYZORA_KEY,
  enabled: true,
});
```

### Vanilla JS (Script Tag)

```html
<script src="https://cdn.jsdelivr.net/npm/vyzora-sdk/dist/index.mjs" type="module"></script>
<script type="module">
  import { Vyzora } from 'vyzora-sdk';
  new Vyzora({ apiKey: 'your_key', enabled: true });
</script>
```

### Vue 3

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { Vyzora } from 'vyzora-sdk';

new Vyzora({ apiKey: 'your_key', enabled: true });
createApp(App).mount('#app');
```

---

## API Reference

### `new Vyzora(config)`

Instantiates the SDK. No listeners or timers are created unless `enabled: true`.

```typescript
const vyzora = new Vyzora({
  apiKey: 'your_project_api_key',  // Required
  enabled: true,
  debug: false,
  endpoint: 'https://api.vyzora.io/api/ingest',
  batchSize: 20,
  flushInterval: 10000,
});
```

### `vyzora.track(eventType, metadata?)`

Track a custom event with optional metadata.

```typescript
vyzora.track('button_click', {
  buttonId: 'upgrade-cta',
  plan: 'pro',
});

vyzora.track('purchase_completed', {
  amount: 49.99,
  currency: 'USD',
});
```

### `vyzora.pageview(path?)`

Manually record a pageview. Path defaults to `window.location.pathname + window.location.search`.
Duplicate paths are deduplicated automatically.

```typescript
vyzora.pageview('/pricing');
vyzora.pageview(); // uses current URL
```

### `vyzora.identify(visitorId)`

Link all future events to a known user identity (e.g., after login).

```typescript
vyzora.identify('user_123456');
```

### `vyzora.flush()`

Manually flush all queued events immediately.

```typescript
await vyzora.flush();
```

### `vyzora.resetSession()`

Force a new session ID on the next tracked event.

```typescript
vyzora.resetSession();
```

### `vyzora.destroy()`

Tear down the SDK — clears the flush interval and removes all event listeners.

```typescript
vyzora.destroy();
```

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **Required** | Your project's API key from the Vyzora dashboard. |
| `enabled` | `boolean` | `false` | Must be `true` to activate tracking. |
| `endpoint` | `string` | `https://api.vyzora.io/api/ingest` | Backend ingest URL. Override for self-hosted deployments. |
| `batchSize` | `number` | `20` | Max events per batch before an immediate flush is triggered. |
| `flushInterval` | `number` | `10000` | Auto-flush interval in milliseconds (default: 10 seconds). |
| `debug` | `boolean` | `false` | Enables verbose console logging in development. |

---

## Build-Time Endpoint Configuration

For SDK contributors or self-hosted deployments, the default endpoint can be configured at build-time using a `.env` file:

```env
# runtime-sdk/.env
VYZORA_API_URL=https://your-custom-api.com/api/ingest
```

Then rebuild:

```bash
npm run build
```

The URL is injected by `tsup` at compile time — no hardcoded URLs in source code.

---

## Storage Keys

The SDK persists data to `localStorage` using the following keys:

| Key | Description |
|-----|-------------|
| `vyzora_vid` | Stable visitor UUID. Never rotates. |
| `vyzora_sid` | Current session UUID. Rotates after 30 minutes of inactivity. |
| `vyzora_session_ts` | Timestamp of last activity. Updated on every `track()` call. |

All storage access is wrapped in `try/catch`. If `localStorage` is unavailable (e.g., Safari private mode), visitor ID falls back to a stable in-memory value for the page lifetime.

---

## Safety Guarantees

- **Zero global pollution** — No `window.*` mutations, no prototype modifications.
- **No double flush** — A `flushing` lock flag prevents concurrent send calls.
- **No duplicate intervals** — `start()` checks for an existing timer before creating one.
- **No duplicate pageviews** — `lastTrackedPath` (with full `pathname + search`) deduplicates SPA transitions.
- **No 4xx retries** — Only `5xx` and network errors trigger a single retry. `401`/`403`/`429` are dropped silently.
- **No crash guarantee** — Every internal operation is wrapped in `try/catch`.

---

## License

MIT © [Vyzora](https://github.com/Lancerhawk/Vyzora)
