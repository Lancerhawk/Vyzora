import { safeGet, safeSet, generateUUID } from './storage';

const VISITOR_KEY = 'vyzora_vid';


let fallbackId: string | null = null;

export function getVisitorId(): string {
    const stored = safeGet(VISITOR_KEY);
    if (stored) return stored;

    const id = generateUUID();
    safeSet(VISITOR_KEY, id);

    const verified = safeGet(VISITOR_KEY);
    if (verified) return verified;

    if (!fallbackId) fallbackId = id;
    return fallbackId;
}
