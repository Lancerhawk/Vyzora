import Navbar from '../../components/Navbar';

export const metadata = {
    title: 'Documentations: Vyzora',
    description: 'Vyzora developer documentation: installation, SDK usage, and API reference.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
