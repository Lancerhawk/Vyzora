import { Router } from 'express';
import {
    createProjectHandler,
    listProjectsHandler,
    deleteProjectHandler,
    getMetricsHandler,
    getTimeSeriesHandler,
    getTopPagesHandler,
    getTopEventsHandler,
    getSessionsHandler,
    getBrowsersHandler,
    getAnalyticsBatchHandler,
} from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import {
    PROJECT_CREATION_LIMITER,
    METRICS_LIMITER,
} from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/', PROJECT_CREATION_LIMITER, authenticate, createProjectHandler);
router.get('/', authenticate, listProjectsHandler);
router.delete('/:id', authenticate, deleteProjectHandler);

// Core metrics
router.get('/:id/metrics', METRICS_LIMITER, authenticate, getMetricsHandler);

// Advanced analytics
router.get('/:id/timeseries', METRICS_LIMITER, authenticate, getTimeSeriesHandler);
router.get('/:id/top-pages', METRICS_LIMITER, authenticate, getTopPagesHandler);
router.get('/:id/top-events', METRICS_LIMITER, authenticate, getTopEventsHandler);
router.get('/:id/sessions', METRICS_LIMITER, authenticate, getSessionsHandler);
router.get('/:id/browsers', METRICS_LIMITER, authenticate, getBrowsersHandler);

// Batched analytics — replaces 6 calls with 1 (P4)
router.get('/:id/analytics', METRICS_LIMITER, authenticate, getAnalyticsBatchHandler);

export default router;
