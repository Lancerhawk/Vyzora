'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { StatCard } from '../../components/dashboard/Panel';
import { AnalyticsPanel, SparkData } from '../../components/dashboard/AnalyticsPanel';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project { id: string; name: string; apiKey: string; createdAt: string; }
interface Metrics { totalEvents: number; uniqueVisitors: number; totalSessions: number; pageviews: number; }
type MetricsRange = '7d' | '30d' | '90d';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPageview = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconVisitor = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const IconSession = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>;
const IconEvent = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;

// ─── Modals ───────────────────────────────────────────────────────────────────
function CreateModal({ show, onClose, onCreate }: {
    show: boolean; onClose: () => void; onCreate: (name: string) => Promise<string | null>;
}) {
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (show) { setName(''); setError(''); setTimeout(() => inputRef.current?.focus(), 80); }
    }, [show]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setCreating(true); setError('');
        const err = await onCreate(name.trim());
        if (err) setError(err);
        setCreating(false);
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm px-0 sm:px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="w-full sm:max-w-md bg-[#0b1220] border border-white/[0.08] rounded-t-xl sm:rounded-xl shadow-2xl shadow-black/70">
                <div className="border-b border-white/[0.07] px-7 py-5">
                    <h2 className="text-base font-semibold text-white">Create project</h2>
                    <p className="text-[13px] text-gray-500 mt-1">Projects are linked to a unique API key for data ingestion.</p>
                </div>
                <div className="px-7 py-6 space-y-4">
                    <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Project name</label>
                        <input
                            ref={inputRef} type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !creating && handleSubmit()}
                            placeholder="My Application" maxLength={100}
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 focus:border-indigo-500/60 transition-all font-medium"
                        />
                    </div>
                    {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">{error}</p>}
                </div>
                <div className="border-t border-white/[0.07] px-7 py-4 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-[13px] font-medium text-gray-500 border border-white/[0.08] rounded-lg hover:bg-white/[0.03] hover:text-gray-300 transition-all">Cancel</button>
                    <button onClick={handleSubmit} disabled={creating || !name.trim()} className="flex-1 py-3 text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-40 disabled:pointer-events-none transition-all">
                        {creating ? 'Creating…' : 'Create project'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ApiKeyModal({ apiKey, onDone }: { apiKey: string; onDone: () => void }) {
    const [copied, setCopied] = useState(false);
    const copy = () => { navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(() => setCopied(false), 2500); };
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4">
            <div className="w-full max-w-[500px] bg-[#0b1220] border border-white/[0.09] rounded-xl shadow-2xl">
                <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-t-xl" />
                <div className="p-9">
                    <div className="flex items-start gap-5 mb-8">
                        <div className="w-11 h-11 bg-indigo-600/10 border border-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-[17px] font-semibold text-white leading-tight mb-1">Your API key is ready</h2>
                            <p className="text-[13px] text-gray-500">Copy and store it somewhere safe. This key will not be shown again.</p>
                        </div>
                    </div>
                    <div className="bg-[#060c18] border border-white/[0.07] rounded-lg px-6 py-5 mb-4">
                        <p className="font-mono text-[13px] text-gray-200 break-all leading-loose select-all">{apiKey}</p>
                    </div>
                    <button onClick={copy} className={`w-full flex items-center justify-center gap-2 py-3 text-[13px] font-semibold border rounded-lg transition-all mb-6 ${copied ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-gray-400 border-white/[0.08] hover:text-white hover:bg-white/[0.04]'}`}>
                        {copied ? <>✓ Copied to clipboard</> : <>Copy API key</>}
                    </button>
                    <p className="text-[12px] text-amber-600/80 mb-8">⚠ Store this in your environment variables — never commit it to source control.</p>
                    <button onClick={onDone} className="w-full py-3.5 text-[13px] font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:text-white hover:bg-white/[0.07] transition-all">
                        Done, I&apos;ve saved my key
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user, loading, refetch } = useAuth();
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [selected, setSelected] = useState<Project | null>(null);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [range, setRange] = useState<MetricsRange>('7d');
    const [metricsLoading, setMetricsLoading] = useState(false);
    const [projectsLoad, setProjectsLoad] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [newApiKey, setNewApiKey] = useState('');
    const [idCopied, setIdCopied] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sparkData, setSparkData] = useState<SparkData | null>(null);

    useEffect(() => { if (!loading && !user) router.replace('/login'); }, [user, loading, router]);

    const sidebarRef = useRef<HTMLElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) setSidebarOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [sidebarOpen]);

    const fetchProjects = useCallback(async () => {
        try {
            setProjectsLoad(true);
            const res = await api.get<{ projects: Project[] }>('/api/projects');
            setProjects(res.data.projects);
        } catch { /* silent */ } finally { setProjectsLoad(false); }
    }, []);

    useEffect(() => { if (user) fetchProjects(); }, [user, fetchProjects]);

    const fetchMetrics = useCallback(async (id: string, r: MetricsRange) => {
        setMetricsLoading(true); setMetrics(null);
        try {
            const res = await api.get<{ metrics: Metrics }>(`/api/projects/${id}/metrics?range=${r}`);
            setMetrics(res.data.metrics);
        } catch { setMetrics(null); } finally { setMetricsLoading(false); }
    }, []);

    useEffect(() => { if (selected) fetchMetrics(selected.id, range); }, [selected, range, fetchMetrics]);

    const selectProject = (p: Project) => { setSelected(p); setSidebarOpen(false); };

    const handleCreate = async (name: string): Promise<string | null> => {
        try {
            const res = await api.post<{ project: Project }>('/api/projects', { name });
            await fetchProjects();
            setNewApiKey(res.data.project.apiKey);
            setShowCreate(false); setShowKey(true);
            return null;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) return err.response?.data?.message ?? 'Failed to create project.';
            return 'An unexpected error occurred.';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this project?')) return;
        try {
            await api.delete(`/api/projects/${id}`);
            if (selected?.id === id) { setSelected(null); setMetrics(null); }
            await fetchProjects();
        } catch { /* silent */ }
    };

    const handleLogout = async () => {
        try { await api.post('/api/auth/logout'); } finally { await refetch(); router.push('/'); }
    };

    if (loading) return (
        <div className="fixed inset-0 bg-[#040812] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email.slice(0, 2).toUpperCase();

    // ── Sidebar ──────────────────────────────────────────────────────────────
    const SidebarContent = () => (
        <>
            <div className="h-16 flex items-center justify-center border-b border-white/[0.06] shrink-0 px-5">
                <Link href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <Image src="/logo.png" alt="Vyzora" width={28} height={28} className="object-contain" />
                    <span className="text-[15px] font-bold text-white tracking-[-0.02em]">Vyzora</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-hide">
                <div className="flex items-center justify-between px-3 mb-3">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Projects</span>
                    <button onClick={() => setShowCreate(true)} title="New project"
                        className="w-6 h-6 flex items-center justify-center rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 cursor-pointer transition-all text-base leading-none">+</button>
                </div>

                {projectsLoad ? (
                    <div className="space-y-1.5 px-1 mt-2">
                        {[1, 2, 3].map(i => <div key={i} className="h-9 bg-white/[0.03] rounded-md animate-pulse" />)}
                    </div>
                ) : projects.length === 0 ? (
                    <button onClick={() => { setShowCreate(true); setSidebarOpen(false); }}
                        className="w-full mt-2 py-5 border border-dashed border-white/[0.07] rounded-md text-[11px] text-gray-600 hover:text-gray-400 hover:border-white/[0.12] transition-all">
                        No projects yet
                    </button>
                ) : (
                    <ul className="space-y-0.5">
                        {projects.map(p => (
                            <li key={p.id}>
                                <div className={`group flex items-center px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 ${selected?.id === p.id ? 'bg-indigo-500/10 border border-indigo-500/20' : 'border border-transparent hover:bg-white/[0.05]'}`}>
                                    <button onClick={() => selectProject(p)} className="flex-1 flex items-center gap-2.5 text-left min-w-0 cursor-pointer">
                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selected?.id === p.id ? 'bg-indigo-400' : 'bg-gray-600 group-hover:bg-gray-400'}`} />
                                        <span className={`text-[13px] truncate font-medium ${selected?.id === p.id ? 'text-indigo-200' : 'text-gray-400 group-hover:text-gray-200'}`}>{p.name}</span>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 cursor-pointer transition-all ml-1 p-0.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="border-t border-white/[0.06] p-3 shrink-0">
                <div className="flex items-center gap-3 px-2 py-2 mb-1.5">
                    {user.githubId ? (
                        <Image src={`https://avatars.githubusercontent.com/u/${user.githubId}?v=4&s=64`}
                            alt={user.name || 'avatar'} width={32} height={32}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-white/10" />
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">{initials}</div>
                    )}
                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-gray-200 truncate">{user.name || 'Account'}</p>
                        <p className="text-[10px] text-gray-600 truncate mt-0.5">{user.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[12px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-400/[0.06] cursor-pointer transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                </button>
            </div>
        </>
    );

    // ── Main layout ───────────────────────────────────────────────────────────
    return (
        <div className="flex min-h-screen bg-[#040812]">
            {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-56 shrink-0 bg-[#060a12] border-r border-white/[0.06] flex-col fixed top-0 left-0 bottom-0 z-40">
                <SidebarContent />
            </aside>

            {/* Mobile drawer */}
            <aside ref={sidebarRef} className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#060a12] border-r border-white/[0.06] flex-col flex lg:hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            <main className="flex-1 lg:ml-56 min-h-screen">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center gap-4 px-5 h-14 border-b border-white/[0.06] bg-[#060a12] sticky top-0 z-20">
                    <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Vyzora" width={24} height={24} className="object-contain" />
                        <span className="text-[14px] font-bold text-white">Vyzora</span>
                    </Link>
                    {selected && <span className="ml-auto text-[12px] text-gray-500 truncate max-w-[120px]">{selected.name}</span>}
                </div>

                {selected ? (
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 py-8 lg:py-10">

                        {/* Two-column: main content + right stats panel */}
                        <div className="flex flex-col xl:flex-row gap-6">

                            {/* ── LEFT: Header + Charts ── */}
                            <div className="flex-1 min-w-0">

                                {/* Page header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h1 className="text-[20px] font-bold text-white tracking-tight">{selected.name}</h1>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
                                            </div>
                                        </div>
                                        <p className="text-[13px] text-gray-600">Since {new Date(selected.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>

                                    {/* Range selector */}
                                    <div className="flex items-center bg-white/[0.03] border border-white/[0.07] rounded-lg overflow-hidden self-start">
                                        {(['7d', '30d', '90d'] as MetricsRange[]).map((r) => (
                                            <button key={r} onClick={() => setRange(r)}
                                                className={`px-5 py-2.5 text-xs font-semibold transition-all duration-200 border-r border-white/[0.07] last:border-r-0 ${range === r ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]'}`}>
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Charts */}
                                <AnalyticsPanel
                                    key={`${selected.id}-${range}`}
                                    projectId={selected.id}
                                    range={range}
                                    onSparkData={setSparkData}
                                />

                                {/* Credentials */}
                                <div className="mt-6 bg-[#080f1d] border border-white/[0.06] rounded-xl overflow-hidden">
                                    <div className="px-7 py-5 border-b border-white/[0.05]">
                                        <h2 className="text-[13px] font-semibold text-white">Project Credentials</h2>
                                        <p className="text-[11px] text-gray-600 mt-0.5">Use these values in your SDK configuration.</p>
                                    </div>
                                    <div className="divide-y divide-white/[0.04]">
                                        <div className="flex flex-col sm:flex-row sm:items-center px-7 py-5 gap-4">
                                            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider sm:w-24 shrink-0">Project ID</span>
                                            <span className="font-mono text-[12px] sm:text-[13px] text-gray-400 truncate flex-1">{selected.id}</span>
                                            <button onClick={() => { navigator.clipboard.writeText(selected.id); setIdCopied(true); setTimeout(() => setIdCopied(false), 2000); }}
                                                className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 border rounded-lg transition-colors ${idCopied ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : 'text-gray-600 border-white/[0.08] hover:text-white hover:bg-white/[0.04]'}`}>
                                                {idCopied ? '✓ Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center px-7 py-5 gap-4">
                                            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider sm:w-24 shrink-0">API Key</span>
                                            <span className="font-mono text-[13px] text-gray-700 tracking-[0.3em] flex-1">••••••••••••••••••••••••</span>
                                            <span className="text-[11px] font-medium text-amber-600/70 shrink-0">Shown once at creation</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT: Stat cards panel ── */}
                            <div className="xl:w-64 xl:shrink-0">
                                {/* Mobile: 2x2 grid. xl+: vertical stack */}
                                <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
                                    <StatCard
                                        label="Pageviews"
                                        value={metrics?.pageviews}
                                        loading={metricsLoading}
                                        icon={<IconPageview />}
                                        sparkData={sparkData?.pageviews}
                                        sparkColor="#6366f1"
                                    />
                                    <StatCard
                                        label="Unique Visitors"
                                        value={metrics?.uniqueVisitors}
                                        loading={metricsLoading}
                                        icon={<IconVisitor />}
                                        sparkData={sparkData?.visitors}
                                        sparkColor="#8b5cf6"
                                    />
                                    <StatCard
                                        label="Sessions"
                                        value={metrics?.totalSessions}
                                        loading={metricsLoading}
                                        icon={<IconSession />}
                                        sparkData={sparkData?.sessions}
                                        sparkColor="#06b6d4"
                                    />
                                    <StatCard
                                        label="Events"
                                        value={metrics?.totalEvents}
                                        loading={metricsLoading}
                                        icon={<IconEvent />}
                                        sparkData={sparkData?.events}
                                        sparkColor="#10b981"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] lg:min-h-screen text-center p-8">
                        <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2.5 tracking-tight">
                            {projects.length === 0 ? 'Create your first project' : 'Select a project'}
                        </h2>
                        <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed mb-8">
                            {projects.length === 0 ? 'Connect your application to start collecting analytics data.' : 'Choose a project from the sidebar to view its analytics.'}
                        </p>
                        {projects.length === 0 && (
                            <button onClick={() => setShowCreate(true)}
                                className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-lg shadow-indigo-900/30">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                New project
                            </button>
                        )}
                    </div>
                )}
            </main>

            <CreateModal show={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
            {showKey && <ApiKeyModal apiKey={newApiKey} onDone={() => { setShowKey(false); setNewApiKey(''); }} />}
        </div>
    );
}