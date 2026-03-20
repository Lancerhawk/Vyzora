import axios from 'axios';

const API_KEY = '3f491afe1803cc5d485e6712cf8f3fa70df037ed46b8cd23e121265d88bc2aaa';
const SCALABLE_URL = 'http://localhost:8080'; // Default scalable gateway port

async function runTest(url: string, name: string) {
    console.log(`\n🚀 Testing ${name} at ${url}...`);

    try {
        // Test B6: Browser Chart Discrepancy (Missing Metadata)
        console.log('🔍 Sending event WITHOUT browser metadata (Testing B6)...');
        const resB6 = await axios.post(`${url}/api/ingest`, {
            apiKey: API_KEY,
            events: [{
                sessionId: `sess-${Date.now()}`,
                visitorId: `vis-${Date.now()}`,
                eventType: 'test-event-no-browser',
                path: '/verify-fixes',
                metadata: { custom: 'data' } // Missing 'browser'
            }]
        });
        console.log('✅ Ingest Success (B6):', resB6.data);

        // Test B7: API Key Caching (Multiple Requests)
        console.log('\n🔍 Sending multiple events to verify throughput (Testing B7)...');
        for (let i = 1; i <= 3; i++) {
            const resB7 = await axios.post(`${url}/api/ingest`, {
                apiKey: API_KEY,
                events: [{
                    sessionId: `sess-bulk-${i}`,
                    visitorId: `vis-bulk-${i}`,
                    eventType: 'throughput-test',
                    path: '/verify-fixes',
                    metadata: { browser: 'TestRunner' }
                }]
            });
            console.log(`✅ Request ${i} Success:`, resB7.data);
        }

        console.log(`\n✨ Verification for ${name} complete! Check your dashboard for "Other/None" in the Browser Chart.`);
    } catch (error: any) {
        console.error(`\n❌ Verification for ${name} failed:`, error.response?.data || error.message);
        console.log('💡 Tip: Make sure the backend server is running before executing this script.');
    }
}

async function start() {    
    // Test Scalable Gateway (Nginx) by default
    await runTest(SCALABLE_URL, 'Scalable Gateway');
}

start();
