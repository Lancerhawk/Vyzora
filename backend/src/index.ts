import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import ingestRouter from './routes/ingest.routes';
import authRouter from './routes/auth.routes';
import projectRouter from './routes/project.routes';
import { errorHandler } from './middleware/error.middleware';
import { INGEST_LIMITER } from './middleware/rateLimit.middleware';
import { config } from './config/env';

dotenv.config();

const app = express();
const PORT = config.port;

// Startup validation
if (config.nodeEnv === 'production' && config.jwtSecret === 'change_me_in_production') {
    console.error('❌ FATAL: JWT_SECRET must be set in production!');
    process.exit(1);
}

// Trust proxy — required for correct IP resolution behind Vercel/Fly/Render
app.set('trust proxy', 1);

// Custom request logger
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// CORS configuration
const dashboardCors = cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    optionsSuccessStatus: 200,
});

const ingestCors = cors({
    origin: true,
    credentials: true,
    methods: ['POST'],
    optionsSuccessStatus: 200,
});

// cookie-parser must come before routes so req.cookies is populated
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', dashboardCors, authRouter);
app.use('/api/projects', dashboardCors, projectRouter);
app.use('/api/ingest', ingestCors, INGEST_LIMITER, ingestRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.warn(`🚀 Vyzora backend running on http://localhost:${PORT}`);
});

export default app;
