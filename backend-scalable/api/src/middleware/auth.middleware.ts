import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthenticatedRequest extends Request {
    authUser?: { id: string };
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    secure: process.env.NODE_ENV === 'production',
};

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const token = req.cookies?.vyzora_token;

    if (!token) {
        console.warn(`[Auth] No token found in cookies for ${req.method} ${req.originalUrl}`);
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            config.jwtSecret
        ) as { userId: string };
        req.authUser = { id: payload.userId };
        next();
    } catch (err: unknown) {
        const error = err as Error;
        console.error('[Auth] Token verification failed:', error.message);
        // Clear the stuck invalid token before returning 401
        res.clearCookie('vyzora_token', COOKIE_OPTIONS);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}
