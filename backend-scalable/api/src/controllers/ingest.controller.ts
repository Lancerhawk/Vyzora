import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateApiKey } from '../services/project.service';
import { ingestQueue } from '../config/queue';

// ── Threshold for queue depth warning log ────────────────────────────────────
const QUEUE_DEPTH_WARN_THRESHOLD = 1000;

// ── Zod schemas (identical to /backend) ─────────────────────────────────────
const eventSchema = z.object({
    sessionId: z.string().min(1).max(128),
    visitorId: z.string().min(1).max(128),
    eventType: z.string().min(1).max(64),
    path: z.string().min(1).max(512),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

const ingestBodySchema = z.object({
    apiKey: z.string().length(64),
    events: z.array(eventSchema).min(1).max(500),
});

export async function ingestHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const parsed = ingestBodySchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { apiKey, events } = parsed.data;

        const project = await validateApiKey(apiKey);

        if (!project) {
            res.status(401).json({
                success: false,
                message: 'Invalid API key',
            });
            return;
        }

        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
            ?? req.socket.remoteAddress
            ?? undefined;

        const userAgent = req.headers['user-agent'] ?? undefined;

        const eventsWithMeta = events.map((event) => ({
            ...event,
            ipAddress,
            userAgent,
        }));

        await ingestQueue.add('ingest-batch', {
            projectId: project.id,
            events: eventsWithMeta,
        });

        try {
            const waitingCount = await ingestQueue.getWaitingCount();
            if (waitingCount > QUEUE_DEPTH_WARN_THRESHOLD) {
                console.warn(JSON.stringify({
                    level: 'warn',
                    service: 'api',
                    component: 'ingest',
                    message: 'Queue depth exceeded threshold',
                    waitingCount,
                    threshold: QUEUE_DEPTH_WARN_THRESHOLD,
                }));
            }
        } catch {
            // Non-critical — never let depth check crash the ingest response
        }

        res.status(200).json({
            success: true,
            data: { inserted: events.length },
        });
    } catch (err) {
        next(err);
    }
}
