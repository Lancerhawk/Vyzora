import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processIngestJob } from '../worker';
import { prisma } from '../config/database';
import { Job } from 'bullmq';

vi.mock('bullmq', () => ({
    Worker: vi.fn().mockImplementation(() => ({
        on: vi.fn(),
    })),
    Job: vi.fn(),
}));

vi.mock('../config/redis', () => ({
    redis: {},
}));

vi.mock('../config/database', () => ({
    prisma: {
        event: {
            createMany: vi.fn(),
        },
    },
}));

describe('Scalable Worker Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should skip processing if events array is empty', async () => {
        const mockJob = {
            id: '1',
            data: { projectId: 'p1', events: [] }
        } as unknown as Job;

        await processIngestJob(mockJob);

        expect(prisma.event.createMany).not.toHaveBeenCalled();
    });

    it('should map events and call createMany with skipDuplicates', async () => {
        const mockJob = {
            id: '2',
            data: {
                projectId: 'p1',
                events: [
                    {
                        sessionId: 's1',
                        visitorId: 'v1',
                        eventType: 'pageview',
                        path: '/',
                        metadata: { b: 'chrome' }
                    }
                ]
            }
        } as unknown as Job;

        vi.mocked(prisma.event.createMany).mockResolvedValue({ count: 1 });

        await processIngestJob(mockJob);

        expect(prisma.event.createMany).toHaveBeenCalledWith({
            data: [
                {
                    projectId: 'p1',
                    sessionId: 's1',
                    visitorId: 'v1',
                    eventType: 'pageview',
                    path: '/',
                    metadata: { b: 'chrome' },
                    ipAddress: null,
                    userAgent: null
                }
            ],
            skipDuplicates: true
        });
    });
});
