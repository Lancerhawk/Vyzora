import DocsSidebar from '../../components/DocsSidebar';

export default function DocsPage() {
    return (
        <div className="min-h-screen pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-6 flex gap-12">
                <DocsSidebar />

                {/* Main content */}
                <article className="flex-1 min-w-0 prose-sm max-w-none">

                    {/* ── Overview ──────────────────────────────────── */}
                    <section id="overview" className="scroll-mt-28 mb-16">
                        <h1 className="text-3xl font-bold text-white mb-4">Documentation</h1>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Vyzora is a developer-first analytics platform. You instrument your frontend
                            with the lightweight <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">@vyzora/sdk</code>,
                            events are securely ingested and stored in PostgreSQL, and your dashboard
                            gives you page views, session timelines, top pages, and daily trends — all queryable
                            over a clean REST API.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            The stack is fully open-source: an Express + Prisma backend, a Next.js dashboard,
                            and a TypeScript SDK distributed as ESM, CJS, and a CDN-ready IIFE. You can
                            self-host everything or point it at Supabase.
                        </p>
                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 flex flex-col gap-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Architecture at a glance</p>
                            <div className="flex flex-col gap-1.5 text-sm text-gray-400">
                                {[
                                    ['SDK', '@vyzora/sdk — collects events, manages sessions, batches and flushes to /api/ingest'],
                                    ['Backend', 'Express + TypeScript + Prisma — validates API keys, writes events, serves aggregated metrics'],
                                    ['Database', 'PostgreSQL — indexed on (projectId, timestamp) for fast range queries'],
                                    ['Dashboard', 'Next.js — GitHub OAuth login, project management, metrics visualisation'],
                                ].map(([label, desc]) => (
                                    <div key={label} className="flex gap-3">
                                        <span className="text-indigo-400 font-mono text-xs shrink-0 w-20 pt-0.5">{label}</span>
                                        <span className="text-gray-500 text-xs leading-relaxed">{desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Quickstart ──────────────────────────────── */}
                    <section id="quickstart" className="scroll-mt-28 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Quickstart</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Get your first event into your dashboard in under five minutes.
                        </p>

                        <h3 className="text-base font-semibold text-white mb-2">1. Create a project</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Log in with GitHub, go to your dashboard, and click <strong className="text-white">New Project</strong>.
                            Give it a name and your domain. Vyzora generates a project API key —
                            copy it, you&apos;ll need it in the next step.
                        </p>

                        <h3 className="text-base font-semibold text-white mb-2">2. Install the SDK</h3>
                        <pre className="code-block mb-6">npm install @vyzora/sdk</pre>
                        <p className="text-gray-400 text-sm leading-relaxed mb-2">
                            Or include it via CDN (no build step required):
                        </p>
                        <pre className="code-block mb-6">{`<script src="https://cdn.vyzora.io/sdk.js" defer></script>`}</pre>

                        <h3 className="text-base font-semibold text-white mb-2">3. Initialise and track</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Call <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">init()</code> once
                            at your app entry point. After that, call{' '}
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">track()</code> anywhere.
                        </p>
                        <pre className="code-block mb-6">{`import { init, track } from '@vyzora/sdk';

// Call once — app entry point, _app.tsx, layout.tsx, etc.
init({ apiKey: 'vyz_your_project_key' });

// Track a page view
track('page_view', { url: window.location.pathname });

// Track any custom event
track('button_click', { properties: { buttonId: 'cta-signup' } });`}</pre>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            That&apos;s it. Events are queued in memory and automatically flushed every 5 seconds,
                            when the queue reaches 10 events, or when the tab closes (via{' '}
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">navigator.sendBeacon</code>
                            {' '}for guaranteed delivery). Open your dashboard to see them arrive in real time.
                        </p>
                    </section>

                    {/* ── SDK Reference ─────────────────────────── */}
                    <section id="sdk-reference" className="scroll-mt-28 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">SDK Reference</h2>

                        <div className="space-y-6">
                            {[
                                {
                                    sig: 'init(options)',
                                    desc: 'Initialises the SDK. Must be called before any track() calls. Calling init() more than once is a no-op.',
                                    params: [
                                        ['apiKey', 'string', 'Your project API key (vyz_…)'],
                                        ['endpoint?', 'string', 'Override the ingest URL. Defaults to https://api.vyzora.io/api/ingest'],
                                    ],
                                },
                                {
                                    sig: 'track(type, payload?)',
                                    desc: 'Queues an analytics event. The SDK automatically attaches sessionId, visitorId, and timestamp.',
                                    params: [
                                        ['type', 'string', 'Event name, e.g. "page_view" or "button_click"'],
                                        ['payload.url?', 'string', 'The URL associated with the event'],
                                        ['payload.properties?', 'object', 'Any custom key/value pairs you want to record'],
                                    ],
                                },
                                {
                                    sig: 'resetSession()',
                                    desc: 'Clears the current session ID from sessionStorage and generates a new one. Call this after a user logs out.',
                                    params: [],
                                },
                                {
                                    sig: 'destroy()',
                                    desc: 'Flushes the queue, clears the flush timer, and removes event listeners. Use in cleanup hooks or single-page app teardown.',
                                    params: [],
                                },
                            ].map((fn) => (
                                <div key={fn.sig} className="rounded-2xl border border-white/10 bg-[#0d1117] p-6">
                                    <code className="text-indigo-300 font-mono text-sm font-semibold">{fn.sig}</code>
                                    <p className="text-sm text-gray-400 mt-2 mb-4 leading-relaxed">{fn.desc}</p>
                                    {fn.params.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parameters</p>
                                            <div className="space-y-1.5">
                                                {fn.params.map(([name, type, desc]) => (
                                                    <div key={name} className="flex gap-3 text-xs">
                                                        <code className="text-indigo-300 font-mono shrink-0">{name}</code>
                                                        <span className="text-gray-600 shrink-0">{type}</span>
                                                        <span className="text-gray-500">{desc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <h3 className="text-base font-semibold text-white mt-8 mb-3">CDN / IIFE usage</h3>
                        <pre className="code-block">{`<script src="https://cdn.vyzora.io/sdk.js" defer></script>
<script>
  window.addEventListener('load', function () {
    Vyzora.init({ apiKey: 'vyz_your_project_key' });
    Vyzora.track('page_view', { url: window.location.pathname });
  });
</script>`}</pre>
                    </section>

                    {/* ── API Reference ─────────────────────────── */}
                    <section id="api-reference" className="scroll-mt-28 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-2">API Reference</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Base URL: <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">https://api.vyzora.io</code>
                            {' '}· All responses follow <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">{'{ success, data, message }'}</code>
                        </p>

                        {/* Ingest */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono">POST</span>
                                <code className="text-white font-mono text-sm">/api/ingest</code>
                            </div>
                            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                                Receives a batch of events from the SDK. Authenticated by <strong className="text-white">API key</strong> in the request body — no JWT required here.
                            </p>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Request body</p>
                            <pre className="code-block mb-4">{`{
  "apiKey": "vyz_your_project_key",
  "events": [
    {
      "type":      "page_view",
      "url":       "https://myapp.com/pricing",
      "sessionId": "uuid-v4",
      "timestamp": "2026-02-22T10:00:00.000Z",
      "properties": { "referrer": "https://google.com" }
    }
  ]
}`}</pre>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Responses</p>
                            <div className="space-y-1.5">
                                {[
                                    { code: '202', desc: '{ success: true, data: { accepted: N } }' },
                                    { code: '401', desc: 'Invalid or unknown API key' },
                                    { code: '422', desc: 'Zod validation error — missing or malformed fields' },
                                ].map((r) => (
                                    <div key={r.code} className="flex items-start gap-3 text-xs">
                                        <span className={`font-mono font-bold shrink-0 ${r.code === '202' ? 'text-emerald-400' : r.code === '401' ? 'text-red-400' : 'text-amber-400'}`}>{r.code}</span>
                                        <span className="text-gray-500">{r.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono">GET</span>
                                <code className="text-white font-mono text-sm">/api/projects/:id/metrics</code>
                            </div>
                            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                                Returns aggregated analytics for a project. Requires a{' '}
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">Authorization: Bearer &lt;jwt&gt;</code> header.
                                Supports a <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">?range=</code> query param of{' '}
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">1d</code> |{' '}
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">7d</code> |{' '}
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">30d</code> |{' '}
                                <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">90d</code> (default: <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">7d</code>).
                            </p>
                            <pre className="code-block">{`{
  "success": true,
  "data": {
    "totalPageViews": 1240,
    "uniqueSessions": 312,
    "topPages":  [{ "url": "/pricing", "views": 400 }],
    "topEvents": [{ "type": "button_click", "count": 88 }],
    "dailyTrend": [{ "date": "2026-02-15", "pageViews": 180, "sessions": 45 }]
  }
}`}</pre>
                        </div>

                        {/* Projects */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono">GET</span>
                                <code className="text-white font-mono text-sm">/api/projects</code>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Returns all projects owned by the authenticated user.</p>
                            <div className="flex items-center gap-3 mb-3 pt-4 border-t border-white/5">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono">POST</span>
                                <code className="text-white font-mono text-sm">/api/projects</code>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 leading-relaxed">Creates a new project and returns its generated API key.</p>
                            <pre className="code-block mb-4">{`// Body
{ "name": "My App", "domain": "myapp.com" }

// Response 201
{ "success": true, "data": { "id": "uuid", "apiKey": "vyz_abc123..." } }`}</pre>
                            <div className="flex items-center gap-3 mb-3 pt-4 border-t border-white/5">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-red-500/20 text-red-400 font-mono">DELETE</span>
                                <code className="text-white font-mono text-sm">/api/projects/:id</code>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">Deletes a project and all its associated events permanently.</p>
                        </div>

                        {/* Health */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono">GET</span>
                                <code className="text-white font-mono text-sm">/health</code>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">Returns server status and current timestamp.</p>
                            <pre className="code-block">{`{ "status": "ok", "timestamp": "2026-02-22T11:00:00.000Z" }`}</pre>
                        </div>
                    </section>

                    {/* ── Authentication ────────────────────────── */}
                    <section id="authentication" className="scroll-mt-28 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Vyzora uses two separate auth mechanisms — one for the dashboard, one for the SDK.
                        </p>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6">
                                <h3 className="text-base font-semibold text-white mb-2">Dashboard — GitHub OAuth + JWT</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                    Clicking <strong className="text-white">Continue with GitHub</strong> redirects you through the standard OAuth flow.
                                    On callback, the backend upserts your GitHub account, issues a signed JWT, and redirects you
                                    to the dashboard. Store the JWT (the frontend handles this automatically) and include it as
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs ml-1">Authorization: Bearer &lt;jwt&gt;</code> on every protected API request.
                                </p>
                                <pre className="code-block">{`GET /auth/github           → redirects to GitHub
GET /auth/github/callback  → issues JWT, redirects to /dashboard
GET /auth/me               → returns authenticated user (requires JWT)
POST /auth/logout          → stateless; client discards the token`}</pre>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6">
                                <h3 className="text-base font-semibold text-white mb-2">SDK Ingest — Project API Key</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    The SDK does not use JWTs. It authenticates by embedding your project&apos;s
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs mx-1">apiKey</code>
                                    in the POST body of every
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs mx-1">/api/ingest</code>
                                    request. The key is a 64-character hex string (
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">crypto.randomBytes(32).toString(&apos;hex&apos;)</code>).
                                    You can regenerate it at any time from the Project Settings page.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── Self-hosting ──────────────────────────── */}
                    <section id="self-hosting" className="scroll-mt-28 mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Self-hosting</h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            The backend is a standard Express + Prisma app. Point it at any PostgreSQL 15+ instance
                            — local, Supabase, Neon, or your own cloud DB.
                        </p>

                        <pre className="code-block mb-6">{`# 1. Clone
git clone https://github.com/your-org/vyzora.git && cd vyzora

# 2. Backend
cd backend && cp .env.example .env   # fill in DATABASE_URL + GITHUB_* + JWT_SECRET
npm install && npx prisma db push && npm run dev

# 3. Frontend
cd ../frontend && npm install && npm run dev

# 4. SDK (optional — only if you want to modify it)
cd ../runtime-sdk && npm install && npm run build`}</pre>

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Set <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">NEXT_PUBLIC_API_URL</code> in{' '}
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs">frontend/.env.local</code> to point the
                            dashboard at your backend instance.
                        </p>
                    </section>

                    {/* ── FAQ ───────────────────────────────────────────── */}
                    <section id="faq" className="scroll-mt-28">
                        <h2 className="text-2xl font-bold text-white mb-6">FAQ</h2>

                        {[
                            {
                                q: 'Does the SDK work with SSR frameworks like Next.js?',
                                a: 'Yes. All SDK methods guard against typeof window === "undefined", so they are safe to import in server components — they simply no-op on the server and activate in the browser.',
                            },
                            {
                                q: 'What happens if an ingest request fails?',
                                a: 'The SDK catches the error silently. The batch is lost on the current cycle but tab-close events use navigator.sendBeacon which the browser queues even if the page unloads — giving you guaranteed delivery on navigation.',
                            },
                            {
                                q: 'How is a "session" defined?',
                                a: 'A session ID is a UUIDv4 stored in sessionStorage. It resets automatically when the browser tab closes, resets on resetSession() (call this after logout), and persists across page navigations within the same tab.',
                            },
                            {
                                q: 'Can I self-host on Vercel / Railway / Fly.io?',
                                a: 'Yes. The backend is a stateless Express app — deploy it anywhere Node.js 18+ runs. The frontend is a standard Next.js app and deploys to Vercel with zero config.',
                            },
                            {
                                q: 'What database does Vyzora use?',
                                a: 'PostgreSQL 15+ via Prisma ORM. The events table is indexed on (projectId, timestamp) so metric range queries stay fast as data grows. Supabase works out of the box.',
                            },
                        ].map((item) => (
                            <div key={item.q} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                                <h3 className="text-base font-semibold text-white mb-2">{item.q}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </section>
                </article>
            </div>
        </div>
    );
}
