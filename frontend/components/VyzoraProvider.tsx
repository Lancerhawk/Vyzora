'use client';

import { useEffect } from 'react';
import { Vyzora } from 'vyzora-sdk';

export default function VyzoraProvider() {
    useEffect(() => {
        if (typeof window === "undefined") return;


        new Vyzora({
            apiKey: process.env.NEXT_PUBLIC_VYZORA_KEY!,
            enabled: true,
        });

    }, []);

    return null;
}