
export class Logger {
    private debug: boolean;

    constructor(debug: boolean = false) {
        this.debug = debug;
    }

    log(message: string, ...args: unknown[]): void {
        if (!this.debug) return;
        console.warn(`[Vyzora] ${message}`, ...args);
    }

    warn(message: string, ...args: unknown[]): void {
        console.warn(`[Vyzora] ${message}`, ...args);
    }

    error(message: string, ...args: unknown[]): void {
        console.error(`[Vyzora] ${message}`, ...args);
    }
}
