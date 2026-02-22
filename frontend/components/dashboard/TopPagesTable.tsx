'use client';

import { Panel } from './Panel';

interface TopPage { path: string; views: number; }

export function TopPagesTable({ data, loading }: { data: TopPage[]; loading: boolean }) {
    const total = data.reduce((s, p) => s + p.views, 0);

    return (
        <Panel
            title="Top Pages"
            subtitle="Most viewed paths in this period"
            loading={loading}
            empty={data.length === 0}
        >
            <div>
                {data.map((page, i) => {
                    const pct = total > 0 ? Math.round((page.views / total) * 100) : 0;
                    return (
                        <div key={i}
                            className="group flex items-center gap-4 px-6 py-3 hover:bg-white/[0.03] transition-colors duration-150">
                            <span className="w-5 text-[11px] font-bold text-gray-700 tabular-nums shrink-0">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <span className="block text-[13px] font-medium text-gray-300 truncate font-mono">{page.path}</span>
                                <div className="mt-1.5 h-[2px] w-full bg-white/[0.05] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-[11px] text-gray-600 tabular-nums">{pct}%</span>
                                <span className="text-[13px] font-bold text-white tabular-nums w-10 text-right">
                                    {page.views.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
}
