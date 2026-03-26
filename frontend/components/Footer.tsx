'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../lib/store';

const navLinks = {
    Product: [
        { label: 'Features', href: '/#features' },
        { label: 'Docs', href: '/docs' },
        { label: 'Dashboard', href: '/dashboard' },
    ],
    Resources: [
        { label: 'API Reference', href: '/docs#api-reference' },
        { label: 'SDK Guides', href: '/docs#sdk-usage' },
        { label: 'GitHub', href: 'https://github.com/Lancerhawk/Vyzora' },
    ],
};

export default function Footer() {
    const pathname = usePathname();
    const { openChangelog, openPrivacy, openTerms } = useStore();

    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <footer className="border-t border-white/10 bg-[#030712] mt-24">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-xl font-bold gradient-text">Vyzora</span>
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                            High-performance event analytics for engineering and product teams.
                            Turn raw behavioral data into actionable growth insights.
                        </p>
                    </div>

                    {/* Nav link columns */}
                    {Object.entries(navLinks).map(([group, items]) => (
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

                    {/* Legal column */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={openChangelog}
                                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                                >
                                    Changelog
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={openPrivacy}
                                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                                >
                                    Privacy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={openTerms}
                                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 text-left"
                                >
                                    Terms
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Vyzora. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
