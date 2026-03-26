'use client';

import privacySections from '../data/privacy.json';
import termsSections from '../data/terms.json';
import { useStore } from '../lib/store';

type Section = { title: string; text: string };

export default function LegalModal() {
    const { isPrivacyOpen, closePrivacy, isTermsOpen, closeTerms } = useStore();

    const isOpen = isPrivacyOpen || isTermsOpen;
    const type = isPrivacyOpen ? 'privacy' : 'terms';
    const onClose = isPrivacyOpen ? closePrivacy : closeTerms;

    if (!isOpen) return null;

    const isPrivacy = type === 'privacy';
    const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
    const sections = (isPrivacy ? privacySections : termsSections) as Section[];
    const accentColor = isPrivacy ? 'text-indigo-400' : 'text-emerald-400';
    const dotColor = isPrivacy ? 'bg-indigo-500' : 'bg-emerald-500';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div
                className="relative z-10 w-full max-w-2xl flex flex-col rounded-2xl border border-white/[0.08] bg-[#0c1018] shadow-2xl shadow-black/70 overflow-hidden"
                style={{ maxHeight: 'min(680px, calc(100vh - 2rem))' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                        <div>
                            <h3 className="text-lg font-bold text-white">{title}</h3>
                            <p className={`text-[11px] mt-0.5 font-medium ${accentColor}`}>
                                Last updated: March 26, 2026
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all duration-150 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-6 space-y-6">
                    {sections.map((section, i) => (
                        <div key={i} className="flex gap-4">
                            <div className={`mt-1.5 w-1 shrink-0 rounded-full self-stretch bg-gradient-to-b ${isPrivacy ? 'from-indigo-500/40 to-indigo-500/0' : 'from-emerald-500/40 to-emerald-500/0'}`} />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-200 mb-1.5">
                                    {section.title}
                                </h4>
                                <p className="text-[13px] text-gray-500 leading-relaxed">
                                    {section.text}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 border-t border-white/[0.05]">
                        <p className="text-[11px] text-gray-600">
                            Questions? Open an issue on{' '}
                            <a
                                href="https://github.com/Lancerhawk/Vyzora"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-500 hover:text-indigo-400 transition-colors"
                            >
                                GitHub
                            </a>
                            {' '}or use the feedback button.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
