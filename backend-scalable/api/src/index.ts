import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import ingestRouter from './routes/ingest.routes';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import { errorHandler } from './middleware/error.middleware';
import { INGEST_LIMITER } from './middleware/rateLimit.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Trust proxy — required for correct IP resolution behind Nginx/Vercel/Fly/Render
app.set('trust proxy', 1);

// Professional request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method.padEnd(7);
        const url = req.originalUrl;

        // Use simple symbols for a "pro" feel in Docker logs
        const symbol = status >= 400 ? '❌' : status >= 300 ? '➡️' : '✅';

        console.log(`${symbol} [${method}] ${status} | ${url} (${duration}ms)`);
    });
    next();
});

// ── CORS ─────────────────────────────────────────────────────────────────────
// Dashboard routes: strict origin — only the configured frontend URL is allowed
const dashboardCors = cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    optionsSuccessStatus: 200,
});

// Ingest route: reflected-origin — any website using the SDK can send events
const ingestCors = cors({
    origin: true,
    credentials: true,
    methods: ['POST'],
    optionsSuccessStatus: 200,
});

// ── Core middleware ───────────────────────────────────────────────────────────
// cookie-parser must come before routes so req.cookies is populated
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health endpoint ───────────────────────────────────────────────────────────
// Pure health check — no DB or Redis dependency. Lightweight by design.
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'scalable-api', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', dashboardCors, authRouter);
app.use('/api/projects', dashboardCors, projectRouter);
app.use('/api/ingest', ingestCors, INGEST_LIMITER, ingestRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Vyzora Scalable API running on http://localhost:${PORT}`);
});

export default app;
