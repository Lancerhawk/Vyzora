'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Phase = 'enter' | 'hold' | 'exit' | 'gone';

let hasShownPreloader = false;

export default function Preloader() {
    const [active, setActive] = useState(false);
    const [phase, setPhase] = useState<Phase>('enter');

    useEffect(() => {
        if (window.location.pathname !== '/' || hasShownPreloader) return;
        hasShownPreloader = true;
        setActive(true);
    }, []);

    useEffect(() => {
        if (!active) return;
        const t1 = setTimeout(() => setPhase('hold'), 200);
        const t2 = setTimeout(() => setPhase('exit'), 1600);
        const t3 = setTimeout(() => setPhase('gone'), 2400);
        return () => [t1, t2, t3].forEach(clearTimeout);
    }, [active]);

    if (!active || phase === 'gone') return null;


    return (
        <>
            <div
                className="vz-preloader"
                data-phase={phase}
            >
                {/* Soft radial glow behind logo */}
                <div className="vz-glow" />

                {/* Logo + Brand */}
                <div className="vz-brand">
                    <div className="vz-logo-wrap">
                        <Image
                            src="/logo.png"
                            alt="Vyzora"
                            width={100}
                            height={32}
                            priority
                            className="object-contain"
                        />
                    </div>

                    <div className="vz-text">
                        <span className="vz-name">Vyzora</span>
                        <span className="vz-tag">Intelligence Platform</span>
                    </div>
                </div>

                {/* Progress bar at bottom */}
                <div className="vz-progress-track">
                    <div className="vz-progress-fill" />
                </div>
            </div>

            <style>{`
                /* ── Shell ──────────────────────────────────────────── */
                .vz-preloader {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #020617;
                    transition: transform 700ms cubic-bezier(0.76, 0, 0.24, 1);
                }
                .vz-preloader[data-phase="exit"],
                .vz-preloader[data-phase="gone"] {
                    transform: translateY(-100%);
                }

                /* ── Glow ───────────────────────────────────────────── */
                .vz-glow {
                    position: absolute;
                    width: 480px;
                    height: 480px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* ── Brand column (vertical stack) ────────────────── */
                .vz-brand {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    animation: vz-brand-in 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms both;
                }

                @keyframes vz-brand-in {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* ── Logo ──────────────────────────────────────── */
                .vz-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ── Text block ─────────────────────────────────────── */
                .vz-text {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    text-align: center;
                }

                .vz-name {
                    font-size: 36px;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    color: #fff;
                    line-height: 1;
                    animation: vz-name-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 250ms both;
                    text-align: center;
                }

                @keyframes vz-name-in {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .vz-tag {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(99, 102, 241, 0.75);
                    animation: vz-tag-in 600ms cubic-bezier(0.22, 1, 0.36, 1) 400ms both;
                }

                @keyframes vz-tag-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Progress bar ───────────────────────────────────── */
                .vz-progress-track {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.04);
                    overflow: hidden;
                }

                .vz-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
                    background-size: 200% 100%;
                    animation:
                        vz-progress 1.4s cubic-bezier(0.4, 0, 0.2, 1) 100ms both,
                        vz-shimmer 1.2s linear 100ms infinite;
                }

                @keyframes vz-progress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }

                @keyframes vz-shimmer {
                    from { background-position: 200% 0; }
                    to   { background-position: -200% 0; }
                }
            `}</style>
        </>
    );
}