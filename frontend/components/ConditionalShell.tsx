'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname?.startsWith('/dashboard')) return null;
    return <>{children}</>;
}
