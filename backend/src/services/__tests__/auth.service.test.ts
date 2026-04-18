import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import {
    exchangeCodeForToken,
    fetchGithubProfile,
    fetchGithubEmail,
    upsertUser
} from '../auth.service';
import { prisma } from '../../config/database';
import { User } from '@prisma/client';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('../../config/database', () => ({
    prisma: {
        user: {
            upsert: vi.fn(),
        },
    },
}));

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should exchange code for access token', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { access_token: 'gh_token_123' },
        });

        const token = await exchangeCodeForToken('temp_code');
        expect(token).toBe('gh_token_123');
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('access_token'),
            expect.objectContaining({ code: 'temp_code' }),
            expect.any(Object)
        );
    });

    it('should fetch github profile', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { id: 123, login: 'testuser', name: 'Test User' },
        });

        const profile = await fetchGithubProfile('token');
        expect(profile.login).toBe('testuser');
        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.stringContaining('/user'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer token',
                }),
            })
        );
    });

    it('should fetch primary verified email', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { email: 'second@test.com', primary: false, verified: true },
                { email: 'primary@test.com', primary: true, verified: true },
            ],
        });

        const email = await fetchGithubEmail('token');
        expect(email).toBe('primary@test.com');
    });

    it('should return null if no primary verified email found', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { email: 'notverified@test.com', primary: true, verified: false },
            ],
        });

        const email = await fetchGithubEmail('token');
        expect(email).toBeNull();
    });

    it('should upsert user in database', async () => {
        const userData = {
            email: 'test@test.com',
            name: 'Test',
            githubId: 'gh123',
        };

        vi.mocked(prisma.user.upsert).mockResolvedValue({ id: 'user-id' } as unknown as User);

        await upsertUser(userData);

        expect(prisma.user.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { githubId: 'gh123' },
            create: userData,
        }));
    });
});
