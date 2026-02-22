import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

interface IngestEvent {
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

interface IngestResult {
    count: number;
}

export async function ingestEvents(
    projectId: string,
    events: IngestEvent[]
): Promise<IngestResult> {
    if (!events.length) {
        return { count: 0 };
    }

    const now = new Date();

    const data: Prisma.EventCreateManyInput[] = events.map((event) => ({
        projectId,
        sessionId: event.sessionId,
        visitorId: event.visitorId,
        eventType: event.eventType,
        path: event.path,
        metadata: (event.metadata as Prisma.InputJsonValue) ?? null,
        ipAddress: event.ipAddress ?? null,
        userAgent: event.userAgent ?? null,
        createdAt: now,
    }));

    const result = await prisma.event.createMany({ data });

    return { count: result.count };
}
