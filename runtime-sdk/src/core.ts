import type { VyzoraConfig } from './types';
import { Queue } from './queue';
import { getVisitorId } from './visitor';
import { getSessionId, resetSession } from './session';
import { collectMetadata } from './metadata';
import { Logger } from './logger';

// @ts-expect-error - __VYZORA_API_URL__ is injected by tsup at build-time
const DEFAULT_ENDPOINT = __VYZORA_API_URL__;
const DEFAULT_BATCH_SIZE = 20;
const DEFAULT_FLUSH_INTERVAL = 10000;

export class Vyzora {
    private static readonly instances = new Set<Vyzora>();
    private static historyPatched = false;

    private readonly apiKey: string;
    private readonly endpoint: string;
    private readonly enabled: boolean;
    private readonly debug: boolean;
    private queue: Queue | null = null;
    private customVisitorId: string | null = null;
    private logger: Logger;
    private lastTrackedPath: string | null = null;
    private initialPageviewFired = false;

    private readonly popstateListener = () => this.pageview();
    private readonly loadListener = () => this.pageview();

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

        if (typeof window !== 'undefined') {
            Vyzora.instances.add(this);
            this.hookPageTracking();
        }

        this.logger.log('SDK initialised.');
    }

    public async track(eventType: string, metadata?: Record<string, unknown>): Promise<void> {
        if (!this.enabled || !this.queue) return;
        try {
            const autoMeta = collectMetadata();
            const merged: Record<string, unknown> = { ...autoMeta, ...metadata };
            const path =
                typeof window !== 'undefined'
                    ? window.location.pathname + window.location.search
                    : '/';

            this.queue.push({
                sessionId: getSessionId(),
                visitorId: this.customVisitorId ?? getVisitorId(),
                eventType,
                path,
                metadata: Object.keys(merged).length > 0 ? merged : undefined,
            });
        } catch {
            // ignore — SDK must never crash host application
        }
    }

    pageview(path?: string): void {
        if (!this.enabled || !this.queue) return;
        try {
            // Use pathname + search to track full path. Hash changes (#) are ignored.
            const fullPath =
                path ??
                (typeof window !== 'undefined'
                    ? window.location.pathname + window.location.search
                    : '/');

            // Prevent double-fire (e.g. load + pushState, duplicate SPA route triggers)
            if (fullPath === this.lastTrackedPath && this.initialPageviewFired) return;

            const autoMeta = collectMetadata();

            // Push FIRST, then update lastTrackedPath — so a failed push doesn't corrupt state
            this.queue.push({
                sessionId: getSessionId(),
                visitorId: this.customVisitorId ?? getVisitorId(),
                eventType: 'pageview',
                path: fullPath,
                metadata: Object.keys(autoMeta).length > 0 ? autoMeta : undefined,
            });

            this.lastTrackedPath = fullPath;
            this.initialPageviewFired = true;
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

        if (typeof window !== 'undefined') {
            Vyzora.instances.delete(this);
            window.removeEventListener('popstate', this.popstateListener);
            window.removeEventListener('load', this.loadListener);
        }
    }

    private hookPageTracking(): void {
        if (typeof window === 'undefined') return;

        // Initial pageview on load
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            requestAnimationFrame(() => this.pageview());
        } else {
            window.addEventListener('load', this.loadListener, { once: true });
        }

        // SPA navigation — wrap pushState and replaceState once only across all instances
        if (!Vyzora.historyPatched) {
            this.patchHistory('pushState');
            this.patchHistory('replaceState');
            Vyzora.historyPatched = true;
        }

        // Back/forward navigation
        window.addEventListener('popstate', this.popstateListener);
    }

    private patchHistory(method: 'pushState' | 'replaceState'): void {
        const original = window.history[method];

        window.history[method] = (data: unknown, unused: string, url?: string | URL | null) => {
            const result = original.apply(window.history, [data, unused, url]);
            // Notify all active instances that the URL has changed
            Vyzora.instances.forEach((instance) => instance.pageview());
            return result;
        };
    }
}