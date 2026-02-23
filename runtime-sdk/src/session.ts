import { safeGet, safeSet, safeRemove } from './storage';

const SESSION_KEY = 'vyzora_sid';
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

export function getSessionId(): string {
    const lastTsRaw = safeGet(SESSION_TS_KEY);
    const lastTs = lastTsRaw !== null ? parseInt(lastTsRaw, 10) : 0;
    const now = Date.now();
    const expired = now - lastTs > INACTIVITY_MS;

    let id = safeGet(SESSION_KEY);
    if (!id || expired) {
        id = generateUUID();
        safeSet(SESSION_KEY, id);
    }

    // Always update timestamp on every call to prevent mid-activity expiry
    safeSet(SESSION_TS_KEY, String(now));

    return id;
}

export function resetSession(): void {
    safeRemove(SESSION_KEY);
    safeRemove(SESSION_TS_KEY);
}
