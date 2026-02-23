import type { VyzoraConfig } from './types';
import { Queue } from './queue';
import { getVisitorId } from './visitor';
import { getSessionId, resetSession } from './session';
import { collectMetadata } from './metadata';
import { Logger } from './logger';

const DEFAULT_ENDPOINT = 'https://api.vyzora.io/api/ingest';
const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_FLUSH_INTERVAL = 5000;

export class Vyzora {
    private readonly apiKey: string;
    private readonly endpoint: string;
    private readonly enabled: boolean;
    private readonly debug: boolean;
    private queue: Queue | null = null;
    private customVisitorId: string | null = null;
    private logger: Logger;
    private lastTrackedPath: string | null = null;

    constructor(config: VyzoraConfig) {
        if (!config.apiKey) {
            throw new Error('[Vyzora] apiKey is required.');
        }

        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint ?? DEFAULT_ENDPOINT;
        this.enabled = config.enabled === true;
        this.debug = config.debug ?? false;
        this.logger = new Logger(this.debug);

        if (!this.enabled) {
            this.logger.log('SDK is disabled. Set enabled: true to activate.');
            return;
        }

        if (typeof window === 'undefined') return;

        this.queue = new Queue({
            endpoint: this.endpoint,
            apiKey: this.apiKey,
            batchSize: config.batchSize ?? DEFAULT_BATCH_SIZE,
            flushInterval: config.flushInterval ?? DEFAULT_FLUSH_INTERVAL,
            debug: this.debug,
            logger: this.logger,
        });
        this.queue.start();

        this.hookPageTracking();

        this.logger.log('SDK initialised.');
    }

    track(eventType: string, metadata?: Record<string, unknown>): void {
        if (!this.enabled || !this.queue) return;
        try {
            const autoMeta = collectMetadata();
            const merged: Record<string, unknown> = { ...autoMeta, ...metadata };

            this.queue.push({
                sessionId: getSessionId(),
                visitorId: this.customVisitorId ?? getVisitorId(),
                eventType,
                path: typeof window !== 'undefined' ? window.location.pathname : '/',
                metadata: Object.keys(merged).length > 0 ? merged : undefined,
            });
        } catch {
            // ignore
        }
    }

    pageview(path?: string): void {
        if (!this.enabled || !this.queue) return;
        try {
            const resolvedPath =
                path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

            // Avoid double tracking the same path in immediate succession (e.g. load + pushState)
            if (resolvedPath === this.lastTrackedPath) return;
            this.lastTrackedPath = resolvedPath;

            const autoMeta = collectMetadata();

            this.queue.push({
                sessionId: getSessionId(),
                visitorId: this.customVisitorId ?? getVisitorId(),
                eventType: 'pageview',
                path: resolvedPath,
                metadata: Object.keys(autoMeta).length > 0 ? autoMeta : undefined,
            });
        } catch {
            // ignore
        }
    }

    identify(visitorId: string): void {
        if (!this.enabled) return;
        this.customVisitorId = visitorId;
        this.logger.log('Visitor identified:', visitorId);
    }

    async flush(): Promise<void> {
        if (!this.enabled || !this.queue) return;
        await this.queue.flush();
    }

    resetSession(): void {
        resetSession();
    }

    destroy(): void {
        this.queue?.destroy();
        this.queue = null;
    }


    private hookPageTracking(): void {
        if (typeof window === 'undefined') return;

        // Initial pageview on load
        window.addEventListener('load', () => this.pageview(), { once: true });

        // SPA navigation — intercept history.pushState and history.replaceState
        this.wrapHistoryMethod('pushState');
        this.wrapHistoryMethod('replaceState');

        // Back/forward navigation
        window.addEventListener('popstate', () => this.pageview());
    }

    private wrapHistoryMethod(method: 'pushState' | 'replaceState'): void {
        const original = history[method]?.bind(history);
        if (typeof original !== 'function') return;

        history[method] = (...args) => {
            original(...args);
            this.pageview();
        };
    }
}
