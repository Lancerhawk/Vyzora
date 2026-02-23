'use client';

import { useState } from 'react';
import { Panel } from './Panel';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';

interface TimePoint { date: string; events: number; visitors: number; sessions: number; }

type Metric = 'events' | 'visitors' | 'sessions';

const METRIC_CONFIG: Record<Metric, { label: string; color: string; gradient: [string, string] }> = {
    events: { label: 'Events', color: '#6366f1', gradient: ['#6366f1', '#818cf8'] },
    visitors: { label: 'Visitors', color: '#8b5cf6', gradient: ['#8b5cf6', '#a78bfa'] },
    sessions: { label: 'Sessions', color: '#06b6d4', gradient: ['#06b6d4', '#22d3ee'] },
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: Metric; name: string; color: string; }>;
    label?: string;
    metric?: Metric;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(13,23,40,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '10px 14px',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
        }}>
            <p style={{ color: '#6b7280', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {label}
            </p>
            <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {(payload[0]?.value ?? 0).toLocaleString()}
            </p>
        </div>
    );
}

interface CustomCursorProps {
    x?: number;
    y?: number;
    height?: number;
}

// ─── Custom cursor ─────────────────────────────────────────────────────────────
function CustomCursor({ x, y, height }: CustomCursorProps) {
    if (x === undefined || y === undefined) return null;
    return (
        <line
            x1={x} y1={y}
            x2={x} y2={(y) + (height ?? 0)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
        />
    );
}

// ─── Metric pill ──────────────────────────────────────────────────────────────
function Pill({ label, value, color, active, onClick }: {
    label: string; value: number; color: string; active: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '10px 14px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.05)',
                background: active ? `${color}12` : 'transparent',
                outline: 'none',
            }}
        >
            <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: active ? color : '#6b7280', marginBottom: 4 }}>
                {label}
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, color: active ? '#fff' : '#4b5563', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {value.toLocaleString()}
            </span>
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TimeSeriesChart({ data, loading }: { data: TimePoint[]; loading: boolean }) {
    const [metric, setMetric] = useState<Metric>('events');
    const cfg = METRIC_CONFIG[metric];

    const totals = data.reduce(
        (acc, d) => ({ events: acc.events + d.events, visitors: acc.visitors + d.visitors, sessions: acc.sessions + d.sessions }),
        { events: 0, visitors: 0, sessions: 0 }
    );

    return (
        <Panel
            title="Activity Over Time"
            subtitle="Click a metric to switch the chart view"
            loading={loading}
            empty={data.length === 0}
        >
            <div className="flex-1 flex flex-col justify-center">
                {/* Metric selector pills */}
                <div style={{ display: 'flex', gap: 8, padding: '4px 20px 16px' }}>
                    {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => (
                        <Pill
                            key={m}
                            label={METRIC_CONFIG[m].label}
                            value={totals[m]}
                            color={METRIC_CONFIG[m].color}
                            active={metric === m}
                            onClick={() => setMetric(m)}
                        />
                    ))}
                </div>

                {/* Chart */}
                <div style={{ padding: '0 12px 16px' }}>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart
                            data={data}
                            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                            style={{ outline: 'none' }}
                        >
                            <defs>
                                <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={cfg.color} stopOpacity={0.35} />
                                    <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                horizontal vertical={false}
                                stroke="rgba(255,255,255,0.03)"
                                strokeDasharray="0"
                            />

                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#374151', fontSize: 10, fontWeight: 500 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                                interval={Math.max(0, Math.ceil(data.length / 6) - 1)}
                            />
                            <YAxis
                                tick={{ fill: '#374151', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                                domain={[0, 'auto']}
                                tickCount={4}
                                width={28}
                            />

                            <Tooltip
                                content={<CustomTooltip metric={metric} />}
                                cursor={<CustomCursor />}
                                animationDuration={80}
                            />

                            <Area
                                key={metric}
                                type="monotone"
                                dataKey={metric}
                                stroke={cfg.color}
                                strokeWidth={2}
                                fill={`url(#grad-${metric})`}
                                dot={false}
                                isAnimationActive={true}
                                animationDuration={400}
                                animationEasing="ease-out"
                                activeDot={{ r: 4, fill: cfg.color, stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Panel>
    );
}
