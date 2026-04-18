'use client';

import { useState, useMemo } from 'react';
import faqData from '../../data/faq.json';

// --- Shared Styles from Docs ---
const h1 = 'text-xl md:text-3xl font-bold text-white mb-4';
const h2 = 'text-lg md:text-2xl font-bold text-white mb-4';
const p = 'text-gray-400 leading-relaxed mb-4 text-[13px] md:text-sm';
const card = 'rounded-2xl border border-white/10 bg-[#0d1117] p-5 md:p-6 mb-4';
const sidebarItemActive = 'text-indigo-400 bg-indigo-500/10 font-medium';
const sidebarItemInactive = 'text-gray-400 hover:text-white hover:bg-white/5';

// --- Icon Components ---
const Icons = {
    Zap: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
    Shield: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    ),
    Box: () => (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    Search: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    ChevronDown: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    ),
    Mail: () => (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    )
};

const IconMap: Record<string, React.ReactNode> = {
    'zap': <Icons.Zap />,
    'shield': <Icons.Shield />,
    'box': <Icons.Box />
};

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const categories = useMemo(() => faqData.sections.map(c => c.heading), []);

    const filteredSections = useMemo(() => {
        let data = faqData.sections;
        if (activeCategory) {
            data = data.filter(c => c.heading === activeCategory);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return data.map(c => ({
                ...c,
                questions: c.questions.filter(q => 
                    q.question.toLowerCase().includes(query) || 
                    q.answer.toLowerCase().includes(query)
                )
            })).filter(c => c.questions.length > 0);
        }
        return data;
    }, [searchQuery, activeCategory]);

    const toggleAccordion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="min-h-screen pt-24 md:pt-28 pb-24 bg-[#030712]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                {/* ─────────────── SIDEBAR (Desktop Only) ──────────────── */}
                <aside className="hidden lg:block sticky top-28 w-64 shrink-0 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                    <nav>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 px-3">
                            Categories
                        </p>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setActiveCategory(null)}
                                    className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                        activeCategory === null ? sidebarItemActive : sidebarItemInactive
                                    }`}
                                >
                                    All Questions
                                </button>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setActiveCategory(cat)}
                                        className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 text-left ${
                                            activeCategory === cat ? sidebarItemActive : sidebarItemInactive
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* ─────────────── MAIN CONTENT ──────────────── */}
                <article className="flex-1 min-w-0 max-w-none">
                    
                    {/* Hero Section */}
                    <header className="mb-12">
                        <h1 className={h1}>{faqData.hero.title}</h1>
                        <p className={p}>{faqData.hero.description}</p>
                    </header>

                    {/* Feature Grid (Re-introduced & Styled like Docs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        {faqData.features.map((feature) => (
                            <div key={feature.title} className={`${card} !mb-0 flex flex-col items-start gap-4 hover:border-white/20 transition-colors`}>
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                                    {IconMap[feature.icon] || <Icons.Box />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Category Scroll (Visible only on mobile/tablet) */}
                    <div className="lg:hidden mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                                    activeCategory === null ? sidebarItemActive : sidebarItemInactive
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 whitespace-nowrap ${
                                        activeCategory === cat ? sidebarItemActive : sidebarItemInactive
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-12">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                placeholder="Search questions, architecture, or flow..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#0d1117] border border-white/10 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-all text-sm placeholder:text-gray-600 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* FAQ Accordion List */}
                    <div className="space-y-16">
                        {filteredSections.length > 0 ? (
                            filteredSections.map((section, sIdx) => (
                                <div key={section.heading} className="scroll-mt-28">
                                    <h2 className={h2}>{section.heading}</h2>
                                    <div className="space-y-3">
                                        {section.questions.map((q, qIdx) => {
                                            const id = `${sIdx}-${qIdx}`;
                                            const isOpen = openIndex === id;
                                            return (
                                                <div 
                                                    key={id} 
                                                    className={`rounded-2xl border transition-all duration-200 bg-[#0d1117] ${
                                                        isOpen ? 'border-indigo-500/30' : 'border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() => toggleAccordion(id)}
                                                        className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                                                    >
                                                        <span className={`text-[13px] md:text-[15px] font-semibold transition-colors duration-200 ${isOpen ? 'text-white' : 'text-gray-300'}`}>
                                                            {q.question}
                                                        </span>
                                                        <div className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-gray-600'}`}>
                                                            <Icons.ChevronDown />
                                                        </div>
                                                    </button>
                                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-5 md:px-6 pb-6 pt-2 text-gray-400 text-[13px] md:text-[14px] leading-relaxed border-t border-white/5 mt-2">
                                                            <div className="pt-4">
                                                                {q.answer}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 rounded-2xl border border-dashed border-white/10 bg-[#0d1117]/50">
                                <p className="text-gray-500 text-sm">No results found for your search.</p>
                            </div>
                        )}
                    </div>

                    {/* Support Footer */}
                    <div className="mt-24">
                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-8 md:p-12 text-center">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{faqData.cta.title}</h2>
                            <p className={p}>{faqData.cta.description}</p>
                            <a 
                                href={faqData.cta.buttonLink}
                                className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                <Icons.Mail />
                                {faqData.cta.buttonText}
                            </a>
                        </div>
                    </div>

                </article>
            </div>
        </div>
    );
}
