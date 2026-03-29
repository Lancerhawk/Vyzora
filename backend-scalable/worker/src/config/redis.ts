import IORedis from 'ioredis';
import { config } from './env';

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
