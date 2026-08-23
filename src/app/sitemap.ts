import { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://yaidigitals.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '', '/about', '/contact', '/services', '/courses', '/projects', '/store', '/blog',
    '/privacy-policy', '/terms-conditions', '/refund-policy',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/store' || path === '/services' ? 0.9 : 0.6,
  }));

  try {
    const supabase = createServerSupabase();
    const [services, courses, products, posts] = await Promise.all([
      supabase.from('services').select('slug, updated_at').eq('active', true),
      supabase.from('courses').select('slug').eq('published', true),
      supabase.from('products').select('slug').eq('active', true),
      supabase.from('blog_posts').select('slug, created_at').eq('active', true),
    ]);

    return [
      ...staticRoutes,
      ...(services.data ?? []).map((s) => ({
        url: `${BASE}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...(courses.data ?? []).map((c) => ({
        url: `${BASE}/courses/${c.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...(products.data ?? []).map((p) => ({
        url: `${BASE}/product/${p.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...(posts.data ?? []).map((b) => ({
        url: `${BASE}/blog/${b.slug}`,
        lastModified: b.created_at ? new Date(b.created_at) : new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
