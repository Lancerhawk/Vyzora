'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const sections = [
    { label: 'Introduction', href: '#introduction' },
    { label: 'Quick Start', href: '#quick-start' },
    { label: 'Installation', href: '#installation' },
    { label: 'Initialization', href: '#initialization' },
    { label: 'Tracking Events', href: '#tracking-events' },
    { label: 'Pageview Tracking', href: '#pageview-tracking' },
    { label: 'Visitor & Session Model', href: '#visitor-session' },
    { label: 'Batching & Delivery', href: '#batching-delivery' },
    { label: 'Reliability Guarantees', href: '#reliability' },
    { label: 'Configuration Options', href: '#configuration' },
    { label: 'API Reference', href: '#api-reference' },
    { label: 'Backend Ingestion Format', href: '#ingest-format' },
    { label: 'Security & Validation', href: '#security' },
    { label: 'Local Development', href: '#local-dev' },
    { label: 'Production Deployment', href: '#production' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Troubleshooting', href: '#troubleshooting' },
];

export default function DocsSidebar() {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((e) => e.isIntersecting);
                if (visible) {
                    setActiveId(`#${visible.target.id}`);
                }
            },
            {
                rootMargin: '-100px 0px -60% 0px',
                threshold: 0,
            }
        );

        sections.forEach((s) => {
            const el = document.getElementById(s.href.replace('#', ''));
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <aside className="sticky top-28 w-64 shrink-0 self-start hidden lg:block max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <nav>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 px-3">
                    Documentation
                </p>
                <ul className="space-y-1">
                    {sections.map((s) => {
                        const isActive = activeId === s.href;
                        return (
                            <li key={s.href}>
                                <Link
                                    href={`/docs${s.href}`}
                                    className={[
                                        'flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200',
                                        isActive
                                            ? 'text-indigo-400 bg-indigo-500/10 font-medium'
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
