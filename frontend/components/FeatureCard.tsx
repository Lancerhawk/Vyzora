interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="glow-border rounded-2xl bg-[#0d1117] p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-300">
            <div className="text-3xl">{icon}</div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
