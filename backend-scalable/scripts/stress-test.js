const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ── Configuration & Env ──────────────────────────────────────────────────────
const API_KEY = process.env.API_KEY || 'b176a1065a4acb216c1f4f0a711a7f2b403655e9b002cb6c2e2cd35bbb659c70';

const TOTAL_REQUESTS = parseInt(process.argv[2] || '1000', 10);
const CONCURRENCY = parseInt(process.argv[3] || '50', 10);
const ENDPOINT = process.env.ENDPOINT || 'http://localhost:8080/api/ingest';

// ── UI Helpers ───────────────────────────────────────────────────────────────
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m"
};

const clearLines = (n) => {
    for (let i = 0; i < n; i++) {
        readline.moveCursor(process.stdout, 0, -1);
        readline.clearLine(process.stdout, 0);
    }
};

// ── Metrics ──────────────────────────────────────────────────────────────────
let successCount = 0;
let failCount = 0;
let latencies = [];
let startTime = 0;

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
                        sessionId: `stress-session-${Math.floor(id / 10)}`,
                        visitorId: `stress-visitor-${id % 100}`,
                        eventType: 'stress_test_ping',
                        path: '/stress-test',
                        metadata: {
                            isStressTest: true, // CRITICAL: Tag for cleanup
                            batchId: id,
                            timestamp: new Date().toISOString()
                        }
                    }
                ]
            })
        });

        const duration = Date.now() - start;
        latencies.push(duration);

        if (res.ok) {
            successCount++;
            return true;
        } else {
            failCount++;
            return false;
        }
    } catch (err) {
        failCount++;
        return false;
    }
}

function updateUI(finished = false) {
    const elapsed = (Date.now() - startTime) / 1000;
    const rps = (successCount / elapsed).toFixed(1);
    const progress = ((successCount + failCount) / TOTAL_REQUESTS * 100).toFixed(1);
    const avgLat = latencies.length ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1) : 0;

    // Calculate P95
    const sorted = [...latencies].sort((a, b) => a - b);
    const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : 0;

    if (!finished) clearLines(8);

    console.log(`${colors.magenta}${colors.bright}VYZORA STRESS ENGINE v2.0${colors.reset}`);
    console.log(`${colors.dim}────────────────────────────────────────────────${colors.reset}`);
    console.log(`${colors.cyan}Progress:    ${colors.bright}${progress}%${colors.reset} (${successCount + failCount}/${TOTAL_REQUESTS})`);
    console.log(`${colors.green}Success:     ${colors.bright}${successCount}${colors.reset}`);
    console.log(`${colors.red}Failures:    ${colors.bright}${failCount}${colors.reset}`);
    console.log(`${colors.yellow}Throughput:  ${colors.bright}${rps} req/s${colors.reset}`);
    console.log(`${colors.magenta}Latency:     ${colors.bright}Avg: ${avgLat}ms | P95: ${p95}ms${colors.reset}`);
    console.log(`${colors.dim}────────────────────────────────────────────────${colors.reset}`);
}

async function run() {
    console.log('\n\n\n\n\n\n\n\n'); // Make space for the dashboard
    startTime = Date.now();

    const uiInterval = setInterval(() => updateUI(), 100);

    const queue = Array.from({ length: TOTAL_REQUESTS }, (_, i) => i + 1);
    const workers = Array.from({ length: CONCURRENCY }, async () => {
        while (queue.length > 0) {
            const id = queue.shift();
            await sendRequest(id);
        }
    });

    await Promise.all(workers);
    clearInterval(uiInterval);
    updateUI(true);

    console.log(`\n${colors.green}${colors.bright}✔ STRESS TEST COMPLETE${colors.reset}`);
    console.log(`${colors.dim}Test data tagged with { isStressTest: true } for easy cleanup.${colors.reset}\n`);
}

run();

