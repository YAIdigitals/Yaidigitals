import type { Metadata } from 'next';

/**
 * Generate metadata for pages with fallback defaults
 */
export function generateMetadata({
  title = 'YAIdigitals',
  description = 'Digital products that perform',
  image = '',
  url = '',
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
} = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app';
  
  return {
    title: {
      template: `%s | YAIdigitals`,
      default: title,
    },
    description,
    // Open Graph / Facebook
    openGraph: {
      title,
      description,
      url: url || baseUrl,
      images: image ? [{ url: image }] : [],
      siteName: 'YAIdigitals',
      locale: 'en_US',
      type: 'website',
    },
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    // Additional metadata
    metadataBase: new URL(baseUrl),
    // Alternates
    alternates: {
      canonical: url || baseUrl,
    },
  };
}

/**
 * Generate metadata for service pages
 */
export function generateServiceMetadata(service: {
  title: string;
  short_description: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
}): Metadata {
  return generateMetadata({
    title: service.seo_title || service.title,
    description: service.seo_description || service.short_description,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'}/services/${service.slug}`,
  });
}

/**
 * Generate metadata for course pages
 */
export function generateCourseMetadata(course: {
  title: string;
  short_description: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
}): Metadata {
  return generateMetadata({
    title: course.seo_title || course.title,
    description: course.seo_description || course.short_description,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'}/courses/${course.slug}`,
  });
}

/**
 * Generate metadata for project pages
 */
export function generateProjectMetadata(project: {
  title: string;
  description: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
}): Metadata {
  return generateMetadata({
    title: project.seo_title || project.title,
    description: project.seo_description || project.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'}/projects/${project.slug}`,
  });
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  return generateMetadata({
    title: product.title,
    description: product.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'}/product/${product.slug}`,
  });
}

/**
 * Generate metadata for blog pages
 */
export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
}): Metadata {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app'}/blog/${post.slug}`,
  });
}