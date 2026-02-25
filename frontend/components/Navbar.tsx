'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, loading, refetch } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Don't render on dashboard — it has its own layout
    if (pathname?.startsWith('/dashboard')) return null;

    const handleLogout = async () => {
        try {
            await api.post('/api/auth/logout');
        } finally {
            await refetch(); // clears user from context
            setDropdownOpen(false);
            router.replace('/');
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

    return (
        <header
            className={[
                'fixed inset-x-0 z-50 transition-all duration-300 ease-in-out',
                'md:transition-all', // keep transition for desktop
                scrolled
                    ? 'top-0 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
                    : 'top-0 md:top-8 bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b border-white/[0.03] md:border-transparent',
            ].join(' ')}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left — Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Image src="/logo.png" alt="Vyzora Logo" width={40} height={40} className="object-contain" />
                    </div>
                    <span className="text-base font-semibold text-white tracking-[-0.01em]">Vyzora</span>
                </Link>

                {/* Right */}
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-1">
                        {[{ label: 'Features', href: '/#features' }, { label: 'Docs', href: '/docs' }].map((link) => (
                            <Link key={link.label} href={link.href}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button id="user-menu-btn" onClick={() => setDropdownOpen((v) => !v)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-all duration-200">
                                {user.githubId ? (
                                    <Image
                                        src={`https://avatars.githubusercontent.com/u/${user.githubId}?v=4&s=56`}
                                        alt={user.name || 'avatar'}
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{initials}</div>
                                )}
                                <span className="text-sm font-medium text-gray-200 max-w-[120px] truncate">{user.name || user.email}</span>
                                <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/[0.07]">
                                        <p className="text-xs font-semibold text-white truncate">{user.name || 'Account'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            Dashboard
                                        </Link>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/[0.06] transition-all">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login"
                            className="text-sm font-semibold px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 shadow-lg shadow-indigo-500/20">
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
