import axios, { AxiosError } from 'axios';
import 'dotenv/config';

const BASE_URL = 'http://localhost:3001';

async function testHealth() {
    console.log('\n🔍 Testing Health Check...');
    try {
        const res = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check pass:', res.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            console.error('❌ Health check fail:', e.response?.data || e.message);
        } else {
            console.error('❌ Health check fail:', e);
        }
    }
}

async function testIngestInvalid() {
    console.log('\n🔍 Testing Ingest (Invalid API Key)...');
    try {
        await axios.post(`${BASE_URL}/api/ingest`, {
            apiKey: 'invalid_key_that_is_long_enough_to_pass_zod_validation_64_chars_1234',
            events: [{
                sessionId: 's1',
                visitorId: 'v1',
                eventType: 'pageview',
                path: '/'
            }]
        });
        console.log('❌ Should have failed with 401');
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            console.log('✅ Correctly failed:', e.response?.status, e.response?.data);
        } else {
            console.error('❌ Unexpected error:', e);
        }
    }
}

async function testIngestMissingData() {
    console.log('\n🔍 Testing Ingest (Missing Body)...');
    try {
        await axios.post(`${BASE_URL}/api/ingest`, {});
        console.log('❌ Should have failed with 400');
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            console.log('✅ Correctly failed:', e.response?.status, e.response?.data);
        } else {
            console.error('❌ Unexpected error:', e);
        }
    }
}

async function testIngestSuccess(apiKey: string) {
    if (!apiKey) {
        console.log('\n⚠️ Skipping Success test: No API Key provided');
        return;
    }
    console.log('\n🔍 Testing Ingest (Success)...');
    try {
        const res = await axios.post(`${BASE_URL}/api/ingest`, {
            apiKey: apiKey,
            events: [{
                sessionId: 's1',
                visitorId: 'v1',
                eventType: 'pageview',
                path: '/',
                metadata: { browser: 'Chrome', version: '1.0' }
            }, {
                sessionId: 's1',
                visitorId: 'v1',
                eventType: 'click',
                path: '/',
                metadata: { target: 'button#login' }
            }]
        });
        console.log('✅ Ingest Success:', res.data);
    } catch (e: unknown) {
        if (e instanceof AxiosError) {
            console.error('❌ Ingest Success fail:', e.response?.data || e.message);
        } else {
            console.error('❌ Ingest Success fail:', e);
        }
    }
}

async function run() {
    const apiKey = process.argv[2];
    await testHealth();
    await testIngestInvalid();
    await testIngestMissingData();
    await testIngestSuccess(apiKey);
}

run();
