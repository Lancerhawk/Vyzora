import IORedis from 'ioredis';
import { config } from './env';

export const redis = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redis.on('connect', () => {
    console.log(`🔌 [Redis]  Connected to ${config.redis.host}:${config.redis.port}`);
});

redis.on('error', (err) => {
    console.error(`🚨 [Redis]  Connection Error | ${err.message}`);
});
