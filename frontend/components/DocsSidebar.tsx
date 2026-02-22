'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
    { label: 'Overview', href: '#overview' },
    { label: 'Quickstart', href: '#quickstart' },
    { label: 'SDK Reference', href: '#sdk-reference' },
    { label: 'API Reference', href: '#api-reference' },
    { label: 'Authentication', href: '#authentication' },
    { label: 'Self-hosting', href: '#self-hosting' },
    { label: 'FAQ', href: '#faq' },
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-28 w-64 shrink-0 self-start hidden lg:block">
            <nav>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 px-3">
                    Documentation
                </p>
                <ul className="space-y-1">
                    {sections.map((s) => {
                        const isActive = pathname === '/docs' && typeof window !== 'undefined' &&
                            window.location.hash === s.href;
                        return (
                            <li key={s.href}>
                                <Link
                                    href={`/docs${s.href}`}
                                    className={[
                                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                                        isActive
                                            ? 'text-indigo-400 bg-indigo-500/10 border-l-2 border-indigo-400'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5',
                                    ].join(' ')}
                                >
                                    {s.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
