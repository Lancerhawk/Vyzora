import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('[ErrorHandler]', err);
    const msg = config.nodeEnv === 'production' ? 'Internal server error' : err.message;
    res.status(500).json({
        success: false,
        message: msg,
    });
}
