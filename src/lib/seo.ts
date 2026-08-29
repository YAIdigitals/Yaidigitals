import type { Metadata } from 'next';

/** Canonical origin for the production domain. */
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.co.in';

export const SITE_NAME = 'YAIdigitals';

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  /** Absolute or root-relative path; '' means the homepage. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}

/**
 * Single source of truth for page metadata: canonical URLs, Open Graph,
 * Twitter cards and robots directives. Per-page SEO fields from the CMS are
 * passed in by callers; everything falls back to safe brand defaults.
 */
export function buildMetadata({
  title,
  description,
  path = '',
  image = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: BuildMetadataOptions = {}): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image || '/opengraph-image';

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: path || '/' },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      images: [{ url: ogImage }],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };

  return metadata;
}

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                     */
/* ------------------------------------------------------------------ */

export function organizationJsonLd(opts?: { email?: string; social?: string[]; url?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: opts?.url || BASE_URL,
    description:
      'YAIdigitals is a technology company that designs and develops mobile apps, web applications, business websites, custom software and AI-powered automation for growing businesses.',
    ...(opts?.email ? { email: opts.email } : {}),
    ...(opts?.social?.length ? { sameAs: opts.social } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      ...(opts?.email ? { email: opts.email } : {}),
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

export function websiteJsonLd(url?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: url || BASE_URL,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceJsonLd(service: {
  title: string;
  description: string;
  slug: string;
  features?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    url: `${BASE_URL}/services/${service.slug}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    areaServed: 'IN',
    ...(service.features?.length
      ? { hasOfferCatalog: { '@type': 'OfferCatalog', name: service.title, itemListElement: service.features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f } })) } }
      : {}),
  };
}

export function articleJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    mainEntityOfPage: `${BASE_URL}/insights/${post.slug}`,
    ...(post.publishedTime ? { datePublished: post.publishedTime } : {}),
    ...(post.modifiedTime ? { dateModified: post.modifiedTime } : {}),
    ...(post.image ? { image: post.image } : {}),
    author: {
      '@type': 'Person',
      name: post.authorName || 'YAIdigitals Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}
