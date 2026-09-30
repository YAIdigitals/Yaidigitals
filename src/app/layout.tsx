import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSettingsBundle } from '@/lib/settings';
import { BASE_URL, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const { seo, site } = await getSettingsBundle();
  const title =
    seo.default_title || `${site.company_name} | Website, App, Software & AI Development Company`;
  const socialImage = seo.og_image || '/opengraph-image';

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      template: seo.title_template || `%s | ${site.company_name}`,
      default: title,
    },
    description: seo.default_description,
    applicationName: site.company_name,
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      title,
      description: seo.default_description,
      url: `${BASE_URL}/`,
      siteName: site.company_name,
      locale: 'en_US',
      type: 'website',
      images: [{ url: socialImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: seo.default_description,
      images: [socialImage],
    },
    verification: {
      ...(seo.google_site_verification ? { google: seo.google_site_verification } : {}),
      ...(seo.bing_site_verification ? { other: { 'msvalidate.01': seo.bing_site_verification } } : {}),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { site, seo, integrations } = await getSettingsBundle();

  const orgLd = organizationJsonLd({
    email: seo.organization?.email || site.contact_email,
    social: Object.values(site.social).filter(Boolean) as string[],
  });
  const webLd = websiteJsonLd();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <link rel="preconnect" href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin} />
        )}
        <JsonLd data={orgLd} />
        <JsonLd data={webLd} />
      </head>
      <body className={inter.className}>
        {integrations.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(integrations.google_analytics_id)}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${integrations.google_analytics_id}');`}
            </Script>
          </>
        )}
        {integrations.meta_pixel_id && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${integrations.meta_pixel_id}');fbq('track','PageView');`}
          </Script>
        )}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bgDark"
        >
          Skip to content
        </a>
        <Header company={site.company_name} />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer site={site} />
      </body>
    </html>
  );
}
