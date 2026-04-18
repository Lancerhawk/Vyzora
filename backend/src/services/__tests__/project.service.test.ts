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

describe('Project Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createProject', () => {
        it('should throw Error if user has 50 projects already', async () => {
            vi.mocked(prisma.project.count).mockResolvedValue(50);

            await expect(createProject('user-1', 'New Project'))
                .rejects.toThrow('PROJECT_CAP_REACHED');

            expect(prisma.project.count).toHaveBeenCalledWith({
                where: { userId: 'user-1' }
            });
        });

        it('should create project and return raw API key', async () => {
            vi.mocked(prisma.project.count).mockResolvedValue(10);
            vi.mocked(prisma.project.create).mockResolvedValue({
                id: 'p1',
                name: 'My Project',
                userId: 'user-1',
                apiKey: 'hashed_key'
            } as Project);

            const result = await createProject('user-1', 'My Project');

            expect(result.id).toBe('p1');
            expect(result.apiKey).toHaveLength(64);
            expect(prisma.project.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    name: 'My Project',
                    apiKey: expect.any(String)
                })
            }));
        });
    });

    describe('validateApiKey', () => {
        it('should return project if key is valid', async () => {
            const rawKey = 'abc123def456';
            vi.mocked(prisma.project.findUnique).mockResolvedValue({ id: 'p1', name: 'P1' } as Project);

            const project = await validateApiKey(rawKey);
            expect(project?.id).toBe('p1');
            expect(prisma.project.findUnique).toHaveBeenCalled();
        });
    });

    describe('getAnalyticsBatch', () => {
        it('should return null if user is not owner', async () => {
            vi.mocked(prisma.project.findFirst).mockResolvedValue(null);

            const result = await getAnalyticsBatch('p1', 'user-wrong', '7d');
            expect(result).toBeNull();
        });

        it('should aggregate all metrics in a batch', async () => {
            vi.mocked(prisma.project.findFirst).mockResolvedValue({ id: 'p1' } as Project);

            vi.mocked(prisma.$queryRaw)
                .mockResolvedValueOnce([{ totalEvents: 100, uniqueVisitors: 50, totalSessions: 30, pageviews: 80 }])
                .mockResolvedValueOnce([{ date: '2026-04-18', events: 10, visitors: 5, sessions: 3 }])
                .mockResolvedValueOnce([{ path: '/home', views: 50 }])
                .mockResolvedValueOnce([{ eventType: 'click', count: 20 }])
                .mockResolvedValueOnce([{ sessionId: 's1', eventCount: 5 }])
                .mockResolvedValueOnce([{ browser: 'Chrome', count: 70 }]);

            const result = await getAnalyticsBatch('p1', 'user-1', '7d');

            expect(result?.metrics.totalEvents).toBe(100);
            expect(result?.timeSeries).toHaveLength(1);
            expect(result?.topPages[0].path).toBe('/home');
            expect(prisma.$queryRaw).toHaveBeenCalledTimes(6);
        });
    });
});
