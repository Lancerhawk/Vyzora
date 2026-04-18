import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    createProject,
    validateApiKey,
    getAnalyticsBatch
} from '../project.service';
import { prisma } from '../../config/database';
import { Project } from '@prisma/client';

vi.mock('../../config/database', () => ({
    prisma: {
        project: {
            count: vi.fn(),
            create: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
        },
        $queryRaw: vi.fn(),
    },
}));

describe('Scalable API Project Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should validate API key using hash', async () => {
        vi.mocked(prisma.project.findUnique).mockResolvedValue({ id: 'p1' } as Project);

        const result = await validateApiKey('some-key');

        expect(result?.id).toBe('p1');
        expect(prisma.project.findUnique).toHaveBeenCalledWith(expect.objectContaining({
            where: { apiKey: expect.any(String) }
        }));
    });

    it('should enforce 50-project maximum', async () => {
        vi.mocked(prisma.project.count).mockResolvedValue(55);

        await expect(createProject('u1', 'New')).rejects.toThrow('PROJECT_CAP_REACHED');
    });

    it('should correctly run batch analytics queries', async () => {
        vi.mocked(prisma.project.findFirst).mockResolvedValue({ id: 'p1' } as Project);
        vi.mocked(prisma.$queryRaw).mockResolvedValue([{ totalEvents: 5 }]);

        const res = await getAnalyticsBatch('p1', 'u1', '7d');

        expect(res?.metrics.totalEvents).toBe(5);
        expect(prisma.$queryRaw).toHaveBeenCalledTimes(6);
    });
});
