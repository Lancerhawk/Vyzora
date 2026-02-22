/**
 * Vyzora Seed Script — fires 200-500 realistic events to your ingest endpoint.
 *
 * Usage:
 *   node scripts/seed-events.js <API_KEY> [BASE_URL]
 *
 * Examples:
 *   node scripts/seed-events.js abc123...yourkey64charkey
 *   node scripts/seed-events.js abc123...yourkey64charkey http://localhost:3001
 */

const API_KEY = process.argv[2];
const BASE_URL = process.argv[3] || 'http://localhost:3001';

if (!API_KEY || API_KEY.length !== 64) {
    console.error('❌  Usage: node scripts/seed-events.js <64-char-api-key> [base-url]');
    process.exit(1);
}

// ── Realistic data pools ──────────────────────────────────────────────────────
const PAGES = [
    '/', '/pricing', '/docs', '/docs#quickstart', '/docs#api-reference',
    '/dashboard', '/login', '/blog', '/about', '/changelog',
];
const EVENT_TYPES = [
    'pageview', 'pageview', 'pageview', 'pageview',  // weight pageview higher
    'click', 'click',
    'form_submit', 'signup', 'login',
    'button_click', 'tab_switch', 'modal_open',
];
const BROWSERS = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Chrome', 'Chrome', 'Safari']; // weight Chrome/Safari
const REFERRERS = ['https://google.com', 'https://twitter.com', 'direct', 'https://github.com', 'https://news.ycombinator.com'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Spread events over the past 30 days
function randomDate() {
    const now = Date.now();
    const ago30 = now - 30 * 24 * 60 * 60 * 1000;
    return new Date(ago30 + Math.random() * (now - ago30)).toISOString();
}

// ── Build event pool ──────────────────────────────────────────────────────────
const VISITOR_COUNT = randInt(20, 40);   // unique visitors
const SESSION_PER_V = randInt(1, 3);     // sessions per visitor
const TOTAL_TARGET = randInt(200, 500);

const visitors = Array.from({ length: VISITOR_COUNT }, () => ({
    visitorId: uuid(),
    browser: rand(BROWSERS),
    referrer: rand(REFERRERS),
    sessions: Array.from({ length: randInt(1, SESSION_PER_V) }, uuid),
}));

const events = [];

while (events.length < TOTAL_TARGET) {
    const visitor = rand(visitors);
    const sessionId = rand(visitor.sessions);
    const eventType = rand(EVENT_TYPES);
    const path = rand(PAGES);

    events.push({
        sessionId,
        visitorId: visitor.visitorId,
        eventType,
        path,
        metadata: {
            browser: visitor.browser,
            referrer: visitor.referrer,
            ...(eventType === 'click' ? { element: rand(['cta-button', 'nav-link', 'hero-btn', 'pricing-card']) } : {}),
        },
    });
}

console.log(`\n🚀  Vyzora Seed Script`);
console.log(`   Target URL    : ${BASE_URL}/api/ingest`);
console.log(`   Total events  : ${events.length}`);
console.log(`   Unique visitors: ${VISITOR_COUNT}`);
console.log(`   Batching in 50-event chunks...\n`);

// ── Fire in batches of 50 ─────────────────────────────────────────────────────
async function sendBatch(batch, batchNum) {
    try {
        const res = await fetch(`${BASE_URL}/api/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: API_KEY, events: batch }),
        });
        const json = await res.json();
        if (json.success) {
            console.log(`   ✅  Batch ${batchNum}: inserted ${json.data.inserted} events`);
        } else {
            console.error(`   ❌  Batch ${batchNum} failed:`, JSON.stringify(json));
        }
    } catch (err) {
        console.error(`   ❌  Batch ${batchNum} error:`, err.message);
    }
}

(async () => {
    const BATCH_SIZE = 50;
    const batches = [];
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
        batches.push(events.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i++) {
        await sendBatch(batches[i], i + 1);
        // Small delay to not hammer the rate limiter
        if (i < batches.length - 1) await new Promise(r => setTimeout(r, 150));
    }

    console.log(`\n🎉  Done! Refresh your dashboard (try 30d range for full spread).\n`);
})();
