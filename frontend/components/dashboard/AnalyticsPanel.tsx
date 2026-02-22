'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { TimeSeriesChart } from './TimeSeriesChart';
import { TopPagesTable } from './TopPagesTable';
import { TopEventsTable } from './TopEventsTable';
import { SessionExplorer } from './SessionExplorer';
import { BrowserPieChart } from './BrowserPieChart';

interface TimePoint { date: string; events: number; visitors: number; sessions: number; }
interface TopPage { path: string; views: number; }
interface TopEvent { eventType: string; count: number; }
interface SessionRow { sessionId: string; startTime: string; endTime: string; eventCount: number; }
interface BrowserRow { browser: string; count: number; }

type Range = '7d' | '30d' | '90d';

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AnalyticsPanel({ projectId, range }: { projectId: string; range: Range }) {
    const [timeSeries, setTimeSeries] = useState<TimePoint[]>([]);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
    const [sessions, setSessions] = useState<SessionRow[]>([]);
    const [browsers, setBrowsers] = useState<BrowserRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const q = `range=${range}`;
        const base = `/api/projects/${projectId}`;

        Promise.all([
            api.get<{ data: TimePoint[] }>(`${base}/timeseries?${q}`),
            api.get<{ data: TopPage[] }>(`${base}/top-pages?${q}`),
            api.get<{ data: TopEvent[] }>(`${base}/top-events?${q}`),
            api.get<{ data: SessionRow[] }>(`${base}/sessions?${q}`),
            api.get<{ data: BrowserRow[] }>(`${base}/browsers?${q}`),
        ]).then(([ts, tp, te, se, br]) => {
            if (cancelled) return;
            setTimeSeries(ts.data.data.map(d => ({ ...d, date: fmtDate(String(d.date)) })));
            setTopPages(tp.data.data);
            setTopEvents(te.data.data);
            setSessions(se.data.data);
            setBrowsers(br.data.data);
        }).catch(() => {
            if (!cancelled) {
                setTimeSeries([]); setTopPages([]);
                setTopEvents([]); setSessions([]); setBrowsers([]);
            }
        }).finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [projectId, range]);

    return (
        <div className="space-y-6">
            {/* Time Series — full width */}
            <TimeSeriesChart data={timeSeries} loading={loading} />

            {/* Top Pages + Top Events — side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TopPagesTable data={topPages} loading={loading} />
                <TopEventsTable data={topEvents} loading={loading} />
            </div>

            {/* Session Explorer — full width */}
            <SessionExplorer data={sessions} loading={loading} />

            {/* Browser Distribution — full width */}
            <BrowserPieChart data={browsers} loading={loading} />
        </div>
    );
}
