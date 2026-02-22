'use client';

import { useRef } from 'react';

// Seeded-random so SSR and client render identical HTML (no hydration mismatch)
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface Particle {
    top: string;
    left: string;
    size: number;
    dur: number;
    delay: number;
    type: 'star' | 'bubble';
    color: string;
}

const COLORS = [
    '#6366f1',  // indigo
    '#a78bfa',  // violet
    '#818cf8',  // light indigo
    '#c084fc',  // purple
    '#38bdf8',  // sky
];

function generateParticles(): Particle[] {
    const rand = seededRandom(42);
    const particles: Particle[] = [];

    // Stars (bright, small, twinkle)
    for (let i = 0; i < 80; i++) {
        particles.push({
            type: 'star',
            top: `${(rand() * 100).toFixed(2)}%`,
            left: `${(rand() * 100).toFixed(2)}%`,
            size: rand() * 1.8 + 0.6,
            dur: rand() * 4 + 2,
            delay: rand() * 6,
            color: 'white',
        });
    }

    // Colored floating bubbles
    for (let i = 0; i < 18; i++) {
        particles.push({
            type: 'bubble',
            top: `${(rand() * 120 + 20).toFixed(2)}%`,
            left: `${(rand() * 100).toFixed(2)}%`,
            size: rand() * 4 + 2,
            dur: rand() * 14 + 8,
            delay: rand() * 10,
            color: COLORS[Math.floor(rand() * COLORS.length)],
        });
    }

    return particles;
}

const PARTICLES = generateParticles();

export default function ParticleField() {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            {PARTICLES.map((p, i) => (
                <span
                    key={i}
                    className={p.type}
                    style={{
                        top: p.top,
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        opacity: p.type === 'star' ? 0.3 : 0.45,
                        animation: p.type === 'star'
                            ? `twinkle ${p.dur}s ${p.delay}s ease-in-out infinite`
                            : `floatUp ${p.dur}s ${p.delay}s linear infinite`,
                        filter: p.type === 'bubble' ? `blur(0.5px) drop-shadow(0 0 4px ${p.color})` : undefined,
                    }}
                />
            ))}

            {/* Subtle radial gradient underlays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#1e1b4b55,transparent)]" />
            <div className="absolute right-[-8%] top-[20%] w-[420px] h-[420px] rounded-full bg-purple-600/[0.06] blur-[100px]" />
            <div className="absolute left-[-5%]  top-[30%] w-[320px] h-[320px] rounded-full bg-indigo-600/[0.07] blur-[90px]" />
        </div>
    );
}
