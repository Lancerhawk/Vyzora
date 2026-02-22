import rateLimit from 'express-rate-limit';

const rateLimitHandler = (_req: unknown, res: { status: (code: number) => { json: (body: unknown) => void } }) => {
    res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
    });
};

export const AUTH_LIMITER = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler as never,
});

export const PROJECT_CREATION_LIMITER = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler as never,
});

export const METRICS_LIMITER = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler as never,
});

export const INGEST_LIMITER = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler as never,
});
