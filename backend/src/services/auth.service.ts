import axios from 'axios';
import { prisma } from '../config/database';

interface GithubTokenResponse {
    access_token: string;
}

interface GithubProfile {
    id: number;
    login: string;
    name: string | null;
}

interface GithubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
    const response = await axios.post<GithubTokenResponse>(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.BACKEND_URL}/api/auth/github/callback`,
        },
        {
            headers: { Accept: 'application/json' },
        }
    );
    return response.data.access_token;
}

export async function fetchGithubProfile(token: string): Promise<GithubProfile> {
    const response = await axios.get<GithubProfile>('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
        },
    });
    return response.data;
}

export async function fetchGithubEmail(token: string): Promise<string | null> {
    const response = await axios.get<GithubEmail[]>('https://api.github.com/user/emails', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
        },
    });

    const primary = response.data.find((e) => e.primary && e.verified);
    return primary?.email ?? null;
}

export async function upsertUser(data: {
    email: string;
    name: string | null;
    githubId: string;
}) {
    return prisma.user.upsert({
        where: { githubId: data.githubId },
        update: {
            email: data.email,
            name: data.name ?? undefined,
        },
        create: {
            email: data.email,
            name: data.name,
            githubId: data.githubId,
        },
    });
}
