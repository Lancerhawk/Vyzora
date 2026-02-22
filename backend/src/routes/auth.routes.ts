import { Router } from 'express';
import { githubRedirect, githubCallback, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { AUTH_LIMITER } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(AUTH_LIMITER);

router.get('/github', githubRedirect);
router.get('/github/callback', githubCallback);
router.get('/me', authenticate, getMe);
router.post('/logout', logout); // No authenticate — always clears cookie

export default router;
