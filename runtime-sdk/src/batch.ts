import type { VyzoraEvent } from './tracker';

const MAX_BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 5000;

let queue: VyzoraEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let endpoint = '';
let apiKey = '';

export function initBatch(ingestEndpoint: string, key: string): void {
    endpoint = ingestEndpoint;
    apiKey = key;

    if (typeof window !== 'undefined') {
        flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);

        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flush(true);
        });
    }
}

export function enqueue(event: VyzoraEvent): void {
    queue.push(event);
    if (queue.length >= MAX_BATCH_SIZE) {
        flush();
    }
}

export function flush(useBeacon = false): void {
    if (queue.length === 0 || !endpoint) return;

    const payload = JSON.stringify({ events: queue, apiKey });
    queue = [];

    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, payload);
        return;
    }

    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
    }).catch((err) => {
        console.warn('[Vyzora] Batch flush failed:', err);
    });
}

export function destroyBatch(): void {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
    flush(true);
}
