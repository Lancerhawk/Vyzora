'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import versions from '../data/versions.json';

type VersionEntry = {
    version: string;
    date: string;
    tag: string;
    title: string;
    summary: string;
    whatsIncluded: { headline: string; detail: string }[];
    stack: string[];
};

const TAG_STYLES: Record<string, string> = {
    feat: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
    fix: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    init: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
    break: 'bg-red-500/15 text-red-300 border border-red-500/25',
};

const ALL = versions as VersionEntry[];

export default function ChangelogButton() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(0);

    if (pathname?.startsWith('/dashboard')) return null;

    const current = ALL[selected];

    return (
        <>
            {/* ── Floating trigger ────────────────────────────────── */}
            <button
                onClick={() => setOpen(true)}
                aria-label="Open changelog"
                className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.1] bg-[#0d1117]/90 backdrop-blur-md text-gray-400 hover:text-white hover:border-indigo-500/40 text-xs font-medium transition-all duration-200 shadow-xl shadow-black/40 group"
            >
                <span className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-pulse" />
                Changelog
                <span className="text-gray-700">·</span>
                <span className="text-gray-600 group-hover:text-indigo-400 font-mono transition-colors duration-200">
                    v{ALL[0]?.version}
                </span>
            </button>

            {/* ── Modal backdrop ──────────────────────────────────── */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    {/* ── Modal panel ─────────────────────────────── */}
                    <div className="relative z-10 w-full max-w-4xl flex flex-col rounded-2xl border border-white/[0.08] bg-[#0c1018] shadow-2xl shadow-black/70 overflow-hidden" style={{ height: 'min(600px, calc(100vh - 2rem))' }}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <Image
                                        src="/logo.png"
                                        alt="Vyzora Logo"
                                        width={40}
                                        height={40}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white leading-none">Vyzora</p>
                                    <p className="text-[11px] text-indigo-400 mt-0.5 font-medium">Version {ALL[0]?.version}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150 text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body: stacks on mobile, two-column on md+ */}
                        <div className="flex flex-col md:flex-row flex-1 min-h-0">
                            {/* Version list — horizontal scroll on mobile, sidebar on md+ */}
                            <div className="md:w-52 md:shrink-0 md:border-r md:border-white/[0.07] md:flex-col md:overflow-y-auto
                                           flex flex-row overflow-x-auto border-b border-white/[0.07] md:border-b-0">
                                <p className="hidden md:flex text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-4 pt-4 pb-3 items-center gap-1.5 shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    Version History
                                </p>
                                {/* Mobile: horizontal pill row */}
                                <div className="flex md:hidden flex-row gap-1.5 px-3 py-2.5 shrink-0">
                                    {ALL.map((v, i) => (
                                        <button
                                            key={v.version}
                                            onClick={() => setSelected(i)}
                                            className={[
                                                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-150 whitespace-nowrap',
                                                selected === i
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.08]',
                                            ].join(' ')}
                                        >
                                            v{v.version}
                                        </button>
                                    ))}
                                </div>
                                {/* Desktop: vertical list */}
                                <div className="hidden md:flex flex-col flex-1 px-2 pb-4 space-y-1">
                                    {ALL.map((v, i) => (
                                        <button
                                            key={v.version}
                                            onClick={() => setSelected(i)}
                                            className={[
                                                'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150',
                                                selected === i
                                                    ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20'
                                                    : 'hover:bg-white/[0.04]',
                                            ].join(' ')}
                                        >
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className={`text-sm font-bold font-mono ${selected === i ? 'text-white' : 'text-gray-300'}`}>
                                                    v{v.version}
                                                </span>
                                                {i === 0 && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${selected === 0 ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                                        CURRENT
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[11px] truncate ${selected === i ? 'text-indigo-100' : 'text-gray-500'}`}>
                                                {v.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right — version detail */}
                            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
                                {/* Title + badge */}
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold text-white">{current.title}</h2>
                                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${TAG_STYLES[current.tag] ?? TAG_STYLES.init}`}>
                                        v{current.version}{selected === 0 ? ' · Current' : ''}
                                    </span>
                                </div>

                                {/* Summary */}
                                <p className="text-sm text-gray-400 leading-relaxed mb-1.5">{current.summary}</p>
                                <p className="text-xs text-gray-600 mb-6">Released: {current.date}</p>

                                {/* What's included */}
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">
                                    What&apos;s Included
                                </p>
                                <div className="space-y-4 mb-8">
                                    {current.whatsIncluded.map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="mt-0.5 w-4 h-4 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                                                <svg className="w-2.5 h-2.5 text-indigo-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white mb-0.5">{item.headline}</p>
                                                <p className="text-[12px] text-gray-500 leading-relaxed">{item.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Technical stack */}
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                                    Technical Stack
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {current.stack.map((s) => (
                                        <span key={s} className="text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-400 font-mono">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
