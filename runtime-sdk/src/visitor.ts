import { safeGet, safeSet } from './storage';

const VISITOR_KEY = 'vyzora_vid';

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

// In-memory fallback: stable for page lifetime if localStorage fails (e.g. Safari private mode)
let fallbackId: string | null = null;

export function getVisitorId(): string {
    const stored = safeGet(VISITOR_KEY);
    if (stored) return stored;

    // Try to persist a new ID
    const id = generateUUID();
    safeSet(VISITOR_KEY, id);

    // Verify it was actually stored
    const verified = safeGet(VISITOR_KEY);
    if (verified) return verified;

    // Storage failed — use stable in-memory fallback
    if (!fallbackId) fallbackId = id;
    return fallbackId;
}
