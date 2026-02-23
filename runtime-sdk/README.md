# Vyzora-SDK

> Lightweight, production-grade analytics SDK for Vyzora. Framework agnostic, under 7kb minified, and built for reliability.

## Features

- **Framework Agnostic**: Works with Vanilla JS, React, Next.js, Vue, and any SPA.
- **Lightweight**: < 7KB minified (~1.9KB gzipped) with zero external dependencies.
- **Resilient Batching**: Automatically batches events and flushes them intelligently to reduce network overhead.
- **Smart Transport**: Uses `navigator.sendBeacon` for reliable tracking on page unload, with `fetch(keepalive)` fallback.
- **Auto-Tracking**: Automatically collects environment metadata (Browser, OS, Screen) and tracks SPA page transitions.
- **Privacy First**: Explicit opt-in (disabled by default) and no tracking until initialized with `enabled: true`.

## Installation

```bash
npm install @vyzora/sdk
# or
yarn add @vyzora/sdk
```

## Usage

### Simple Initialization

```javascript
import { Vyzora } from '@vyzora/sdk';

const vyzora = new Vyzora({
  apiKey: 'your_project_api_key',
  enabled: true, // Required to activate tracking
  debug: process.env.NODE_ENV === 'development'
});
```

### Tracking Custom Events

```javascript
vyzora.track('purchase_completed', {
  amount: 49.99,
  currency: 'USD',
  item: 'Pro Subscription'
});
```

### Manual Pageviews

```javascript
vyzora.pageview('/custom-path');
```

### Identity Management

Link anonymous events to a known user ID:

```javascript
vyzora.identify('user_123456');
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | **Required** | Your project's 64-character API key. |
| `enabled` | `boolean` | `false` | Must be `true` to active the SDK. |
| `endpoint` | `string` | `https://api.vyzora.io/api/ingest` | Backend ingest URL. |
| `batchSize` | `number` | `20` | Max events per batch before flushing. |
| `flushInterval`| `number` | `10000` | Auto-flush interval in milliseconds. |
| `debug` | `boolean` | `false` | Enable console logging for help in development. |

## License

MIT © [Vyzora](https://vyzora.io)
