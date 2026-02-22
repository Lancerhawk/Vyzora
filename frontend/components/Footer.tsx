'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Docs', href: '/docs' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Changelog', href: '#' },
    ],
    Resources: [
        { label: 'API Reference', href: '/docs#api-reference' },
        { label: 'SDK Guides', href: '/docs#sdk-usage' },
        { label: 'GitHub', href: 'https://github.com/Lancerhawk/Vyzora' },
    ],
    Legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
};

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/dashboard')) return null;
    return (
        <footer className="border-t border-white/10 bg-[#030712] mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-xl font-bold gradient-text">Vyzora</span>
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                            Analytics for developers and founders.
                            Track events, analyse sessions, and visualise
                            your product metrics.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group}>
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                                {group}
                            </h3>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Vyzora. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-700 font-medium">v0.5.0</p>
                </div>
            </div>
        </footer>
    );
}
