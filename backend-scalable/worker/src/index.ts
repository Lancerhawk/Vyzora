import 'dotenv/config';
import { worker, QUEUE_NAME } from './worker';
import { prisma } from './config/database';

console.log(JSON.stringify({
    level: 'info',
    service: 'worker',
    message: `👷 Vyzora Worker started. Listening on queue: ${QUEUE_NAME}`,
    concurrency: process.env.WORKER_CONCURRENCY || '5',
}));

// ── Graceful shutdown ─────────────────────────────────────────────────────────
// On SIGTERM (Docker stop) or SIGINT (Ctrl+C):
// 1. Stop accepting new jobs (worker.close waits for in-flight jobs to finish)
// 2. Disconnect Prisma pool cleanly

async function shutdown(signal: string): Promise<void> {
    console.log(JSON.stringify({
        level: 'info',
        service: 'worker',
        message: `Received ${signal}. Initiating graceful shutdown...`,
    }));

    try {
        await worker.close();
        console.log(JSON.stringify({ level: 'info', service: 'worker', message: 'BullMQ worker closed.' }));
    } catch (err) {
        const error = err as Error;
        console.error(JSON.stringify({ level: 'error', service: 'worker', message: 'Error closing worker', error: error.message }));
    }

    try {
        await prisma.$disconnect();
        console.log(JSON.stringify({ level: 'info', service: 'worker', message: 'Prisma disconnected.' }));
    } catch (err) {
        const error = err as Error;
        console.error(JSON.stringify({ level: 'error', service: 'worker', message: 'Error disconnecting Prisma', error: error.message }));
    }

    process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
