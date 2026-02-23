'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// ─── Sparkline ────────────────────────────────────────────────────────────────
function SparkLine({ data, color }: { data: number[]; color: string }) {
    const points = data.map((v, i) => ({ v, i }));
    return (
        <ResponsiveContainer width="100%" height={40}>
            <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#spark-${color.replace('#', '')})`}
                    dot={false}
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// ─── Shared Panel wrapper ─────────────────────────────────────────────────────
export function Panel({
    title,
    subtitle,
    loading,
    empty,
    children,
}: {
    title: string;
    subtitle?: string;
    loading: boolean;
    empty: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#080f1d] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.05]">
                <div>
                    <h2 className="text-[13px] font-semibold text-white">{title}</h2>
                    {subtitle && <p className="text-[11px] text-gray-600 mt-0.5">{subtitle}</p>}
                </div>
            </div>

            {/* Body */}
            <div className="py-3 flex-1">
                {loading ? (
                    <div className="space-y-2.5 px-6 py-3">
                        {[100, 85, 70, 55].map((w, i) => (
                            <div key={i} className="h-7 bg-white/[0.03] rounded-md animate-pulse" style={{ width: `${w}%` }} />
                        ))}
                    </div>
                ) : empty ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
                            </svg>
                        </div>
                        <p className="text-[12px] text-gray-600 font-medium">No data for this period</p>
                    </div>
                ) : children}
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({
    label, value, loading, icon, sparkData, sparkColor,
}: {
    label: string;
    value: number | undefined;
    loading: boolean;
    icon?: React.ReactNode;
    sparkData?: number[];
    sparkColor?: string;
}) {
    return (
        <div className="bg-[#080f1d] border border-white/[0.06] rounded-xl p-5 flex flex-col gap-3 hover:border-indigo-500/20 hover:bg-[#0a1426] transition-all duration-300 group">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
                {icon && (
                    <span className="text-gray-700 group-hover:text-indigo-500/60 transition-colors">{icon}</span>
                )}
            </div>
            {loading ? (
                <div className="h-8 w-20 bg-white/[0.04] rounded-lg animate-pulse" />
            ) : (
                <p className="text-[2rem] font-bold text-white leading-none tabular-nums tracking-tighter">
                    {(value ?? 0).toLocaleString()}
                </p>
            )}
            {/* Sparkline */}
            {!loading && sparkData && sparkData.length > 1 && (
                <div className="-mx-1 mt-1">
                    <SparkLine data={sparkData} color={sparkColor ?? '#6366f1'} />
                </div>
            )}
        </div>
    );
}
