import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { 
    exchangeCodeForToken, 
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

describe('Scalable API Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should exchange code for token', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { access_token: 'tk123' } });
        const token = await exchangeCodeForToken('code1');
        expect(token).toBe('tk123');
    });

    it('should upsert user', async () => {
        vi.mocked(prisma.user.upsert).mockResolvedValue({ id: 'u1' } as unknown as User);
        await upsertUser({ email: 'a@b.com', name: 'N', githubId: 'g1' });
        expect(prisma.user.upsert).toHaveBeenCalledWith(expect.objectContaining({
            where: { githubId: 'g1' }
        }));
    });
});
