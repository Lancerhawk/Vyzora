import { Router } from 'express';
import { ingestHandler } from '../controllers/ingest.controller';

const router = Router();

router.post('/', ingestHandler);

export default router;