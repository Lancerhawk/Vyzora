import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChangelogButton from '../components/ChangelogButton';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vyzora — Analytics for Developers',
  description: 'Track events, analyse sessions, and visualise your product metrics with Vyzora.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#030712] text-gray-100 antialiased`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ChangelogButton />
        </AuthProvider>
      </body>
    </html>
  );
}
