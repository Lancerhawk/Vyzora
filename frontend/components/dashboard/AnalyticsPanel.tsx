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
interface Metrics { totalEvents: number; uniqueVisitors: number; totalSessions: number; pageviews: number; }

export interface SparkData {
    pageviews: number[];
    visitors: number[];
    sessions: number[];
    events: number[];
}

type Range = '7d' | '30d' | '90d';

function fmtDate(iso: string) {
    const d = new Date(iso.includes('T') ? iso : `${iso}T00:00:00Z`);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
    });
}

export function AnalyticsPanel({
    projectId,
    range,
    onSparkData,
    onMetrics,
    onLoadingChange,
}: {
    projectId: string;
    range: Range;
    onSparkData?: (data: SparkData) => void;
    onMetrics?: (metrics: Metrics | null) => void;
    onLoadingChange?: (loading: boolean) => void;
}) {
    const [timeSeries, setTimeSeries] = useState<TimePoint[]>([]);
    const [topPages, setTopPages] = useState<TopPage[]>([]);
    const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
    const [sessions, setSessions] = useState<SessionRow[]>([]);
    const [browsers, setBrowsers] = useState<BrowserRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const setLoad = (v: boolean) => {
            setLoading(v);
            onLoadingChange?.(v);
        };

        setLoad(true);
        onMetrics?.(null);

        // P5: Send the browser's IANA timezone so the backend can align daily buckets correctly.
        const tz = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC');
        const q = `range=${range}&tz=${tz}`;
        const base = `/api/projects/${projectId}`;

        // P4: Single batched request instead of 5 parallel calls.
        api.get<{
            data: {
                metrics: Metrics;
                timeSeries: TimePoint[];
                topPages: TopPage[];
                topEvents: TopEvent[];
                sessions: SessionRow[];
                browsers: BrowserRow[];
            };
        }>(`${base}/analytics?${q}`)
            .then(({ data: res }) => {
                if (cancelled) return;

                const { metrics, timeSeries: ts, topPages: tp, topEvents: te, sessions: se, browsers: br } = res.data;

                const mapped = ts.map(d => ({ ...d, date: fmtDate(String(d.date)) }));
                setTimeSeries(mapped);
                setTopPages(tp);
                setTopEvents(te);
                setSessions(se);
                setBrowsers(br);

                // Lift metrics up to the parent for StatCard totals
                onMetrics?.(metrics);

                // Lift sparkline arrays up for stat card mini-charts
                if (onSparkData) {
                    onSparkData({
                        pageviews: mapped.map(d => d.visitors),
                        visitors: mapped.map(d => d.visitors),
                        sessions: mapped.map(d => d.sessions),
                        events: mapped.map(d => d.events),
                    });
                }
            })
            .catch(() => {
                if (cancelled) return;
                setTimeSeries([]); setTopPages([]);
                setTopEvents([]); setSessions([]); setBrowsers([]);
                onMetrics?.(null);
            })
            .finally(() => {
                if (!cancelled) setLoad(false);
            });

        return () => { cancelled = true; };
    }, [projectId, range, onSparkData, onMetrics, onLoadingChange]);

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
