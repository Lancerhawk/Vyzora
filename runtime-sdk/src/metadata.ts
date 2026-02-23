import type { AutoMetadata } from './types';

function detectBrowser(ua: string): { browser: string; version: string } {
    const rules: [RegExp, string][] = [
        [/Edg\/(\S+)/, 'Edge'],
        [/OPR\/(\S+)/, 'Opera'],
        [/SamsungBrowser\/(\S+)/, 'Samsung'],
        [/Firefox\/(\S+)/, 'Firefox'],
        [/Chrome\/(\S+)/, 'Chrome'],
        [/Safari\/(\S+)/, 'Safari'],
    ];
    for (const [re, name] of rules) {
        const m = ua.match(re);
        if (m) return { browser: name, version: m[1].split('.')[0] };
    }
    return { browser: 'Unknown', version: '' };
}

function detectOS(ua: string): string {
    if (/Windows NT/i.test(ua)) return 'Windows';
    if (/Mac OS X/i.test(ua)) return 'macOS';
    if (/Android/i.test(ua)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Linux/i.test(ua)) return 'Linux';
    return 'Unknown';
}

function detectDevice(ua: string): AutoMetadata['deviceType'] {
    if (/Mobi/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
}

export function collectMetadata(): AutoMetadata {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return {};
    }

    try {
        const ua = navigator.userAgent;
        const { browser, version } = detectBrowser(ua);

        return {
            browser,
            browserVersion: version,
            os: detectOS(ua),
            deviceType: detectDevice(ua),
            screenWidth: window.screen?.width,
            screenHeight: window.screen?.height,
            language: navigator.language,
            referrer: document.referrer || undefined,
            timezone: Intl?.DateTimeFormat?.().resolvedOptions?.()?.timeZone,
        };
    } catch {
        return {};
    }
}
