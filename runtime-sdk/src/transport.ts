import type { InternalEvent, IngestPayload } from './types';
import type { Logger } from './logger';

const RETRY_DELAY_MS = 2000;

export async function sendBatch(
    endpoint: string,
    apiKey: string,
    events: InternalEvent[],
    debug: boolean,
    logger: Logger
): Promise<void> {
    if (events.length === 0) return;

    const payload: IngestPayload = { apiKey, events };
    const body = JSON.stringify(payload);
    const headers = { 'Content-Type': 'application/json' };

    if (
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function'
    ) {
        const blob = new Blob([body], { type: 'application/json' });
        const sent = navigator.sendBeacon(endpoint, blob);
        if (sent) {
            logger.log('Batch sent via sendBeacon', { count: events.length });
            return;
        }
    }

    await fetchWithRetry(endpoint, body, headers, debug, logger);
}

async function fetchWithRetry(
    endpoint: string,
    body: string,
    headers: Record<string, string>,
    debug: boolean,
    logger: Logger,
    attempt = 0
): Promise<void> {
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body,
            keepalive: true,
        });

        logger.log(`Batch flush (attempt ${attempt + 1}) →`, res.status);

        if (!res.ok && attempt === 0) {
            setTimeout(
                () => fetchWithRetry(endpoint, body, headers, debug, logger, 1),
                RETRY_DELAY_MS
            );
        }
    } catch {
        if (attempt === 0) {
            setTimeout(
                () => fetchWithRetry(endpoint, body, headers, debug, logger, 1),
                RETRY_DELAY_MS
            );
        }
    }
}
