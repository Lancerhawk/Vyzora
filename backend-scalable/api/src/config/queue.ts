import { Queue } from 'bullmq';
import { redis } from './redis';

// Inlined here to avoid cross-directory resolution issues in the config/ folder
export interface IngestEvent {
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

export interface IngestJobData {
    projectId: string;
    events: IngestEvent[];
}

export const QUEUE_NAME = 'events-queue';

/**
 * BullMQ Queue singleton.
 * The API service only produces jobs — it never consumes them.
 */
export const ingestQueue = new Queue<IngestJobData>(QUEUE_NAME, {
    connection: redis as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
    },
});

ingestQueue.on('error', (err) => {
    console.error(JSON.stringify({
        level: 'error',
        service: 'api',
        component: 'ingest-queue',
        error: err.message,
    }));
});
