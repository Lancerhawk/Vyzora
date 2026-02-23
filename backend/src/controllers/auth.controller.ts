import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
    exchangeCodeForToken,
    fetchGithubProfile,
    fetchGithubEmail,
    upsertUser,
} from '../services/auth.service';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function githubRedirect(_req: Request, res: Response): Promise<void> {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID || '',
        scope: 'user:email',
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export async function githubCallback(req: Request, res: Response): Promise<void> {
    try {
        const code = req.query.code as string;

        if (!code) {
            res.status(400).json({ success: false, message: 'Missing OAuth code' });
            return;
        }

        const accessToken = await exchangeCodeForToken(code);
        const [profile, email] = await Promise.all([
            fetchGithubProfile(accessToken),
            fetchGithubEmail(accessToken),
        ]);

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'No verified primary email found on your GitHub account.',
            });
            return;
        }

        const user = await upsertUser({
            email,
            name: profile.name || profile.login,
            githubId: String(profile.id),
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.cookie('vyzora_token', token, COOKIE_OPTIONS);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.authUser!.id },
            select: { id: true, email: true, name: true, githubId: true, createdAt: true },
        });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, user });
    } catch {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export function logout(_req: Request, res: Response): void {
    res.clearCookie('vyzora_token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.json({ success: true, message: 'Logged out' });
}
