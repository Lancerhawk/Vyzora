import { randomBytes } from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

// ─── Existing functions ────────────────────────────────────────────────────────

export async function createProject(userId: string, name: string) {
    // Hard maximum of 50 total projects per user
    const totalCount = await prisma.project.count({
        where: { userId }
    });

    if (totalCount >= 50) {
        throw new Error('PROJECT_CAP_REACHED');
    }

    const apiKey = randomBytes(32).toString('hex');

    const project = await prisma.project.create({
        data: { name, apiKey, userId },
    });

    return project;
}

export async function getProjectsByUser(userId: string) {
    return prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function validateApiKey(apiKey: string) {
    return prisma.project.findUnique({ where: { apiKey } });
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
