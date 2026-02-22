'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        // Run once on mount so SSR→client doesn't flash a wrong state
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={[
                // Always fixed — never scrolls with the page
                'fixed inset-x-0 z-50 transition-all duration-300 ease-in-out',
                scrolled
                    // Scrolled: snap to top-0, add blur + subtle border
                    ? 'top-0 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
                    // At top: float 32px below the screen edge, fully transparent
                    : 'top-8 bg-transparent border-b border-transparent',
            ].join(' ')}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left — Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image
                            src="/logo.png"
                            alt="Vyzora Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-base font-semibold text-white tracking-[-0.01em]">Vyzora</span>
                </Link>

                {/* Right — Nav links + CTA */}
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { label: 'Features', href: '/#features' },
                            { label: 'Docs', href: '/docs' },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <Link
                        href="/login"
                        className="text-sm font-semibold px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
