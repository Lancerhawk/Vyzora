import { initBatch, destroyBatch } from './batch';
import { track, trackPageView } from './tracker';
import { resetSession } from './session';

export interface VyzoraConfig {
    apiKey: string;
    endpoint?: string;
    trackPageViews?: boolean;
}

const DEFAULT_ENDPOINT = 'https://api.vyzora.io/api/ingest';

let initialised = false;

export function init(config: VyzoraConfig): void {
    if (initialised) {
        console.warn('[Vyzora] SDK already initialised.');
        return;
    }

    const endpoint = config.endpoint || DEFAULT_ENDPOINT;
    initBatch(endpoint, config.apiKey);

    if (config.trackPageViews !== false) {
        trackPageView();
    }

    initialised = true;
    console.info('[Vyzora] SDK initialised.');
}

export function destroy(): void {
    destroyBatch();
    resetSession();
    initialised = false;
}

export { track, trackPageView };
