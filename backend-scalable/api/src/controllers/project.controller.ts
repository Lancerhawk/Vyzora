import { Response } from 'express';
import { z } from 'zod';
import {
    createProject,
    getProjectsByUser,
    deleteProject,
    getMetrics,
    getTimeSeries,
    getTopPages,
    getTopEvents,
    getSessions,
    getBrowsers,
} from '../services/project.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_RANGES = ['7d', '30d', '90d'] as const;
type MetricsRange = typeof VALID_RANGES[number];

const createProjectSchema = z.object({
    name: z.string().min(1).max(100),
});

export async function createProjectHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Project name must be 1–100 characters.' });
        return;
    }

    try {
        const project = await createProject(req.authUser!.id, parsed.data.name);
        res.status(201).json({ success: true, project });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === 'PROJECT_CAP_REACHED') {
            res.status(400).json({ success: false, message: 'Project limit reached.' });
            return;
        }
        res.status(500).json({ success: false, message: 'Failed to create project.' });
    }
}

export async function listProjectsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const projects = await getProjectsByUser(req.authUser!.id);
        res.json({ success: true, projects });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
    }
}

export async function deleteProjectHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = req.params.id as string;

    if (!UUID_REGEX.test(id)) {
        res.status(400).json({ success: false, message: 'Invalid project ID.' });
        return;
    }

    try {
        const deleted = await deleteProject(id, req.authUser!.id);
        if (!deleted) {
            res.status(404).json({ success: false, message: 'Project not found.' });
            return;
        }
        res.json({ success: true, message: 'Project deleted.' });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to delete project.' });
    }
}

export async function getMetricsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = req.params.id as string;
    const range = req.query.range as string;

    if (!UUID_REGEX.test(id)) {
        res.status(400).json({ success: false, message: 'Invalid project ID.' });
        return;
    }

    if (!VALID_RANGES.includes(range as MetricsRange)) {
        res.status(400).json({ success: false, message: 'Invalid range. Must be 7d, 30d, or 90d.' });
        return;
    }

    try {
        const metrics = await getMetrics(id, req.authUser!.id, range as MetricsRange);
        if (!metrics) {
            res.status(404).json({ success: false, message: 'Project not found.' });
            return;
        }
        res.json({ success: true, metrics });
    } catch {
        res.status(500).json({ success: false, message: 'Failed to fetch metrics.' });
    }
}


function validateAnalyticsParams(
    req: AuthenticatedRequest,
    res: Response
): { id: string; range: MetricsRange } | null {
    const id = req.params.id as string;
    const range = req.query.range as string;
    if (!UUID_REGEX.test(id)) {
        res.status(400).json({ success: false, message: 'Invalid project ID.' });
        return null;
    }
    if (!VALID_RANGES.includes(range as MetricsRange)) {
        res.status(400).json({ success: false, message: 'Invalid range. Must be 7d, 30d, or 90d.' });
        return null;
    }
    return { id, range: range as MetricsRange };
}

export async function getTimeSeriesHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const params = validateAnalyticsParams(req, res);
    if (!params) return;
    try {
        const data = await getTimeSeries(params.id, req.authUser!.id, params.range);
        if (data === null) { res.status(404).json({ success: false, message: 'Project not found.' }); return; }
        res.json({ success: true, data });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch time series.' }); }
}

export async function getTopPagesHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const params = validateAnalyticsParams(req, res);
    if (!params) return;
    try {
        const data = await getTopPages(params.id, req.authUser!.id, params.range);
        if (data === null) { res.status(404).json({ success: false, message: 'Project not found.' }); return; }
        res.json({ success: true, data });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch top pages.' }); }
}

export async function getTopEventsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const params = validateAnalyticsParams(req, res);
    if (!params) return;
    try {
        const data = await getTopEvents(params.id, req.authUser!.id, params.range);
        if (data === null) { res.status(404).json({ success: false, message: 'Project not found.' }); return; }
        res.json({ success: true, data });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch top events.' }); }
}

export async function getSessionsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const params = validateAnalyticsParams(req, res);
    if (!params) return;
    try {
        const data = await getSessions(params.id, req.authUser!.id, params.range);
        if (data === null) { res.status(404).json({ success: false, message: 'Project not found.' }); return; }
        res.json({ success: true, data });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch sessions.' }); }
}

export async function getBrowsersHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
    const params = validateAnalyticsParams(req, res);
    if (!params) return;
    try {
        const data = await getBrowsers(params.id, req.authUser!.id, params.range);
        if (data === null) { res.status(404).json({ success: false, message: 'Project not found.' }); return; }
        res.json({ success: true, data });
    } catch { res.status(500).json({ success: false, message: 'Failed to fetch browser data.' }); }
}
