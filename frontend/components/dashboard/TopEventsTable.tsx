'use client';

import { Panel } from './Panel';

interface TopEvent { eventType: string; count: number; }

const EVENT_COLORS: Record<string, string> = {
    pageview: 'bg-indigo-500/15 text-indigo-400',
    click: 'bg-sky-500/15 text-sky-400',
    form_submit: 'bg-emerald-500/15 text-emerald-400',
    signup: 'bg-violet-500/15 text-violet-400',
    login: 'bg-amber-500/15 text-amber-400',
    button_click: 'bg-pink-500/15 text-pink-400',
    tab_switch: 'bg-cyan-500/15 text-cyan-400',
    modal_open: 'bg-rose-500/15 text-rose-400',
};
const FALLBACK = 'bg-gray-500/15 text-gray-400';

export function TopEventsTable({ data, loading }: { data: TopEvent[]; loading: boolean }) {
    const max = data[0]?.count ?? 1;

    return (
        <Panel
            title="Top Events"
            subtitle="Most fired event types in this period"
            loading={loading}
            empty={data.length === 0}
        >
            <div>
                {data.map((event, i) => {
                    const pct = Math.round((event.count / max) * 100);
                    const colorClass = EVENT_COLORS[event.eventType] ?? FALLBACK;
                    return (
                        <div key={i}
                            className="group flex items-center gap-4 px-6 py-3 hover:bg-white/[0.03] transition-colors duration-150">
                            <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap ${colorClass}`}>
                                {event.eventType.replace(/_/g, '\u00a0')}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="h-[2px] w-full bg-white/[0.05] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-[13px] font-bold text-white tabular-nums shrink-0 w-12 text-right">
                                {event.count.toLocaleString()}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
