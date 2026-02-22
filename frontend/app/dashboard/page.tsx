import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-dot-grid opacity-30" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative text-center max-w-lg">
                <div className="text-6xl mb-6">📊</div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    Dashboard{' '}
                    <span className="gradient-text">coming soon</span>
                </h1>
                <p className="text-gray-400 leading-relaxed mb-8">
                    The analytics dashboard is under active development. Sign up to get early access
                    once it&apos;s live.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:bg-white/5"
                    >
                        ← Back to home
                    </Link>
                    <Link
                        href="/docs"
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200"
                    >
                        View Docs
                    </Link>
                </div>

                <div className="mt-12 rounded-2xl border border-white/10 bg-[#0d1117] p-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        What&apos;s coming
                    </p>
                    <div className="space-y-3 text-left">
                        {[
                            'Live event stream',
                            'Session replay viewer',
                            'Page-level analytics',
                            'Funnel analysis',
                            'Custom event charts',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                <span className="text-sm text-gray-400">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
