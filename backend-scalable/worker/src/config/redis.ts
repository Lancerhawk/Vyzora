import IORedis from 'ioredis';
import { config } from './env';

/**
 * Shared IORedis connection for BullMQ Worker.
 * - maxRetriesPerRequest: null  → required by BullMQ blocking commands
 * - enableReadyCheck: false     → safer in Docker bridge networks
 */
export const redis = new IORedis({
    host: config.redisHost,
    port: config.redisPort,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redis.on('connect', () => {
    console.log(`🔌 [Redis]  Connected to ${config.redisHost}:${config.redisPort}`);
});

redis.on('error', (err) => {
    console.error(`🚨 [Redis]  Connection Error | ${err.message}`);
});
