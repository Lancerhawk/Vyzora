import { describe, it, expect, vi } from 'vitest';
import { ingestEvents } from '../ingest.service';
import { prisma } from '../../config/database';

vi.mock('../../config/database', () => ({
    prisma: {
        event: {
            createMany: vi.fn(),
        },
    },
}));

describe('Ingest Service', () => {
    it('should return 0 count if events array is empty', async () => {
        const result = await ingestEvents('project-1', []);
        expect(result.count).toBe(0);
        expect(prisma.event.createMany).not.toHaveBeenCalled();
    });

    it('should map events correctly and call createMany', async () => {
        const mockEvents = [
            {
                sessionId: 's1',
                visitorId: 'v1',
                eventType: 'click',
                path: '/home',
                metadata: { key: 'value' },
                ipAddress: '1.1.1.1',
                userAgent: 'Mozilla',
            },
        ];

        vi.mocked(prisma.event.createMany).mockResolvedValue({ count: 1 });

        const result = await ingestEvents('project-1', mockEvents);

        expect(result.count).toBe(1);
        expect(prisma.event.createMany).toHaveBeenCalledWith({
            data: [
                {
                    projectId: 'project-1',
                    sessionId: 's1',
                    visitorId: 'v1',
                    eventType: 'click',
                    path: '/home',
                    metadata: { key: 'value' },
                    ipAddress: '1.1.1.1',
                    userAgent: 'Mozilla',
                },
            ],
        });
    });

    it('should handle nullish metadata/ip/ua correctly', async () => {
        const mockEvents = [
            {
                sessionId: 's2',
                visitorId: 'v2',
                eventType: 'pageview',
                path: '/docs',
            },
        ];

        (prisma.event.createMany as any).mockResolvedValue({ count: 1 }); // eslint-disable-line @typescript-eslint/no-explicit-any

        await ingestEvents('project-2', mockEvents);

        expect(prisma.event.createMany).toHaveBeenCalledWith({
            data: [
                {
                    projectId: 'project-2',
                    sessionId: 's2',
                    visitorId: 'v2',
                    eventType: 'pageview',
                    path: '/docs',
                    metadata: null,
                    ipAddress: null,
                    userAgent: null,
                },
            ],
        });
    });
});
