const SESSION_KEY = '__vyzora_session_id__';

function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getSessionId(): string {
    if (typeof window === 'undefined') return 'server-side';

    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
        id = generateId();
        sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

export function resetSession(): void {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_KEY);
    }
}
