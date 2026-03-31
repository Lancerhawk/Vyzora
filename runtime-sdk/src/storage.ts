
export function generateUUID(): string {
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
