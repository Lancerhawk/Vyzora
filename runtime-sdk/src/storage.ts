/**
 * Safe localStorage wrapper.
 * All methods fail silently — never throw, never console.error.
 * Handles Safari private mode (SecurityError) and storage quota.
 */

export function safeGet(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function safeSet(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // QuotaExceededError, SecurityError — fail silently
    }
}

export function safeRemove(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch {
        // fail silently
    }
}
