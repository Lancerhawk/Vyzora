'use client';

import { useEffect } from 'react';
import { Vyzora } from 'vyzora-sdk';

export default function VyzoraProvider() {
    useEffect(() => {
        if (typeof window === "undefined") return;


        new Vyzora({
            apiKey: process.env.NEXT_PUBLIC_VYZORA_KEY!,
            endpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/ingest`,
            enabled: true,
            debug: true,
        });

    }, []);

    return null;
}