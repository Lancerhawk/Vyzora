import type { InternalEvent } from './types';
import { sendBatch } from './transport';
import { Logger } from './logger';

export class Queue {
    private events: InternalEvent[] = [];
    private timer: ReturnType<typeof setInterval> | null = null;
    private flushing = false;
    private endpoint: string;
    private apiKey: string;
    private batchSize: number;
    private flushInterval: number;
    private debug: boolean;
    private logger: Logger;

    constructor(opts: {
        endpoint: string;
        apiKey: string;
        batchSize: number;
        flushInterval: number;
        debug: boolean;
        logger: Logger;
    }) {
        this.endpoint = opts.endpoint;
        this.apiKey = opts.apiKey;
        this.batchSize = opts.batchSize;
        this.flushInterval = opts.flushInterval;
        this.debug = opts.debug;
        this.logger = opts.logger;
    }

    start(): void {
        if (this.timer !== null) return;
        this.timer = setInterval(() => {
            this.logger.log('Auto-flush triggered');
            void this.flush();
        }, this.flushInterval);

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', this.handleVisibility);
        }
        if (typeof window !== 'undefined') {
            window.addEventListener('pagehide', this.handlePageHide);
        }
    }

    push(event: InternalEvent): void {
        this.events.push(event);
        this.logger.log(`Event queued: ${event.eventType} (queue=${this.events.length})`);
        if (this.events.length >= this.batchSize) {
            void this.flush();
        }
    }

    async flush(): Promise<void> {
        if (this.events.length === 0) return;
        if (this.flushing) return;

        this.flushing = true;
        const batch = this.events.splice(0, this.events.length);
        this.logger.log(`Flushing ${batch.length} event(s)`);

        try {
            await sendBatch(this.endpoint, this.apiKey, batch, this.debug, this.logger);
        } finally {
            this.flushing = false;
        }
    }

    destroy(): void {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this.handleVisibility);
        }
        if (typeof window !== 'undefined') {
            window.removeEventListener('pagehide', this.handlePageHide);
        }
        void this.flush();
    }

    private handleVisibility = (): void => {
        if (document.visibilityState === 'hidden') {
            void this.flush();
        }
    };

    private handlePageHide = (): void => {
        void this.flush();
    };
}
