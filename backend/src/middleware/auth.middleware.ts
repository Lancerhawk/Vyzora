import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    authUser?: { id: string };
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
};

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void {
    const token = req.cookies?.vyzora_token;

    if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        ) as { userId: string };
        req.authUser = { id: payload.userId };
        next();
    } catch {
        // Clear the stuck invalid token before returning 401
        res.clearCookie('vyzora_token', COOKIE_OPTIONS);
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}
