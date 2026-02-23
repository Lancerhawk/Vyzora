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

export interface SparkData {
    pageviews: number[];
    visitors: number[];
    sessions: number[];
    events: number[];
}

type Range = '7d' | '30d' | '90d';

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AnalyticsPanel({
    projectId,
    range,
    onSparkData,
}: {
    projectId: string;
    range: Range;
    onSparkData?: (data: SparkData) => void;
}) {
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
            const mapped = ts.data.data.map(d => ({ ...d, date: fmtDate(String(d.date)) }));
            setTimeSeries(mapped);
            setTopPages(tp.data.data);
            setTopEvents(te.data.data);
            setSessions(se.data.data);
            setBrowsers(br.data.data);

            // Lift sparkline arrays up to parent for stat cards
            if (onSparkData) {
                onSparkData({
                    pageviews: mapped.map(d => d.visitors), // pageviews = visitors tracking
                    visitors: mapped.map(d => d.visitors),
                    sessions: mapped.map(d => d.sessions),
                    events: mapped.map(d => d.events),
                });
            }
        }).catch(() => {
            if (!cancelled) {
                setTimeSeries([]); setTopPages([]);
                setTopEvents([]); setSessions([]); setBrowsers([]);
            }
        }).finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [projectId, range, onSparkData]);

    return (
        <div className="space-y-6">
            {/* Row 1: Activity chart (60%) + Browser distribution (40%) */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-stretch">
                <div className="xl:col-span-3">
                    <TimeSeriesChart data={timeSeries} loading={loading} />
                </div>
                <div className="xl:col-span-2">
                    <BrowserPieChart data={browsers} loading={loading} />
                </div>
            </div>

            {/* Row 2: Top Pages + Top Events side-by-side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                <div className="h-full">
                    <TopPagesTable data={topPages} loading={loading} />
                </div>
                <div className="h-full">
                    <TopEventsTable data={topEvents} loading={loading} />
                </div>
            </div>

            {/* Row 3: Session Explorer */}
            <SessionExplorer data={sessions} loading={loading} />
        </div>
    );
}
