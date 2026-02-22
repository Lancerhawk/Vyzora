import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChangelogButton from '../components/ChangelogButton';
import Preloader from '../components/Preloader';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vyzora: Intelligence for Modern Engineering Teams',
  description: 'Built for high-scale event tracking and behavioral analytics. Transform raw events into actionable insights with sub-second performance.',
  icons: {
    icon: '/logo.svg',
  },
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
          <Preloader />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ChangelogButton />
        </AuthProvider>
      </body>
    </html>
  );
}
