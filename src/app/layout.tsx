import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { generateMetadata } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

// Default metadata for the site
export const metadata: Metadata = {
  title: {
    template: '%s | YAIdigitals',
    default: 'YAIdigitals',
  },
  description: 'Digital products that perform',
  // Open Graph / Facebook
  openGraph: {
    title: 'YAIdigitals',
    description: 'Digital products that perform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app',
    siteName: 'YAIdigitals',
    locale: 'en_US',
    type: 'website',
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'YAIdigitals',
    description: 'Digital products that perform',
  },
  // Additional metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'),
  // Alternates
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}