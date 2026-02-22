'use client';

import { useState } from 'react';
import { Panel } from './Panel';

interface SessionRow { sessionId: string; startTime: string; endTime: string; eventCount: number; }

const PAGE_SIZE = 10;

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
        hour12: false,
    });
}

function fmtDuration(start: string, end: string) {
    const s = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60), sec = s % 60;
    return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
}

export function SessionExplorer({ data, loading }: { data: SessionRow[]; loading: boolean }) {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const rows = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    return (
        <Panel
            title="Session Explorer"
            subtitle={`${data.length} sessions total, newest first`}
            loading={loading}
            empty={data.length === 0}
        >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-6 pb-2 border-b border-white/[0.04]">
                <span>Session ID</span>
                <span className="w-36 text-left pl-4">Started</span>
                <span className="w-24 text-left pl-4">Duration</span>
                <span className="w-16 text-right">Events</span>
            </div>

            {/* Rows */}
            <div>
                {rows.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center px-6 py-3 hover:bg-white/[0.03] transition-colors duration-150 border-b border-white/[0.025] last:border-0">
                        <span className="font-mono text-[11px] text-gray-500 bg-white/[0.04] px-2 py-0.5 rounded w-fit">
                            {s.sessionId.slice(0, 14)}&hellip;
                        </span>
                        <span className="w-36 pl-4 text-[12px] text-gray-400">{fmtDateTime(s.startTime)}</span>
                        <span className="w-24 pl-4 text-[12px] font-medium text-sky-400">{fmtDuration(s.startTime, s.endTime)}</span>
                        <span className="w-16 text-right text-[13px] font-bold text-white tabular-nums">{s.eventCount}</span>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-white/[0.04]">
                    <span className="text-[11px] text-gray-600">
                        Page {page + 1} of {totalPages} &mdash; {data.length} sessions
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage(0)}
                            disabled={page === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs"
                            title="First page"
                        >«</button>
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs"
                            title="Previous"
                        >‹</button>

                        {/* Page number pills */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-7 h-7 flex items-center justify-center rounded-md text-[11px] font-semibold transition-all ${p === page
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-600 hover:text-white hover:bg-white/[0.06]'
                                        }`}
                                >{p + 1}</button>
                            );
                        })}

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs"
                            title="Next"
                        >›</button>
                        <button
                            onClick={() => setPage(totalPages - 1)}
                            disabled={page >= totalPages - 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-600 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs"
                            title="Last page"
                        >»</button>
                    </div>
                </div>
            )}
        </Panel>
    );
}
