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
    metadata: z.record(z.string(), z.unknown()).optional(),
});

const ingestBodySchema = z.object({
    apiKey: z.string().length(64),
    events: z.array(eventSchema).min(1),
});

export async function ingestHandler(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // 1. Validate request body
        const parsed = ingestBodySchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors,
            });
            return;
        }

        const { apiKey, events } = parsed.data;

        // 2. Validate API key — select only { id } to avoid fetching the full row
        const project = await validateApiKey(apiKey);

        if (!project) {
            res.status(401).json({
                success: false,
                message: 'Invalid API key',
            });
            return;
        }

        // 3. Enrich events with request-level metadata (IP + User-Agent)
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim()
            ?? req.socket.remoteAddress
            ?? undefined;

        const userAgent = req.headers['user-agent'] ?? undefined;

        const eventsWithMeta = events.map((event) => ({
            ...event,
            ipAddress,
            userAgent,
        }));

        // 4. Enqueue job — no direct DB write happens here
        await ingestQueue.add('ingest-batch', {
            projectId: project.id,
            events: eventsWithMeta,
        });

        // 5. Optional: log queue depth to surface backpressure issues
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

        // 6. Return same contract as /backend — field name preserved exactly
        res.status(200).json({
            success: true,
            data: { inserted: events.length },
        });
    } catch (err) {
        next(err);
    }
}
