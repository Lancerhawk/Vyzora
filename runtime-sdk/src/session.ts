import { safeGet, safeSet, safeRemove, generateUUID } from './storage';

const SESSION_KEY = 'vyzora_sid';
const SESSION_TS_KEY = 'vyzora_session_ts';
const INACTIVITY_MS = 30 * 60 * 1000;


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
