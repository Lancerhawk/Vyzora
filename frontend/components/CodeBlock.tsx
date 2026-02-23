'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
    children: string;
    language?: 'javascript' | 'typescript' | 'bash' | 'terminal';
}

/**
 * Enhanced CodeBlock component with syntax highlighting and copy-to-clipboard.
 */
export default function CodeBlock({ children }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    /**
     * extremely lightweight syntax highlighter using regex.
     * Matches keywords, strings, comments, and numbers.
     */
    const highlight = (code: string) => {
        const rules = [
            // Comments (gray-600)
            { regex: /(\/\/.*|\/\*[\s\S]*?\*\/)/g, className: 'text-gray-600 italic' },
            // Strings (amber-300)
            { regex: /(["'])(?:(?=(\\?))\2.)*?\1/g, className: 'text-amber-300' },
            // Keywords (blue-300)
            { regex: /\b(import|export|default|function|const|let|var|new|return|if|else|await|async|try|catch|finally|throw|class|extends|from|type|interface|enum)\b/g, className: 'text-blue-300' },
            // Booleans & Nulls (violet-400)
            { regex: /\b(true|false|null|undefined)\b/g, className: 'text-violet-400' },
            // Function calls (yellow-300)
            { regex: /\b([a-zA-Z0-9_$]+)(?=\()/g, className: 'text-yellow-300' },
            // Numbers (rose-400)
            { regex: /\b(\d+)\b/g, className: 'text-rose-400' },
            // Emerald for package managers / shell commands (emerald-400)
            { regex: /\b(npm install|yarn add|pnpm add|npm run|git clone|cd)\b/g, className: 'text-emerald-400' },
        ];

        // We use a manifest of matches to avoid overlapping replacements
        let segments: { text: string; className?: string }[] = [{ text: code }];

        rules.forEach((rule) => {
            const newSegments: typeof segments = [];
            segments.forEach((segment) => {
                if (segment.className) {
                    newSegments.push(segment);
                    return;
                }

                let lastIdx = 0;
                let match;
                // reset regex index
                rule.regex.lastIndex = 0;

                while ((match = rule.regex.exec(segment.text)) !== null) {
                    if (match.index > lastIdx) {
                        newSegments.push({ text: segment.text.substring(lastIdx, match.index) });
                    }
                    newSegments.push({ text: match[0], className: rule.className });
                    lastIdx = rule.regex.lastIndex;
                }

                if (lastIdx < segment.text.length) {
                    newSegments.push({ text: segment.text.substring(lastIdx) });
                }
            });
            segments = newSegments;
        });

        return segments.map((seg, i) => (
            <span key={i} className={seg.className}>
                {seg.text}
            </span>
        ));
    };

    return (
        <div className="group relative mb-6">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors backdrop-blur-md"
                >
                    {copied ? (
                        <>
                            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Copied</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#060d1a] overflow-hidden">
                {/* Header-ish bar for style consistency */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                    <div className="w-2 h-2 rounded-full bg-white/5" />
                    <div className="w-2 h-2 rounded-full bg-white/5" />
                    <div className="w-2 h-2 rounded-full bg-white/5" />
                </div>

                <pre className="p-6 text-[13px] leading-[1.8] font-mono overflow-x-auto text-gray-300">
                    <code>{highlight(children.trim())}</code>
                </pre>
            </div>
        </div>
    );
}
