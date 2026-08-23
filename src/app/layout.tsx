import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';

const inter = Inter({ subsets: ['latin'] });

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app';
const DESCRIPTION =
  'YAIdigitals builds mobile apps, websites and AI calling agents for growing businesses — plus instant-delivery digital products and practical tech courses.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    template: '%s | YAIdigitals',
    default: 'YAIdigitals — App, Website & AI Automation Development',
  },
  description: DESCRIPTION,
  applicationName: 'YAIdigitals',
  keywords: [
    'app development company',
    'website development company',
    'AI calling agent',
    'custom software development',
    'digital products',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'YAIdigitals — App, Website & AI Automation Development',
    description: DESCRIPTION,
    url: BASE,
    siteName: 'YAIdigitals',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAIdigitals — App, Website & AI Automation Development',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YAIdigitals',
  url: BASE,
  description: DESCRIPTION,
  email: 'info@yaidigitals.com',
  sameAs: [
    'https://instagram.com/yaidigitals_',
    'https://facebook.com/yaidigitals',
    'https://twitter.com/yaidigitals',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'YAIdigitals',
  url: BASE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : undefined} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <SmoothScrollProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bgDark"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
