export interface IngestEvent {
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
}

export interface IngestJobData {
    projectId: string;
    events: IngestEvent[];
}
