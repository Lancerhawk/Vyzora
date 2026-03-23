import { randomBytes, createHash } from 'crypto';
import { Prisma, Project } from '@prisma/client';
import { prisma } from '../config/database';
import { LRUCache } from 'lru-cache';

// Cache valid API keys to avoid DB roundtrips on every ingest request (Bug B7)
const apiKeyCache = new LRUCache<string, Project>({
    max: 1000,
    ttl: 1000 * 60 * 5, // 5 minutes
});

// S4: Hash API keys with SHA-256 before storing in the DB.
// SHA-256 is deterministic, so we can still do a direct WHERE lookup.
function hashApiKey(apiKey: string): string {
    return createHash('sha256').update(apiKey).digest('hex');
}

// ─── Existing functions ────────────────────────────────────────────────────────

export async function createProject(userId: string, name: string) {
    // Hard maximum of 50 total projects per user
    const totalCount = await prisma.project.count({
        where: { userId }
    });

    if (totalCount >= 50) {
        throw new Error('PROJECT_CAP_REACHED');
    }

    const rawKey = randomBytes(32).toString('hex');
    const apiKey = hashApiKey(rawKey); // S4: store hash, not plain text

    const project = await prisma.project.create({
        data: { name, apiKey, userId },
    });

    // Return the raw key to the caller so they can display it once
    return { ...project, apiKey: rawKey };
}

export async function getProjectsByUser(userId: string) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function validateApiKey(apiKey: string) {
    // S4: Hash the incoming key before lookup — DB stores hashes only
    const hashedKey = hashApiKey(apiKey);
    const cached = apiKeyCache.get(hashedKey);
    if (cached) return cached;

    const project = await prisma.project.findUnique({ where: { apiKey: hashedKey } });

    if (project) {
        apiKeyCache.set(hashedKey, project);
    }

    return project;
}

// ─── New functions ─────────────────────────────────────────────────────────────

export async function getProjectById(id: string, userId: string) {
    return prisma.project.findFirst({ where: { id, userId } });
}

export async function deleteProject(id: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findFirst({ where: { id, userId } });

    if (!project) return false;

    await prisma.project.delete({ where: { id } });
    return true;
}

type MetricsRange = '7d' | '30d' | '90d';

const RANGE_DAYS: Record<MetricsRange, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
};

export async function getMetrics(
    projectId: string,
    userId: string,
    range: MetricsRange
) {
    // Ownership check FIRST — before any aggregation
    const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
    if (!project) return null;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - RANGE_DAYS[range]);

    interface RawMetricsResult {
        totalEvents: number;
        uniqueVisitors: number;
        totalSessions: number;
        pageviews: number;
    }

    // Efficient database-level aggregation using raw SQL for COUNT(DISTINCT) support.
    // Parameters are safely bound by Prisma.sql to prevent injection.
    const result = await prisma.$queryRaw<RawMetricsResult[]>(Prisma.sql`
        SELECT 
            COUNT(*)::int as "totalEvents",
            COUNT(DISTINCT "visitorId")::int as "uniqueVisitors",
            COUNT(DISTINCT "sessionId")::int as "totalSessions",
            SUM(CASE WHEN "eventType" = 'pageview' THEN 1 ELSE 0 END)::int as "pageviews"
        FROM "Event"
        WHERE "projectId" = ${projectId} AND "createdAt" >= ${startDate}
    `);

    const metrics = result[0];

    return {
        totalEvents: metrics.totalEvents || 0,
        uniqueVisitors: metrics.uniqueVisitors || 0,
        totalSessions: metrics.totalSessions || 0,
        pageviews: metrics.pageviews || 0,
    };
}

// ─── Advanced Analytics ────────────────────────────────────────────────────────

interface TimeSeriesRow { date: Date; events: number; visitors: number; sessions: number; }
interface TopPageRow { path: string; views: number; }
interface TopEventRow { eventType: string; count: number; }
interface SessionRow { sessionId: string; startTime: Date; endTime: Date; eventCount: number; }
interface BrowserRow { browser: string; count: number; }

async function ownerCheck(projectId: string, userId: string): Promise<boolean> {
    const p = await prisma.project.findFirst({ where: { id: projectId, userId } });
    return p !== null;
}

export async function getTimeSeries(projectId: string, userId: string, range: MetricsRange) {
    if (!await ownerCheck(projectId, userId)) return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return prisma.$queryRaw<TimeSeriesRow[]>(Prisma.sql`
        SELECT
            DATE_TRUNC('day', "createdAt") AS date,
            COUNT(*)::int AS events,
            COUNT(DISTINCT "visitorId")::int AS visitors,
            COUNT(DISTINCT "sessionId")::int AS sessions
        FROM "Event"
        WHERE "projectId" = ${projectId} AND "createdAt" >= ${start}
        GROUP BY date
        ORDER BY date ASC
    `);
}

export async function getTopPages(projectId: string, userId: string, range: MetricsRange) {
    if (!await ownerCheck(projectId, userId)) return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return prisma.$queryRaw<TopPageRow[]>(Prisma.sql`
        SELECT
            "path",
            COUNT(*)::int AS views
        FROM "Event"
        WHERE "projectId" = ${projectId}
          AND "eventType" = 'pageview'
          AND "createdAt" >= ${start}
        GROUP BY "path"
        ORDER BY views DESC
        LIMIT 10
    `);
}

export async function getTopEvents(projectId: string, userId: string, range: MetricsRange) {
    if (!await ownerCheck(projectId, userId)) return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return prisma.$queryRaw<TopEventRow[]>(Prisma.sql`
        SELECT
            "eventType",
            COUNT(*)::int AS count
        FROM "Event"
        WHERE "projectId" = ${projectId} AND "createdAt" >= ${start}
        GROUP BY "eventType"
        ORDER BY count DESC
        LIMIT 10
    `);
}

export async function getSessions(projectId: string, userId: string, range: MetricsRange) {
    if (!await ownerCheck(projectId, userId)) return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return prisma.$queryRaw<SessionRow[]>(Prisma.sql`
        SELECT
            "sessionId",
            MIN("createdAt") AS "startTime",
            MAX("createdAt") AS "endTime",
            COUNT(*)::int AS "eventCount"
        FROM "Event"
        WHERE "projectId" = ${projectId} AND "createdAt" >= ${start}
        GROUP BY "sessionId"
        ORDER BY "startTime" DESC
        LIMIT 50
    `);
}

export async function getBrowsers(projectId: string, userId: string, range: MetricsRange) {
    if (!await ownerCheck(projectId, userId)) return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_DAYS[range]);
    return prisma.$queryRaw<BrowserRow[]>(Prisma.sql`
        SELECT
            COALESCE(metadata->>'browser', 'Other/None') AS browser,
            COUNT(*)::int AS count
        FROM "Event"
        WHERE "projectId" = ${projectId}
          AND "createdAt" >= ${start}
        GROUP BY browser
        ORDER BY count DESC
    `);
}

