import IORedis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);

/**
 * Shared IORedis connection for BullMQ Worker.
 * - maxRetriesPerRequest: null  → required by BullMQ blocking commands
 * - enableReadyCheck: false     → safer in Docker bridge networks
 */
export const redis = new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redis.on('connect', () => {
    console.log(`🔌 [Redis]  Connected to ${REDIS_HOST}:${REDIS_PORT}`);
});

redis.on('error', (err) => {
    console.error(`🚨 [Redis]  Connection Error | ${err.message}`);
});
