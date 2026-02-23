'use client';

import { useState } from 'react';
import { Panel } from './Panel';
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip } from 'recharts';

interface BrowserRow { browser: string; count: number; }

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface ActiveSliceProps {
    cx?: number; cy?: number; innerRadius?: number; outerRadius?: number;
    startAngle?: number; endAngle?: number; fill?: string;
}

// Expanded active slice — replaces tooltip overlay
function ActiveSlice(props: ActiveSliceProps) {
    const {
        cx = 0, cy = 0, innerRadius = 0, outerRadius = 0,
        startAngle = 0, endAngle = 0, fill = '#fff'
    } = props;
    return (
        <g>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 7}
                startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 12}
                startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.35} />
        </g>
    );
}

export function BrowserPieChart({ data, loading }: { data: BrowserRow[]; loading: boolean }) {
    const total = data.reduce((s, b) => s + b.count, 0);
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

    return (
        <Panel
            title="Browser Distribution"
            subtitle="Traffic breakdown by client browser"
            loading={loading}
            empty={data.length === 0}
        >
            <div className="flex flex-col lg:flex-row items-center gap-6 px-6 pb-3">
                {/* Donut */}
                <div className="relative shrink-0">
                    <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                            <Tooltip content={() => null} />
                            <Pie
                                data={data}
                                dataKey="count"
                                nameKey="browser"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={84}
                                paddingAngle={3}
                                strokeWidth={0}
                                isAnimationActive={false}
                                activeShape={ActiveSlice}
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(undefined)}
                            >
                                {data.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centre label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        {activeIndex !== undefined ? (
                            <>
                                <span className="text-[11px] font-semibold text-gray-400 truncate max-w-[80px] text-center leading-tight">
                                    {data[activeIndex]?.browser}
                                </span>
                                <span className="text-[16px] font-bold tabular-nums" style={{ color: COLORS[activeIndex % COLORS.length] }}>
                                    {data[activeIndex]?.count.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider">Total</span>
                                <span className="text-[18px] font-bold text-white tabular-nums">{total.toLocaleString()}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Legend rows */}
                <div className="flex-1 w-full space-y-2.5">
                    {data.map((b, i) => {
                        const pct = total > 0 ? Math.round((b.count / total) * 100) : 0;
                        const isActive = activeIndex === i;
                        return (
                            <div key={i}
                                className="cursor-default"
                                onMouseEnter={() => setActiveIndex(i)}
                                onMouseLeave={() => setActiveIndex(undefined)}
                            >
                                <div className={`flex items-center gap-2.5 mb-1.5 transition-opacity duration-150 ${activeIndex !== undefined && !isActive ? 'opacity-40' : 'opacity-100'}`}>
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span className="text-[12px] font-medium text-gray-300 flex-1">{b.browser}</span>
                                    <span className="text-[11px] text-gray-600 tabular-nums">{pct}%</span>
                                    <span className="text-[12px] font-bold text-white tabular-nums w-10 text-right">{b.count.toLocaleString()}</span>
                                </div>
                                <div className="h-[2px] w-full bg-white/[0.04] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${pct}%`,
                                            background: COLORS[i % COLORS.length],
                                            opacity: activeIndex !== undefined && !isActive ? 0.3 : 1,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Panel>
    );
}