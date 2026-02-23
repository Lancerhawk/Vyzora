const SESSION_KEY = 'vyzora_session_id';
const SESSION_TS_KEY = 'vyzora_session_ts';
const INACTIVITY_MS = 30 * 60 * 1000;

function generateUUID(): string {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function now(): number {
    return Date.now();
}

export function getSessionId(): string {
    try {
        const lastTs = parseInt(sessionStorage.getItem(SESSION_TS_KEY) ?? '0', 10);
        const expired = now() - lastTs > INACTIVITY_MS;

        let id = sessionStorage.getItem(SESSION_KEY);
        if (!id || expired) {
            id = generateUUID();
            sessionStorage.setItem(SESSION_KEY, id);
        }

        sessionStorage.setItem(SESSION_TS_KEY, String(now()));
        return id;
    } catch {
        return generateUUID();
    }
}

export function resetSession(): void {
    try {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_TS_KEY);
    } catch {
        // ignore
    }
}
