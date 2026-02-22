import { getSessionId } from './session';
import { enqueue } from './batch';

export interface VyzoraEvent {
    type: string;
    url: string;
    sessionId: string;
    timestamp: string;
    properties?: Record<string, unknown>;
}

export interface TrackOptions {
    properties?: Record<string, unknown>;
}

export function track(eventType: string, options: TrackOptions = {}): void {
    if (typeof window === 'undefined') return;

    const event: VyzoraEvent = {
        type: eventType,
        url: window.location.href,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        properties: options.properties,
    };

    enqueue(event);
}

export function trackPageView(url?: string): void {
    track('page_view', {
        properties: {
            url: url || (typeof window !== 'undefined' ? window.location.href : ''),
            referrer: typeof document !== 'undefined' ? document.referrer : '',
        },
    });
}
