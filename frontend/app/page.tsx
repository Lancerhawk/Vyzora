import FeatureCard from '../components/FeatureCard';
import ParticleField from '../components/ParticleField';

const features = [
  {
    icon: '⚡',
    title: 'Two-line setup',
    description:
      'Drop in the SDK, call init() with your project key, and events start flowing. No build steps, no config files — works in any JS or TS project.',
  },
  {
    icon: '🔒',
    title: 'Project-scoped API keys',
    description:
      'Each project gets a 64-character cryptographic key. Revoke or rotate it anytime from the dashboard. Invalid keys are rejected before touching the database.',
  },
  {
    icon: '🧭',
    title: 'Full session reconstruction',
    description:
      'Session and visitor IDs are tracked automatically so you can replay complete user journeys — not just aggregate page counts.',
  },
  {
    icon: '📊',
    title: 'Aggregated metrics API',
    description:
      'Query page views, unique sessions, top pages, and daily trends over any time range via a single REST endpoint. Filter by 1d, 7d, 30d, or 90d.',
  },
];

const archSteps = [
  {
    step: '01',
    title: 'Instrument',
    sub: 'Vyzora Runtime SDK',
    desc: 'Install @vyzora/sdk or include the CDN script. Call init() once with your project API key — the SDK auto-collects page views and sessions and batches events client-side.',
    icon: '📦',
    accent: 'from-indigo-600/[0.12] to-transparent border-indigo-500/20',
  },
  {
    step: '02',
    title: 'Ingest',
    sub: 'Express + Prisma + PostgreSQL',
    desc: 'Batched events are posted to POST /api/ingest, validated against your API key, and bulk-inserted into PostgreSQL using Prisma. Indexed for fast aggregation.',
    icon: '⚙️',
    accent: 'from-violet-600/[0.12] to-transparent border-violet-500/20',
  },
  {
    step: '03',
    title: 'Analyse',
    sub: 'Dashboard (Next.js)',
    desc: 'Log in with GitHub, open your project, and instantly see page views, session counts, top pages, top events, and daily trends — updated in real time.',
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
            Open-source analytics for developers
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black tracking-[-0.03em] leading-[1.04] text-white mb-6">
            Track events.
            <br />
            <span className="gradient-text">Understand your users.</span>
          </h1>

          {/* Sub */}
          <p className="max-w-[560px] mx-auto text-[17px] text-gray-400 leading-[1.65] mb-10">
            Vyzora gives you a lightweight SDK to track events and sessions,
            a validated ingestion API, and a dashboard to query the metrics
            that actually matter — without the enterprise price tag.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/login"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/35 hover:-translate-y-px"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
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
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
            {[
              { value: '2 lines', label: 'To instrument your app' },
              { value: '10×', label: 'Fewer HTTP requests via batching' },
              { value: '100%', label: 'Open source, self-hostable' },
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

      {/* ─────────────── FEATURES ────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything you need.
            <span className="gradient-text"> Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-md mx-auto text-[15px]">
            No bloated dashboards-as-a-service. Just a clean SDK, strict validation, fast Postgres writes, and the metrics that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ─────────────── ARCHITECTURE ────────────────────────── */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold tracking-widest uppercase mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Three layers. One pipeline.
          </h2>
          <p className="mt-4 text-gray-500 max-w-md mx-auto text-[15px]">
            SDK → API → Dashboard. Every byte flows through readable, open-source code you control.
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
                  <p className="text-xs text-gray-600 mt-0.5">{s.sub}</p>
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

      {/* ─────────────── FINAL CTA ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="relative rounded-3xl border border-indigo-500/15 bg-[#060a16] overflow-hidden">
          {/* Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[220px] bg-indigo-600/10 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-[10%] w-[300px] h-[200px] bg-purple-600/10 blur-[70px] rounded-full" />

          <div className="relative text-center px-8 py-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
              Your first events in{' '}
              <span className="gradient-text">under 5 minutes</span>
            </h2>
            <p className="text-gray-500 text-[16px] max-w-md mx-auto mb-10">
              Create a project, grab your API key, add two lines of SDK code.
              Events start landing in your dashboard immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/login"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-xl shadow-indigo-600/20 hover:-translate-y-px"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Create your account
              </a>
              <a
                href="/docs"
                className="px-8 py-3.5 rounded-xl border border-white/[0.1] text-gray-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:bg-white/[0.05] hover:-translate-y-px"
              >
                Browse the docs
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
