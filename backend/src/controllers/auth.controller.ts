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
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function githubRedirect(_req: Request, res: Response): Promise<void> {
    console.log('[Auth] Initiating GitHub redirect...');
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID || '',
        scope: 'user:email',
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    });
    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
    console.log('[Auth] Redirecting to:', url);
    res.redirect(url);
}

export async function githubCallback(req: Request, res: Response): Promise<void> {
    console.log('[Auth] GitHub callback received');
    try {
        const code = req.query.code as string;

        if (!code) {
            console.error('[Auth] OAuth error: Missing code in query');
            res.status(400).json({ success: false, message: 'Missing OAuth code' });
            return;
        }

        console.log('[Auth] Exchanging code for token...');
        const accessToken = await exchangeCodeForToken(code);
        console.log('[Auth] Access token received. Fetching profile and email...');

        const [profile, email] = await Promise.all([
            fetchGithubProfile(accessToken),
            fetchGithubEmail(accessToken),
        ]);

        console.log('[Auth] Profile fetched:', { login: profile.login, email });

        if (!email) {
            console.error('[Auth] Error: No verified email found');
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

        console.log('[Auth] User upserted:', user.id);

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        console.log('[Auth] Token signed. Setting cookie...');
        res.cookie('vyzora_token', token, COOKIE_OPTIONS);

        const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
        console.log('[Auth] Success. Redirecting to frontend:', redirectUrl);
        res.redirect(redirectUrl);
    } catch (err: unknown) {
        const error = err as Error & { response?: { data: unknown } };
        console.error('[Auth] OAuth exception:', error.message);
        if (error.response) {
            console.error('[Auth] GitHub API Error Response:', error.response.data);
        }
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
        sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.json({ success: true, message: 'Logged out' });
}
