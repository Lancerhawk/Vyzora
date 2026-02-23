import ParticleField from '../components/ParticleField';

// GitHub SVG path (shared)
const GH_PATH =
  'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z';

const features = [
  {
    num: '01',
    title: 'Zero-config instrumentation',
    description:
      'Install vyzora-sdk, pass your API key, set enabled: true. The SDK auto-collects pageviews, wraps SPA navigation, and batches events client-side — no additional setup required.',
    accent: 'from-indigo-500/20 to-indigo-500/0',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-400',
    dotColor: 'bg-indigo-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bullets: ['Auto pageviews on load & SPA nav', '10s flush interval by default', 'sendBeacon + fetch fallback'],
  },
  {
    num: '02',
    title: 'Project-scoped API keys',
    description:
      'Each project is issued a 64-character cryptographic key. Every ingest request is validated against your database. Missing or revoked keys are rejected with 401 before any write occurs.',
    accent: 'from-violet-500/20 to-violet-500/0',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    dotColor: 'bg-violet-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
    bullets: ['crypto.randomBytes(32) key generation', 'Revoke anytime from dashboard', 'Project cascade-deletes events'],
  },
  {
    num: '03',
    title: 'Visitor & session model',
    description:
      'Visitor IDs (vyzora_vid) persist in localStorage and never rotate. Session IDs (vyzora_sid) expire after 30 minutes of inactivity. Both are UUID v4 — stable, anonymous, and under your control.',
    accent: 'from-purple-500/20 to-purple-500/0',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-400',
    dotColor: 'bg-purple-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    bullets: ['localStorage with silent fallback', '30-min inactivity rotation', 'identify() for known users'],
  },
  {
    num: '04',
    title: 'Aggregated metrics API',
    description:
      'Query pageviews, unique sessions, top pages, event counts, and daily trends via a single REST endpoint. Supports 1d, 7d, 30d, 90d ranges. All queries validate ownership before returning data.',
    accent: 'from-sky-500/20 to-sky-500/0',
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    iconColor: 'text-sky-400',
    dotColor: 'bg-sky-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bullets: ['GET /api/projects/:id/metrics', '4 time-range options', 'Indexed on (projectId, createdAt)'],
  },
];

const stack = [
  { label: 'Runtime SDK', detail: 'TypeScript · ESM/CJS · sendBeacon + fetch transport' },
  { label: 'Backend', detail: 'Express · TypeScript · Prisma ORM · Zod validation' },
  { label: 'Database', detail: 'PostgreSQL · indexed on (projectId, createdAt)' },
  { label: 'Dashboard', detail: 'Next.js App Router · GitHub OAuth · JWT (HttpOnly cookie)' },
  { label: 'Rate Limiting', detail: 'express-rate-limit · per-route policies' },
  { label: 'Auth', detail: 'API key (ingest) · JWT + cookie (dashboard)' },
];

const archSteps = [
  {
    step: '01',
    title: 'Instrument',
    sub: 'vyzora-sdk (Runtime SDK)',
    desc: 'The SDK collects events, manages visitor and session IDs in localStorage, and buffers them in an in-memory queue. It flushes on a 10-second interval, on batch-size overflow (20 events), on tab hide, and on page unload — using sendBeacon when available.',
    icon: '📦',
    accent: 'from-indigo-600/[0.12] to-transparent border-indigo-500/20',
  },
  {
    step: '02',
    title: 'Ingest',
    sub: 'Express + Prisma + PostgreSQL',
    desc: 'The backend receives batched event payloads at POST /api/ingest. It validates the API key against the project table, runs Zod schema validation on each event, and bulk-inserts into PostgreSQL. Invalid keys are dropped at the controller level — they never touch the ORM.',
    icon: '⚙️',
    accent: 'from-violet-600/[0.12] to-transparent border-violet-500/20',
  },
  {
    step: '03',
    title: 'Analyse',
    sub: 'Next.js Dashboard',
    desc: 'After GitHub OAuth login, you see aggregated metrics for each project: total pageviews, unique sessions, top pages, top events, and a daily trend chart — all queried from PostgreSQL in real time. Each metric query validates project ownership before returning data.',
    icon: '📈',
    accent: 'from-purple-600/[0.12] to-transparent border-purple-500/20',
  },
];

export default function Home() {
  return (
    <>
      {/* ─────────────── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030712]">
        <ParticleField />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-28 pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/[0.08] text-indigo-300 text-[13px] font-medium mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Privacy-first · High performance · Developer-focused
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black tracking-[-0.03em] leading-[1.04] text-white mb-6">
            Analytics that respect
            <br />
            <span className="gradient-text">user privacy.</span>
          </h1>

          {/* Sub */}
          <p className="max-w-[580px] mx-auto text-[17px] text-gray-400 leading-[1.65] mb-10">
            Vyzora is a privacy-first analytics service. A lightweight browser SDK, a
            secure ingest API, and a powerful dashboard that shows you
            exactly what your users are doing, with no third-party data sharing.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a
              href="/login"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-px"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d={GH_PATH} />
              </svg>
              Get started free
            </a>
            <a
              href="/docs"
              className="px-8 py-3.5 rounded-xl border border-white/[0.1] hover:border-white/[0.18] text-gray-300 hover:text-white font-semibold text-sm transition-all duration-200 bg-white/[0.03] hover:bg-white/[0.07] hover:-translate-y-px"
            >
              Read the docs →
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
            {[
              { value: '< 3 KB', label: 'Gzipped SDK bundle size' },
              { value: '10s', label: 'Default flush interval' },
              { value: '100%', label: 'Privacy-focused analytics' },
            ].map((s) => (
              <div key={s.label} className="text-center px-6 py-3 sm:py-0 first:pt-0 last:pb-0">
                <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
      </section>

      {/* ─────────────── CODE PREVIEW ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
              SDK
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 leading-tight">
              Install once.<br />
              <span className="gradient-text">Track everything.</span>
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              Drop the SDK into any JavaScript or TypeScript project. Pageviews are captured
              automatically on load and on every SPA navigation. Custom events take one line.
              The queue flushes in the background — your app is never blocked.
            </p>
            <div className="space-y-3">
              {[
                ['Auto pageviews', 'Fires on window load, pushState, replaceState, and popstate'],
                ['Deduplicated', 'Tracks pathname + search. Hash changes are ignored.'],
                ['Safe by default', 'SDK never throws. All storage access is try/catch wrapped.'],
                ['Retry on failure', 'Single retry on 5xx or network errors. 4xx are dropped silently.'],
              ].map(([title, desc]) => (
                <div key={title as string} className="flex gap-3 items-start">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <p className="text-sm text-gray-400 leading-relaxed">
                    <span className="text-white font-medium">{title}</span> — {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: code block */}
          <div className="rounded-2xl border border-white/10 bg-[#060d1a] overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-gray-600 font-mono">vyzora-init.ts</span>
            </div>
            <pre className="p-6 text-[13px] leading-[1.9] font-mono overflow-x-auto">
              <span className="text-gray-600">{'// 1. Install\n'}</span>
              <span className="text-emerald-400">{'npm install vyzora-sdk\n\n'}</span>
              <span className="text-gray-600">{'// 2. Initialize (once, in your app entry)\n'}</span>
              <span className="text-blue-300">{'import '}</span>
              <span className="text-white">{'{ Vyzora } '}</span>
              <span className="text-blue-300">{'from '}</span>
              <span className="text-amber-300">{`'vyzora-sdk';\n`}</span>
              <span className="text-blue-300">{'\nconst '}</span>
              <span className="text-white">{'vyzora '}</span>
              <span className="text-gray-400">{'= '}</span>
              <span className="text-blue-300">{'new '}</span>
              <span className="text-yellow-300">{'Vyzora'}</span>
              <span className="text-gray-400">{'({'}</span>
              <span className="text-white">{'\n  apiKey'}</span>
              <span className="text-gray-400">{': '}</span>
              <span className="text-amber-300">{`'your_project_api_key'`}</span>
              <span className="text-gray-400">{'  '}</span>
              <span className="text-gray-600">{'// from dashboard\n'}</span>
              <span className="text-white">{'  enabled'}</span>
              <span className="text-gray-400">{': '}</span>
              <span className="text-violet-400">{'true'}</span>
              <span className="text-gray-400">{'              '}</span>
              <span className="text-gray-600">{'// required\n'}</span>
              <span className="text-gray-400">{'});\n\n'}</span>
              <span className="text-gray-600">{'// 3. Track custom events anywhere\n'}</span>
              <span className="text-white">{'vyzora.'}</span>
              <span className="text-yellow-300">{'track'}</span>
              <span className="text-gray-400">{'('}</span>
              <span className="text-amber-300">{`'upgrade_clicked'`}</span>
              <span className="text-gray-400">{', { plan: '}</span>
              <span className="text-amber-300">{`'pro'`}</span>
              <span className="text-gray-400">{'});'}</span>
            </pre>
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURES ────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for production.
            <span className="gradient-text"> Designed for clarity.</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            No feature flags behind paywalls. No data sold to advertisers. Just a clean
            analytics stack that does exactly what it says.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-white/[0.07] bg-[#0a0f1e] p-6 overflow-hidden hover:border-white/[0.13] transition-all duration-300"
            >
              {/* Gradient bleed */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${f.iconBg} ${f.iconColor}`}>
                    {f.icon}
                  </div>
                  <span className="text-xs font-mono text-gray-700">{f.num}</span>
                </div>

                {/* Title + desc */}
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{f.description}</p>

                {/* Bullets */}
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${f.dotColor} shrink-0 opacity-80`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── ARCHITECTURE ────────────────────────── */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            SDK → API → Database → Dashboard
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            Every layer is built for privacy and performance. You get real-world insights
            without ever compromising your users&apos; data or project security.
            Nothing is sampled. Nothing is sent to a third party.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {archSteps.map((s, i) => (
            <div key={s.step} className="flex flex-col md:flex-row flex-1">
              <div className={`flex-1 rounded-2xl border bg-gradient-to-b ${s.accent} p-8 flex flex-col gap-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs font-mono text-gray-600">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-indigo-400/70 mt-0.5 font-medium">{s.sub}</p>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
              {i < archSteps.length - 1 && (
                <div className="flex items-center justify-center my-3 md:my-0 md:mx-3">
                  <span className="text-gray-700 text-xl rotate-90 md:rotate-0">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── TECH STACK ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl border border-white/[0.06] bg-[#090e1a] p-10">
          <div className="text-center mb-10">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Tech stack
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Boring stack. Predictable behavior.
            </h2>
            <p className="mt-3 text-gray-500 text-[14px] max-w-md mx-auto leading-relaxed">
              No custom runtimes or novel abstractions. Every component is a standard tool
              you already know how to operate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stack.map(({ label, detail }) => (
              <div
                key={label}
                className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors duration-200"
              >
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FINAL CTA ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl border border-indigo-500/15 bg-[#060a16] overflow-hidden">
          {/* Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-indigo-600/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-[10%] w-[300px] h-[200px] bg-purple-600/10 blur-[70px] rounded-full" />

          <div className="relative text-center px-8 py-20">
            <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-5">
              Get started
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
              Your data.{' '}
              <span className="gradient-text">Your server.</span>
            </h2>
            <p className="text-gray-500 text-[16px] max-w-md mx-auto mb-3 leading-relaxed">
              Log in with GitHub, create a project, and initialize the SDK.
              Events start landing in your dashboard in under five minutes.
            </p>
            <p className="text-gray-600 text-xs mb-10">
              No credit card. No data sharing. Enterprise-grade uptime and security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/login"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/20 hover:-translate-y-px"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d={GH_PATH} />
                </svg>
                Continue with GitHub
              </a>
              <a
                href="/docs"
                className="px-8 py-3.5 rounded-xl border border-white/[0.1] text-gray-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:bg-white/[0.05] hover:-translate-y-px"
              >
                Read the docs
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
