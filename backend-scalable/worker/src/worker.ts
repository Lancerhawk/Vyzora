import { Worker, Job } from 'bullmq';
import { Prisma } from '@prisma/client';
import { redis } from './config/redis';
import { prisma } from './config/database';
import type { IngestJobData } from './types';

export const QUEUE_NAME = 'events-queue';

// Concurrency — default 5, explicit numeric parse prevents silent string coercion
const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

/**
 * BullMQ Worker — consumes ingest-batch jobs from the events-queue.
 *
 * Each job carries { projectId, events[] } and performs a bulk Prisma insert.
 * Retry policy (3 attempts, exponential backoff) is inherited from job options
 * set by the API producer.
 *
 * This process exposes NO HTTP server.
 */
export const worker = new Worker<IngestJobData>(
    QUEUE_NAME,
    async (job: Job<IngestJobData>) => {
        const { projectId, events } = job.data;

        if (!events || events.length === 0) {
            console.warn(`⚠️  [Worker] Job #${job.id} | Project: ${projectId} | Empty events — skipped`);
            return;
        }

        const data = events.map((e) => ({
            projectId,
            sessionId: e.sessionId,
            visitorId: e.visitorId,
            eventType: e.eventType,
            path: e.path,
            // Prisma 7 nullable JSON: use Prisma.JsonNull sentinel for null,
            // cast defined objects as InputJsonValue
            metadata: e.metadata !== undefined
                ? (e.metadata as Prisma.InputJsonValue)
                : Prisma.JsonNull,
            ipAddress: e.ipAddress ?? null,
            userAgent: e.userAgent ?? null,
            // No createdAt — Prisma schema @default(now()) handles it correctly
        }));

        const result = await prisma.event.createMany({
            data,
            skipDuplicates: true,
        });

        console.log(`✅ [Worker] Job #${job.id} | Project: ${projectId.split('-')[0]}.. | Inserted: ${result.count}/${events.length}`);
    },
    {
        connection: redis as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        concurrency: CONCURRENCY,
    }
);

// ── Event listeners ───────────────────────────────────────────────────────────

worker.on('failed', (job, err) => {
    console.error(`❌ [Worker] Job #${job?.id} FAILED | Attempt: ${job?.attemptsMade} | Error: ${err.message}`);
});

worker.on('error', (err) => {
    console.error(`🚨 [Worker] CRITICAL ERROR | ${err.message}`);
});
