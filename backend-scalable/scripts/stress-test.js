const fs = require('fs');
const path = require('path');

// ── Environment Loading (Simple loader to avoid dependency on dotenv) ─────────
let API_KEY = process.env.API_KEY;

if (!API_KEY) {
    try {
        const envPath = path.resolve(process.cwd(), 'frontend', '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/NEXT_PUBLIC_VYZORA_KEY=(.*)/);
            if (match && match[1]) {
                API_KEY = match[1].trim();
            }
        }
    } catch (err) {
        // Fallback or ignore
    }
}

// Final fallback for the current user's key
if (!API_KEY) {
    API_KEY = 'a80f012255cecfff38cb3b7fb5e5727200428585001583c0a47612c2be66db86';
}

const TOTAL_REQUESTS = parseInt(process.argv[2] || '500', 10);
const CONCURRENCY = parseInt(process.argv[3] || '20', 10);
const ENDPOINT = 'http://localhost:8080/api/ingest';

console.log(`\n--- Vyzora Stress Test Configuration ---`);
console.log(`Endpoint:    ${ENDPOINT}`);
console.log(`API Key:     ${API_KEY.slice(0, 8)}... (from env)`);
console.log(`Requests:    ${TOTAL_REQUESTS}`);
console.log(`Concurrency: ${CONCURRENCY}`);
console.log(`----------------------------------------\n`);

async function sendRequest(id) {
    const start = Date.now();
    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: API_KEY,
                events: [
                    {
                        sessionId: `stress-session-${id}`,
                        visitorId: `stress-visitor-${id}`,
                        eventType: 'stress-test-event',
                        path: '/stress-test',
                        metadata: { ts: new Date().toISOString() }
                    }
                ]
            })
        });

        const duration = Date.now() - start;
        if (res.ok) {
            process.stdout.write('.'); // Progress dot
            return true;
        } else {
            console.error(`\n❌ [Req ${id}] Status: ${res.status}`);
            return false;
        }
    } catch (err) {
        console.error(`\n🚨 [Req ${id}] Error: ${err.message}`);
        return false;
    }
}

async function run() {
    console.log(`🚀 Loading...`);
    const startTime = Date.now();
    let successCount = 0;

    // Simple pool execution
    const queue = Array.from({ length: TOTAL_REQUESTS }, (_, i) => i + 1);
    const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length > 0) {
            const id = queue.shift();
            const success = await sendRequest(id);
            if (success) successCount++;
        }
    });

    await Promise.all(workers);

    const totalTime = (Date.now() - startTime) / 1000;
    console.log('\n\n--- Stress Test Results ---');
    console.log(`Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`Successful:     ${successCount}`);
    console.log(`Failed:         ${TOTAL_REQUESTS - successCount}`);
    console.log(`Total Time:     ${totalTime.toFixed(2)}s`);
    console.log(`Avg Throughput: ${(successCount / totalTime).toFixed(2)} req/s`);
    console.log('---------------------------\n');
}

run();
