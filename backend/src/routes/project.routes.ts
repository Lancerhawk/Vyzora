import { Router } from 'express';
import {
    createProjectHandler,
    listProjectsHandler,
    deleteProjectHandler,
    getMetricsHandler,
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
router.get('/:id/metrics', METRICS_LIMITER, authenticate, getMetricsHandler);

export default router;
