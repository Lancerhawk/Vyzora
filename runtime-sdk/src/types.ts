
export interface VyzoraConfig {
    apiKey: string;
    endpoint?: string;
    enabled?: boolean;
    debug?: boolean;
    batchSize?: number;
    flushInterval?: number;
}


export interface AutoMetadata {
    browser?: string;
    browserVersion?: string;
    os?: string;
    deviceType?: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    screenWidth?: number;
    screenHeight?: number;
    language?: string;
    referrer?: string;
    timezone?: string;
    [key: string]: unknown | undefined;
}


export interface InternalEvent {
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    metadata?: Record<string, unknown>;
}


export interface IngestEvent {
    sessionId: string;
    visitorId: string;
    eventType: string;
    path: string;
    metadata?: Record<string, unknown>;
}

export interface IngestPayload {
    apiKey: string;
    events: IngestEvent[];
}
