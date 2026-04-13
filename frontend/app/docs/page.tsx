import DocsSidebar from '../../components/DocsSidebar';
import CodeBlock from '../../components/CodeBlock';

// Shared style helpers — keep layout identical to original
const code = 'bg-white/10 px-1.5 py-0.5 rounded text-indigo-300 text-xs';
const h2 = 'text-lg md:text-2xl font-bold text-white mb-4';
const h3 = 'text-xs md:text-base font-semibold text-white mb-2 mt-6';
const p = 'text-gray-400 leading-relaxed mb-4 text-[13px] md:text-sm';
const card = 'rounded-2xl border border-white/10 bg-[#0d1117] p-5 md:p-6 mb-4';

export default function DocsPage() {
    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 lg:gap-12">
                <DocsSidebar />

                <article className="flex-1 min-w-0 prose-sm max-w-none">

                    {/* ── 1. Introduction ─────────────────────────── */}
                    <section id="introduction" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h1 className="text-xl md:text-3xl font-bold text-white mb-4">Introduction</h1>
                        <p className={p}>
                            Vyzora is a privacy-first, developer-focused analytics service. You instrument
                            your frontend with the <code className={code}>vyzora-sdk</code>, events are
                            ingested into our high-performance Express backend, and your dashboard
                            queries real-time aggregated data from a PostgreSQL database — zero sampling,
                            zero third-party tracking.
                        </p>
                        <p className={p}>
                            Unlike standard analytics platforms, Vyzora is designed specifically for
                            modern web applications. Every event is validated server-side using Zod
                            and stored using the Prisma ORM in a secure, optimized schema. There is
                            no data sharing with any external advertising service.
                        </p>

                        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-5 mb-6">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Technical Architecture</p>
                            <div className="flex flex-col gap-2 text-xs text-gray-400">
                                {[
                                    ['vyzora-sdk', 'Collects events in browser → batches → flushes to Express API'],
                                    ['Express Backend', 'Validates API key → authenticated write via Prisma ORM'],
                                    ['PostgreSQL', 'High-performance storage with composite indexing on (projectId, createdAt)'],
                                    ['Next.js Dashboard', 'GitHub OAuth login → Real-time SQL aggregation metrics UI'],
                                ].map(([label, desc]) => (
                                    <div key={label} className="flex flex-col sm:flex-row sm:gap-3">
                                        <span className="text-indigo-400 font-mono shrink-0 sm:w-36 pt-0.5">{label}</span>
                                        <span className="text-gray-500 leading-relaxed break-words">{desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── 2. Quick Start ──────────────────────────── */}
                    <section id="quick-start" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Quick Start</h2>
                        <p className={p}>Minimum working setup in three steps.</p>

                        <h3 className={h3}>1. Install</h3>
                        <CodeBlock>npm install vyzora-sdk</CodeBlock>

                        <h3 className={h3}>2. Initialize</h3>
                        <CodeBlock>{`import { Vyzora } from 'vyzora-sdk';

new Vyzora({
  apiKey: 'your_project_api_key',
  enabled: true,
});`}</CodeBlock>

                        <h3 className={h3}>3. Track</h3>
                        <CodeBlock>{`vyzora.track('button_click', { plan: 'pro' });`}</CodeBlock>

                        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300">
                            <strong>Critical:</strong> If <code className={code}>enabled</code> is{' '}
                            <code className={code}>false</code> or omitted, the SDK exits the constructor
                            immediately. No queue, no listeners, no timers are created. Nothing executes.
                        </div>
                    </section>

                    {/* ── 3. Installation ─────────────────────────── */}
                    <section id="installation" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Installation</h2>

                        <h3 className={h3}>npm / yarn / pnpm</h3>
                        <CodeBlock>{`npm install vyzora-sdk
yarn add vyzora-sdk
pnpm add vyzora-sdk`}</CodeBlock>

                        <h3 className={h3}>Next.js (App Router)</h3>
                        <CodeBlock>{`// components/VyzoraProvider.tsx
'use client';
import { useEffect } from 'react';
import { Vyzora } from 'vyzora-sdk';

export default function VyzoraProvider() {
  useEffect(() => {
    new Vyzora({
      apiKey: process.env.NEXT_PUBLIC_VYZORA_KEY!,
      enabled: process.env.NEXT_PUBLIC_VYZORA_ENABLED === 'true',
    });
  }, []);
  return null;
}

// app/layout.tsx
import VyzoraProvider from '@/components/VyzoraProvider';
export default function RootLayout({ children }) {
  return <html><body><VyzoraProvider />{children}</body></html>;
}`}</CodeBlock>

                        <h3 className={h3}>React (Vite / CRA)</h3>
                        <CodeBlock>{`// src/main.tsx
import { Vyzora } from 'vyzora-sdk';
new Vyzora({ apiKey: import.meta.env.VITE_VYZORA_KEY, enabled: true });`}</CodeBlock>

                        <h3 className={h3}>Vanilla JS</h3>
                        <CodeBlock>{`<script type="module">
  import { Vyzora } from 'https://cdn.jsdelivr.net/npm/vyzora-sdk/dist/index.mjs';
  new Vyzora({ apiKey: 'your_key', enabled: true });
</script>`}</CodeBlock>

                        <p className={p}>
                            The SDK must run in the browser. It guards against{' '}
                            <code className={code}>typeof window === &apos;undefined&apos;</code> and exits
                            silently when executed in a Node.js or Edge runtime context.
                        </p>
                    </section>

                    {/* ── 4. Initialization ───────────────────────── */}
                    <section id="initialization" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Initialization</h2>
                        <p className={p}>
                            The <code className={code}>Vyzora</code> constructor accepts a config object.
                            Only <code className={code}>apiKey</code> is required.
                        </p>
                        <CodeBlock>{`const vyzora = new Vyzora({
  apiKey: 'your_project_api_key',   // Required
  enabled: true,                    // Default: false
  batchSize: 20,                    // Default: 20
  flushInterval: 10000,             // Default: 10000ms (10s)
  debug: false,                     // Default: false
});`}</CodeBlock>
                        <p className={p}>
                            If <code className={code}>apiKey</code> is missing, the constructor throws synchronously:{' '}
                            <code className={code}>[Vyzora] apiKey is required.</code> — catch this at your
                            integration point.
                        </p>
                        <p className={p}>
                            The <code className={code}>apiKey</code> is mandatory for every instance.
                            You can find it in your project settings on the Vyzora dashboard.
                        </p>
                    </section>

                    {/* ── 5. Tracking Events ──────────────────────── */}
                    <section id="tracking-events" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Tracking Events</h2>

                        <CodeBlock>{`vyzora.track('button_click', { plan: 'pro', source: 'hero' });`}</CodeBlock>

                        <p className={p}>
                            <code className={code}>track(eventType, metadata?)</code> builds an event and
                            pushes it into the in-memory queue.
                        </p>

                        <div className={card}>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">What the SDK attaches automatically</p>
                            <div className="space-y-3 text-xs text-gray-400">
                                {[
                                    ['sessionId', 'Current session UUID from localStorage (vyzora_sid)'],
                                    ['visitorId', 'Stable visitor UUID from localStorage (vyzora_vid)'],
                                    ['path', 'window.location.pathname + window.location.search at call time'],
                                    ['browser / os / deviceType', 'UA-parsed from navigator.userAgent'],
                                    ['screenWidth / screenHeight', 'From window.screen'],
                                    ['language', 'navigator.language'],
                                    ['referrer', 'document.referrer (omitted if empty)'],
                                    ['timezone', 'Intl.DateTimeFormat().resolvedOptions().timeZone'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3 min-w-0">
                                        <code className="text-indigo-300 shrink-0 sm:w-44 mb-0.5 sm:mb-0">{k}</code>
                                        <span className="text-gray-500 break-all">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className={p}>
                            Your custom <code className={code}>metadata</code> is <strong className="text-white">merged on top of</strong>{' '}
                            the auto-collected metadata. Your values overwrite automatic ones on key collision.
                            If the merged object is empty, <code className={code}>metadata</code> is omitted from
                            the payload entirely.
                        </p>
                        <p className={p}>
                            <code className={code}>track()</code> is wrapped in <code className={code}>try/catch</code>.
                            It will never throw. If the SDK is not enabled or the queue is not initialized, it no-ops.
                        </p>
                    </section>

                    {/* ── 6. Pageview Tracking ────────────────────── */}
                    <section id="pageview-tracking" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Pageview Tracking (SPA Behavior)</h2>
                        <p className={p}>
                            Pageview tracking is automatic. The SDK hooks into browser navigation APIs on
                            initialization. No manual calls are needed for standard navigation.
                        </p>

                        <div className={card}>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Triggers</p>
                            <div className="space-y-2 text-sm text-gray-400">
                                {[
                                    ['window load event', 'Fires once. Records the initial pageview when the page finishes loading.'],
                                    ['history.pushState', 'Wrapped. Fires a pageview after every programmatic navigation (React Router, Next.js Link).'],
                                    ['history.replaceState', 'Wrapped. Fires a pageview on replace navigations.'],
                                    ['window popstate', 'Listened. Fires on browser back/forward button presses.'],
                                ].map(([trigger, desc]) => (
                                    <div key={trigger} className="flex flex-col sm:flex-row sm:gap-3">
                                        <code className="text-indigo-300 text-xs shrink-0 sm:w-44 pt-0.5">{trigger}</code>
                                        <span className="text-gray-500 text-xs leading-relaxed">{desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className={h3}>Deduplication</h3>
                        <p className={p}>
                            The SDK stores the last tracked path as{' '}
                            <code className={code}>pathname + search</code>. If the new path matches, the
                            pageview is dropped. Hash-only changes (e.g. <code className={code}>#section</code>)
                            are never tracked because they do not change <code className={code}>pathname</code> or{' '}
                            <code className={code}>search</code>.
                        </p>

                        <h3 className={h3}>Singleton Guard</h3>
                        <p className={p}>
                            <code className={code}>pushState</code> and <code className={code}>replaceState</code>{' '}
                            are wrapped at most once (guarded by an instance-level{' '}
                            <code className={code}>historyWrapped</code> flag). Re-instantiating the SDK will
                            not double-wrap history methods.
                        </p>

                        <h3 className={h3}>Manual override</h3>
                        <CodeBlock>{`vyzora.pageview('/custom-path'); // explicit path
vyzora.pageview();               // defaults to current pathname + search`}</CodeBlock>
                    </section>

                    {/* ── 7. Visitor & Session Model ──────────────── */}
                    <section id="visitor-session" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Visitor &amp; Session Model</h2>

                        <h3 className={h3}>Visitor ID</h3>
                        <div className={card}>
                            <div className="space-y-1.5 text-xs text-gray-400">
                                {[
                                    ['Storage key', 'vyzora_vid (localStorage)'],
                                    ['Rotation', 'Never. Persists across browser sessions.'],
                                    ['Generation', 'crypto.randomUUID() with Math.random() fallback'],
                                    ['Storage failure', 'Falls back to a stable module-level in-memory variable for the page lifetime. New on next hard load.'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                                        <span className="text-indigo-300 shrink-0 sm:w-32">{k}</span>
                                        <span className="text-gray-500 break-words">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className={h3}>Session ID</h3>
                        <div className={card}>
                            <div className="space-y-1.5 text-xs text-gray-400">
                                {[
                                    ['Storage key', 'vyzora_sid (localStorage)'],
                                    ['Timestamp key', 'vyzora_session_ts (localStorage)'],
                                    ['Rotation', 'After 30 minutes of inactivity (no track() calls)'],
                                    ['Timestamp update', 'On every getSessionId() call — including track() and pageview()'],
                                    ['Manual reset', 'vyzora.resetSession() — removes both keys. New session on next event.'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                                        <span className="text-indigo-300 shrink-0 sm:w-36">{k}</span>
                                        <span className="text-gray-500 break-words">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className={h3}>identify()</h3>
                        <CodeBlock>{`vyzora.identify('user_db_id_123');`}</CodeBlock>
                        <p className={p}>
                            Overrides the auto-generated visitor ID with a known user identity for all
                            subsequent events. Does not modify <code className={code}>localStorage</code>. The
                            override is stored in-memory on the Vyzora instance and is lost on page unload.
                        </p>
                    </section>

                    {/* ── 8. Batching & Delivery ──────────────────── */}
                    <section id="batching-delivery" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Batching &amp; Delivery</h2>

                        <h3 className={h3}>In-memory Queue</h3>
                        <p className={p}>
                            Events are pushed into an in-memory array (the <code className={code}>Queue</code> class).
                            Nothing is written to disk. If the page unloads before a flush, un-sent events are lost
                            unless <code className={code}>sendBeacon</code> fires.
                        </p>

                        <h3 className={h3}>Flush Triggers</h3>
                        <div className={card}>
                            <div className="space-y-2 text-xs text-gray-400">
                                {[
                                    ['Interval', `Auto-flush every flushInterval ms (default: 10 000ms). Interval starts on SDK init. Only one interval exists — guarded by a null check.`],
                                    ['Batch size', `If queue.length >= batchSize (default: 20), an immediate flush() is triggered after push().`],
                                    ['visibilitychange', 'Flushed when document.visibilityState becomes "hidden" (tab switch, minimize).'],
                                    ['pagehide', 'Flushed when the pagehide window event fires (navigation away, page unload).'],
                                    ['destroy()', 'Explicit flush on SDK teardown, then clears interval and removes listeners.'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                                        <code className="text-indigo-300 shrink-0 sm:w-32">{k}</code>
                                        <span className="text-gray-500 leading-relaxed break-words">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className={h3}>Transport</h3>
                        <p className={p}>
                            On flush, the SDK first attempts <code className={code}>navigator.sendBeacon</code>.
                            Beacon is preferred because the browser guarantees it fires even after the page closes.
                            If <code className={code}>sendBeacon</code> is unavailable or returns{' '}
                            <code className={code}>false</code>, the SDK falls back to{' '}
                            <code className={code}>fetch(keepalive: true)</code>.
                        </p>

                        <h3 className={h3}>Retry Policy</h3>
                        <div className={card}>
                            <div className="space-y-2 text-xs text-gray-400">
                                {[
                                    ['5xx response', 'Single retry after 2 000ms. No second retry.'],
                                    ['Network error', 'Single retry after 2 000ms. No second retry.'],
                                    ['4xx response (401, 403, 429, etc.)', 'Dropped silently. No retry.'],
                                    ['Retry failure', 'Dropped silently. Events are not re-inserted into the queue.'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                                        <code className="text-indigo-300 shrink-0 sm:w-56">{k}</code>
                                        <span className="text-gray-500 break-words">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <h3 className={h3}>Race Condition Guard</h3>
                        <p className={p}>
                            A <code className={code}>flushing</code> boolean on the Queue class prevents
                            concurrent flush calls. If two flushes are triggered simultaneously (e.g.,
                            <code className={code}>visibilitychange</code> + <code className={code}>pagehide</code>),
                            the second returns immediately. The flag resets in a{' '}
                            <code className={code}>try/finally</code> block, so it always resets even if{' '}
                            <code className={code}>sendBatch</code> throws.
                        </p>
                    </section>

                    {/* ── 9. Reliability Guarantees ───────────────── */}
                    <section id="reliability" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Reliability Guarantees</h2>

                        <div className="space-y-3">
                            {[
                                ['SDK never throws to host app', 'All public methods (track, pageview, flush, destroy) are wrapped in try/catch. Errors are swallowed internally.'],
                                ['No console.error pollution', 'Errors fail silently. console.log output only appears when debug: true.'],
                                ['No execution when disabled', 'enabled: false causes the constructor to return before creating any queue, timers, or event listeners.'],
                                ['Zero global pollution', 'The SDK does not assign anything to window.* and does not modify any prototype chain.'],
                                ['History wrapping only', 'The only mutation is overriding history.pushState and history.replaceState. This is done at most once per SDK instance.'],
                                ['Safe localStorage access', 'All reads/writes go through safeGet, safeSet, safeRemove wrappers. Safari private mode (SecurityError) and QuotaExceededError are caught silently.'],
                                ['In-memory visitor fallback', 'If localStorage is unavailable, a module-level fallbackId is used. Visitor ID is stable for the page lifetime.'],
                                ['Safe destroy()', 'destroy() clears the interval, removes event listeners, and flushes remaining events. Safe to call multiple times.'],
                            ].map(([title, desc]) => (
                                <div key={title as string} className="rounded-xl border border-white/10 bg-[#0d1117] p-4">
                                    <p className="text-xs font-semibold text-white mb-1">{title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── 10. Configuration Options ───────────────── */}
                    <section id="configuration" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Configuration Options</h2>

                        <div className="overflow-x-auto -mx-1">
                            <table className="w-full text-xs text-left border-collapse min-w-[520px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-2 pr-4 text-gray-400 font-semibold w-36">Option</th>
                                        <th className="py-2 pr-4 text-gray-400 font-semibold w-24">Type</th>
                                        <th className="py-2 pr-4 text-gray-400 font-semibold w-28">Default</th>
                                        <th className="py-2 text-gray-400 font-semibold">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        ['apiKey', 'string', 'Required', 'Your project API key from the Vyzora dashboard. Throws if missing.'],
                                        ['enabled', 'boolean', 'false', 'Must be true to activate tracking. The SDK is completely inert if false.'],
                                        ['batchSize', 'number', '20', 'Max events per batch. Triggers an immediate flush when reached.'],
                                        ['flushInterval', 'number', '10000', 'Auto-flush interval in milliseconds.'],
                                        ['debug', 'boolean', 'false', 'Enables verbose console.log output from the SDK internals.'],
                                    ].map(([opt, type, def, desc]) => (
                                        <tr key={opt as string}>
                                            <td className="py-2.5 pr-4"><code className="text-indigo-300">{opt}</code></td>
                                            <td className="py-2.5 pr-4 text-gray-500">{type}</td>
                                            <td className="py-2.5 pr-4 text-gray-600">{def}</td>
                                            <td className="py-2.5 text-gray-500 leading-relaxed">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ── 11. API Reference ───────────────────────── */}
                    <section id="api-reference" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>API Reference</h2>

                        <div className="space-y-4">
                            {[
                                {
                                    sig: 'new Vyzora(config)',
                                    desc: 'Creates the SDK instance. Throws synchronously if apiKey is missing. If enabled is false, returns immediately. If window is undefined (SSR), returns immediately.',
                                    params: [['config', 'VyzoraConfig', 'See Configuration Options table']],
                                },
                                {
                                    sig: 'vyzora.track(eventType, metadata?)',
                                    desc: 'Queues a custom event. Auto-collects browser metadata and merges it with your metadata. Path is taken from window.location. No-ops if not enabled.',
                                    params: [
                                        ['eventType', 'string', 'A short identifying string, e.g. "button_click"'],
                                        ['metadata', 'Record<string, unknown>', 'Optional custom key/value pairs. Merged with auto-metadata.'],
                                    ],
                                },
                                {
                                    sig: 'vyzora.pageview(path?)',
                                    desc: 'Records a pageview event. Deduplicates against the last tracked path. If path is omitted, uses window.location.pathname + window.location.search.',
                                    params: [
                                        ['path', 'string (optional)', 'Explicit path to record. Defaults to current URL.'],
                                    ],
                                },
                                {
                                    sig: 'vyzora.identify(visitorId)',
                                    desc: 'Overrides the auto-generated visitor ID for all subsequent events on this instance. Does not persist to localStorage.',
                                    params: [
                                        ['visitorId', 'string', 'A known user identifier, e.g. a database user ID.'],
                                    ],
                                },
                                {
                                    sig: 'vyzora.flush()',
                                    desc: 'Manually triggers an immediate flush of the event queue. Returns a Promise that resolves when the transport completes.',
                                    params: [],
                                },
                                {
                                    sig: 'vyzora.resetSession()',
                                    desc: 'Removes vyzora_sid and vyzora_session_ts from localStorage. The next track() or pageview() call will generate a new session ID.',
                                    params: [],
                                },
                                {
                                    sig: 'vyzora.destroy()',
                                    desc: 'Flushes remaining events, clears the interval timer, and removes visibilitychange and pagehide listeners. Call in component cleanup hooks or SPA teardown.',
                                    params: [],
                                },
                            ].map((fn) => (
                                <div key={fn.sig} className={card}>
                                    <code className="text-indigo-300 font-mono text-sm font-semibold">{fn.sig}</code>
                                    <p className="text-sm text-gray-400 mt-2 mb-4 leading-relaxed">{fn.desc}</p>
                                    {fn.params.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parameters</p>
                                            <div className="space-y-3">
                                                {fn.params.map(([name, type, desc]) => (
                                                    <div key={name} className="flex flex-col sm:flex-row sm:gap-3 text-xs min-w-0">
                                                        <code className="text-indigo-300 font-mono sm:w-28 mb-0.5 sm:mb-0 shrink-0">{name}</code>
                                                        <span className="text-gray-600 sm:w-40 mb-0.5 sm:mb-0 shrink-0 break-words">{type}</span>
                                                        <span className="text-gray-500 break-words">{desc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── 12. Backend Ingestion Format ────────────── */}
                    <section id="ingest-format" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Backend Ingestion Format</h2>
                        <p className={p}>
                            The SDK posts a JSON payload to <code className={code}>POST /api/ingest</code>.
                            This is the exact shape our backend expects and validates:
                        </p>

                        <CodeBlock>{`// POST /api/ingest
// Content-Type: application/json

{
  "apiKey": "64-char-hex-string",
  "events": [
    {
      "sessionId":  "uuid-v4",
      "visitorId":  "uuid-v4",
      "eventType":  "pageview",
      "path":       "/pricing",
      "metadata": {
        "browser":      "Chrome",
        "browserVersion": "121",
        "os":           "macOS",
        "deviceType":   "desktop",
        "screenWidth":  1440,
        "screenHeight": 900,
        "language":     "en-US",
        "referrer":     "https://google.com",
        "timezone":     "Asia/Kolkata"
      }
    }
  ]
}`}</CodeBlock>

                        <div className={card}>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Constraints (Zod Enforced)</p>
                            <div className="space-y-1.5 text-xs text-gray-400">
                                {[
                                    ['sessionId', '≤ 128 chars, required'],
                                    ['visitorId', '≤ 128 chars, required'],
                                    ['eventType', '≤ 64 chars, required'],
                                    ['path', '≤ 512 chars, required'],
                                    ['metadata', 'JSON object, optional'],
                                    ['apiKey', 'Validated against Database Project table.'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col sm:flex-row sm:gap-3">
                                        <code className="text-indigo-300 shrink-0 sm:w-28">{k}</code>
                                        <span className="text-gray-500 break-words">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className={p}>
                            The backend server also automatically captures <code className={code}>ipAddress</code>
                            and <code className={code}>userAgent</code> for server-side parsing. These fields are
                            never transmitted by the client SDK to reduce payload weight.
                        </p>
                    </section>

                    {/* ── 13. Security & Validation ───────────────── */}
                    <section id="security" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Security &amp; Validation</h2>

                        <div className="space-y-3">
                            {[
                                ['API Key Validation', 'Every ingest request must include a valid 64-character API key. The backend verifies this against the PostgreSQL database before performing any ingestion logic.'],
                                ['No Client-side Trust', 'We never trust client-provided IDs for authorization. The API key is the sole source of authentication for incoming event streams.'],
                                ['Rate Limiting', 'Our infrastructure enforces strict rate limits via express-rate-limit on all endpoints to prevent abuse and ensure stability.'],
                                ['Encrypted Sessions', 'Dashboard login is managed via secure, HttpOnly, SameSite=None JWT cookies, ensuring tamper-proof authenticated access.'],
                                ['Data Residency', 'All event data is stored in a hardened PostgreSQL instance using Prisma for type-safe database queries and automated migrations.'],
                                ['Project Isolation', 'Every metrics query validates project ownership at the database level using relational JOINs before returning aggregated results.'],
                            ].map(([title, desc]) => (
                                <div key={title as string} className="rounded-xl border border-white/10 bg-[#0d1117] p-4">
                                    <p className="text-xs font-semibold text-white mb-1">{title}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── 14. Architecture & Development ───────────────────── */}
                    <section id="local-dev" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Architecture &amp; Development</h2>
                        <p className={p}>
                            Vyzora is built using a modern, scalable stack designed for high-throughput
                            data ingestion and low-latency metrics visualization.
                        </p>

                        <CodeBlock>{`# Tech Stack Visualization
Runtime SDK: TypeScript (tsup bundle)
API Backend: Express.js (Node.js)
Database:    PostgreSQL (Prisma ORM)
Dashboard:   Next.js 16 (App Router)`}</CodeBlock>

                        <h3 className={h3}>Backend Logic</h3>
                        <p className={p}>
                            The core logic resides in a centralized Express.js application that handles
                            routing, Zod-based validation, and PostgreSQL communication. We use
                            Prisma for efficient query building and schema management.
                        </p>

                        <h3 className={h3}>Frontend Stack</h3>
                        <p className={p}>
                            The dashboard is a high-performance Next.js 16 application utilizing server
                            components for initial rendering and React Query for real-time metric updates.
                        </p>
                    </section>

                    {/* ── 15. Service Reliability ───────────────── */}
                    <section id="production" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Service Reliability</h2>
                        <p className={p}>
                            Stability is our priority. Our core transport layer utilizes a
                            <code className={code}>sendBeacon</code> first approach, falling back to
                            high-performance <code className={code}>fetch</code> with keepalive parity
                            to ensure events are delivery even during page unloads.
                        </p>

                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm text-indigo-300">
                            <strong>Note:</strong> We monitor our ingestion endpoints 24/7. Our backend is
                            horizontally scalable to handle sudden bursts of event traffic without
                            increasing ingestion latency.
                        </div>
                    </section>


                    {/* ── 16. FAQ ─────────────────────────────────── */}
                    <section id="faq" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>FAQ</h2>

                        <div className="space-y-0">
                            {[
                                {
                                    q: 'Why are events not appearing in my dashboard?',
                                    a: 'Check: (1) enabled is true, (2) the API key is correct, (3) the endpoint is set to your production backend, (4) the backend is running and reachable. Open DevTools Network and look for POST /api/ingest — a 401 means API key is invalid or the project was deleted.',
                                },
                                {
                                    q: 'Why am I seeing duplicate pageviews?',
                                    a: 'Likely caused by SDK instantiation running more than once in the same page lifecycle (e.g. React Strict Mode double-invoke in development). In production, React Strict Mode does not double-invoke effects. The historyWrapped guard ensures pushState/replaceState are wrapped at most once per instance, but two separate Vyzora instances would each wrap independently.',
                                },
                                {
                                    q: 'How do I disable tracking for specific users?',
                                    a: 'Pass enabled: false when constructing the SDK instance. All public methods no-op immediately. Alternatively, call vyzora.destroy() to tear down an already-running instance.',
                                },
                                {
                                    q: 'Does the SDK work in SSR (Next.js server components)?',
                                    a: 'You can import the SDK in SSR contexts. The constructor checks typeof window === "undefined" and returns early if true. No queue, listeners, or timers are created on the server. Wrap initialization in a useEffect or mount it in a client component.',
                                },
                                {
                                    q: 'Does it work without localStorage?',
                                    a: 'Yes. Storage access is wrapped in try/catch. If localStorage is unavailable (Safari private mode, SecurityError), visitor ID falls back to a stable in-memory variable for the page lifetime, and session tracking degrades gracefully.',
                                },
                                {
                                    q: 'What happens if I delete a project that is still sending events?',
                                    a: 'The API key is immediately invalid. Every subsequent POST /api/ingest with that key returns 401 Unauthorized. No events are written. The SDK will retry once on network errors, but 401 is never retried — those batches are dropped silently.',
                                },
                            ].map((item) => (
                                <div key={item.q} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                                    <h3 className="text-sm font-semibold text-white mb-2">{item.q}</h3>
                                    <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── 17. Troubleshooting ─────────────────────── */}
                    <section id="troubleshooting" className="scroll-mt-24 md:scroll-mt-28 mb-12 md:mb-16">
                        <h2 className={h2}>Troubleshooting</h2>

                        <h3 className={h3}>Debugging with DevTools</h3>
                        <p className={p}>
                            Initialize with <code className={code}>debug: true</code> to enable verbose SDK
                            logging. Open the Network tab and filter for <code className={code}>ingest</code> to
                            see every POST request, its status code, and timing.
                        </p>

                        <div className="space-y-4">
                            {[
                                {
                                    title: '401 on POST /api/ingest',
                                    items: [
                                        'The API key does not match any project in the database.',
                                        'The project was deleted.',
                                        'You are testing with a local API key against a production backend (or vice versa).',
                                        'The SDK was built with the wrong VYZORA_API_URL. Rebuild the SDK and redeploy.',
                                    ],
                                },
                                {
                                    title: 'CORS errors on ingest',
                                    items: [
                                        'The backend CORS origin does not match the frontend domain exactly (including protocol and port).',
                                        'FRONTEND_URL is missing or set to the wrong value on the backend server.',
                                        'credentials: true must be in the CORS config if cookies are used.',
                                    ],
                                },
                                {
                                    title: 'Auth loop / not redirecting after GitHub login',
                                    items: [
                                        'GitHub OAuth App callback URL does not match BACKEND_URL/api/auth/github/callback.',
                                        'FRONTEND_URL is wrong — the post-OAuth redirect goes to the wrong domain.',
                                        'NODE_ENV is not set to production — cookie SameSite policy defaults to lax instead of none.',
                                    ],
                                },
                                {
                                    title: 'Events sent but not in dashboard',
                                    items: [
                                        'Verify POST /api/ingest returns 200 in Network tab.',
                                        'Check the Prisma database directly: look at the Event table for recent rows with the correct projectId.',
                                        'Dashboard metrics queries are time-range filtered (7d default). Check if events are within range.',
                                    ],
                                },
                            ].map((group) => (
                                <div key={group.title} className={card}>
                                    <p className="text-xs font-semibold text-red-400 mb-3">{group.title}</p>
                                    <ul className="space-y-1.5">
                                        {group.items.map((item) => (
                                            <li key={item} className="text-xs text-gray-500 flex gap-2">
                                                <span className="text-gray-600 shrink-0">—</span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                </article>
            </div>
        </div>
    );
}
