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

if (config.nodeEnv === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change_me_in_production') {
        throw new Error('FATAL: JWT_SECRET must be set to a secure value in production environments.');
    }
}

app.set('trust proxy', 1);

app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const method = req.method.padEnd(7);
        const url = req.originalUrl;

        const symbol = status >= 400 ? '❌' : status >= 300 ? '➡️' : '✅';

        console.log(`${symbol} [${method}] ${status} | ${url} (${duration}ms)`);
    });
    next();
});

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


app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));


app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'scalable-api', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
    res.json({
        message: 'Vyzora Scalable API v1.0',
        docs: 'https://docs.vyzora.com',
        status: 'online'
    });
});

app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});

app.use('/api/auth', dashboardCors, authRouter);
app.use('/api/projects', dashboardCors, projectRouter);
app.use('/api/ingest', ingestCors, INGEST_LIMITER, ingestRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Vyzora Scalable API running on http://localhost:${PORT}`);
});

export default app;
