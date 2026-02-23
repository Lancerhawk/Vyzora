import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

/**
 * Vyzora Analytics Seed Script
 * Inserts realistic events directly via Prisma so timestamps can be spread
 * across the past 30 days (the ingest API always stamps events as "now").
 *
 * Usage (from backend directory):
 *   npm run seed:events
 */

const API_KEY = 'a8c8811ee1d3b44d53f9ebcf80c126a7dba9286f61ac12b4c7821dd8c30e561c';
const DAYS_BACK = 30;

// ── Data pools ────────────────────────────────────────────────────────────────
const PAGES = [
    '/', '/pricing', '/docs', '/docs#quickstart', '/docs#api-reference',
    '/dashboard', '/login', '/blog', '/about', '/changelog',
];
const EVENT_TYPES = [
    'pageview', 'pageview', 'pageview', 'pageview', 'pageview',
    'click', 'click', 'click',
    'form_submit', 'signup', 'login',
    'button_click', 'tab_switch', 'modal_open',
];
const BROWSERS = ['Chrome', 'Chrome', 'Chrome', 'Safari', 'Safari', 'Firefox', 'Edge'];
const REFERRERS = ['https://google.com', 'https://twitter.com', 'direct', 'https://github.com', 'https://news.ycombinator.com'];
const ELEMENTS = ['cta-button', 'nav-link', 'hero-btn', 'pricing-card', 'docs-link'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function makeUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

/** Random timestamp within the past `DAYS_BACK` days, weighted toward recent days */
function randomTimestamp(): Date {
    const now = Date.now();
    const maxAgo = DAYS_BACK * 24 * 60 * 60 * 1000;
    // Quadratic weight so recent days have more traffic (natural growth curve)
    const t = Math.random();
    const msAgo = maxAgo * (1 - t * t);
    return new Date(now - msAgo);
}

// ── Build visitor + session pool ──────────────────────────────────────────────
const VISITOR_COUNT = randInt(25, 50);
const TOTAL_TARGET = randInt(300, 600);

interface Visitor {
    visitorId: string;
    browser: string;
    referrer: string;
    sessions: string[];
}

const visitors: Visitor[] = Array.from({ length: VISITOR_COUNT }, () => ({
    visitorId: makeUUID(),
    browser: rand(BROWSERS),
    referrer: rand(REFERRERS),
    sessions: Array.from<string>({ length: randInt(1, 4) }).map(makeUUID),
}));

// ── Build event rows ──────────────────────────────────────────────────────────
interface EventRow {
    projectId: string;
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    ipAddress: string;
    userAgent: string;
    metadata: Record<string, string>;
    createdAt: Date;
}

function buildEvents(projectId: string): EventRow[] {
    const rows: EventRow[] = [];
    while (rows.length < TOTAL_TARGET) {
        const visitor = rand(visitors);
        const sessionId = rand(visitor.sessions);
        const eventType = rand(EVENT_TYPES);

        rows.push({
            projectId,
            sessionId,
            visitorId: visitor.visitorId,
            eventType,
            path: rand(PAGES),
            ipAddress: `10.0.${randInt(0, 255)}.${randInt(1, 254)}`,
            userAgent: `Mozilla/5.0 (${visitor.browser})`,
            metadata: {
                browser: visitor.browser,
                referrer: visitor.referrer,
                ...(eventType === 'click' || eventType === 'button_click'
                    ? { element: rand(ELEMENTS) } : {}),
            },
            createdAt: randomTimestamp(),
        });
    }
    // Sort by timestamp asc so inserts are chronological
    return rows.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    // Look up project by API key
    const project = await prisma.project.findUnique({ where: { apiKey: API_KEY } });
    if (!project) {
        console.error(`\n❌  No project found for API key: ${API_KEY}\n`);
        await prisma.$disconnect(); await pool.end();
        process.exit(1);
    }

    console.log(`\n🚀  Vyzora Analytics Seed`);
    console.log(`   Project        : ${project.name} (${project.id})`);
    console.log(`   Events target  : ${TOTAL_TARGET}`);
    console.log(`   Unique visitors: ${VISITOR_COUNT}`);
    console.log(`   Spread over    : last ${DAYS_BACK} days\n`);

    const events = buildEvents(project.id);

    // Batch insert via createMany
    const BATCH = 100;
    let inserted = 0;
    for (let i = 0; i < events.length; i += BATCH) {
        const batch = events.slice(i, i + BATCH);
        const result = await prisma.event.createMany({ data: batch });
        inserted += result.count;
        console.log(`   ✅  Batch ${Math.ceil((i + 1) / BATCH)}: +${result.count} events (total: ${inserted})`);
    }

    console.log(`\n🎉  Done! Inserted ${inserted} events spread across ${DAYS_BACK} days.`);
    console.log(`   Refresh the dashboard → switch to 30d range.\n`);

    await prisma.$disconnect();
    await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
