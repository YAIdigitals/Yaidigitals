import type { Metadata } from 'next';

/** Canonical origin for the production domain. */
export const BASE_URL = 'https://www.yaidigitals.co.in';

export const SITE_NAME = 'YAIdigitals';

export function absoluteUrl(path = '/') {
  try {
    return new URL(path).toString();
  } catch {
    return new URL(path.startsWith('/') ? path : `/${path}`, `${BASE_URL}/`).toString();
  }
}

/** Chooses a useful CMS description and keeps it within a practical snippet length. */
export function metaDescription(...values: Array<string | null | undefined>) {
  const candidates = values
    .map((value) => value?.replace(/^##\s+.*$/gm, ' ').replace(/\s+/g, ' ').trim())
    .filter((value): value is string => Boolean(value));
  const selected =
    candidates.find((value) => value.length >= 70 && value.length <= 160) ||
    candidates.find((value) => value.length >= 70) ||
    candidates[0];

  if (!selected || selected.length <= 160) return selected;
  const shortened = selected.slice(0, 157);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 120 ? lastSpace : 157).trimEnd()}…`;
}

interface BuildMetadataOptions {
  title?: string;
  /** Render the title verbatim — used when the CMS seo_title already includes the brand suffix. */
  absoluteTitle?: boolean;
  description?: string;
  /** Absolute or root-relative path; '' means the homepage. */
  path?: string;
  image?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
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
  absoluteTitle = false,
  description,
  path = '',
  image = '',
  openGraphTitle,
  openGraphDescription,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
}: BuildMetadataOptions = {}): Metadata {
  const url = absoluteUrl(path || '/');
  const ogImage = absoluteUrl(image || '/opengraph-image');

  const metadata: Metadata = {
    title: absoluteTitle ? { absolute: title ?? '' } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: openGraphTitle || title,
      description: openGraphDescription || description,
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
      title: openGraphTitle || title,
      description: openGraphDescription || description,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };

  return metadata;
}

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                     */
/* ------------------------------------------------------------------ */

export function organizationJsonLd(opts?: { email?: string; social?: string[] }) {
  const organizationUrl = absoluteUrl('/');
  const sameAs = (opts?.social ?? []).filter((value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch {
      return false;
    }
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${organizationUrl}#organization`,
    name: SITE_NAME,
    url: organizationUrl,
    logo: absoluteUrl('/icon.svg'),
    description:
      'YAIdigitals is a technology company that designs and develops mobile apps, web applications, business websites, custom software and AI-powered automation for growing businesses.',
    ...(opts?.email ? { email: opts.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      ...(opts?.email ? { email: opts.email } : {}),
      availableLanguage: ['English', 'Hindi'],
    },
  };
}

export function websiteJsonLd() {
  const websiteUrl = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${websiteUrl}#website`,
    name: SITE_NAME,
    url: websiteUrl,
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export function webPageJsonLd(page: {
  name: string;
  description?: string;
  path: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
}) {
  const url = absoluteUrl(page.path || '/');
  return {
    '@context': 'https://schema.org',
    '@type': page.type || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.name,
    ...(page.description ? { description: page.description } : {}),
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
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
      item: absoluteUrl(item.path),
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
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
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
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
    ...(post.publishedTime ? { datePublished: post.publishedTime } : {}),
    ...(post.modifiedTime ? { dateModified: post.modifiedTime } : {}),
    ...(post.image ? { image: absoluteUrl(post.image) } : {}),
    author: post.authorName
      ? { '@type': 'Person', name: post.authorName }
      : { '@id': `${BASE_URL}/#organization` },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

export function creativeWorkJsonLd(work: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  services?: string[];
  technologies?: string[];
  modifiedTime?: string;
}) {
  const url = absoluteUrl(`/work/${work.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#case-study`,
    name: work.name,
    url,
    ...(work.description ? { description: work.description } : {}),
    ...(work.image ? { image: absoluteUrl(work.image) } : {}),
    ...(work.modifiedTime ? { dateModified: work.modifiedTime } : {}),
    ...(work.services?.length ? { about: work.services } : {}),
    ...(work.technologies?.length ? { keywords: work.technologies.join(', ') } : {}),
    creator: { '@id': `${BASE_URL}/#organization` },
    isPartOf: { '@id': `${BASE_URL}/#website` },
  };
}

export function productJsonLd(product: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  price?: number | null;
}) {
  const url = absoluteUrl(`/product/${product.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url,
    ...(product.description ? { description: product.description } : {}),
    ...(product.image ? { image: absoluteUrl(product.image) } : {}),
    brand: { '@id': `${BASE_URL}/#organization` },
    ...(typeof product.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price: product.price,
          },
        }
      : {}),
  };
}

export function courseJsonLd(course: {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  providerName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    ...(course.description ? { description: course.description } : {}),
    url: absoluteUrl(`/courses/${course.slug}`),
    ...(course.image ? { image: absoluteUrl(course.image) } : {}),
    provider: {
      '@type': 'Organization',
      name: course.providerName || SITE_NAME,
      sameAs: `${BASE_URL}/`,
    },
  };
}
