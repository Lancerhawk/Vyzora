const VISITOR_KEY = 'vyzora_visitor_id';

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

export function getVisitorId(): string {
    try {
        let id = localStorage.getItem(VISITOR_KEY);
        if (!id) {
            id = generateUUID();
            localStorage.setItem(VISITOR_KEY, id);
        }
        return id;
    } catch {
        return generateUUID();
    }
}
