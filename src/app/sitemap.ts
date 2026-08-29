import { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/services',
    '/work',
    '/insights',
    '/industries',
    '/store',
    '/courses',
    '/privacy-policy',
    '/terms-conditions',
    '/refund-policy',
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/work' || path === '/services' ? 0.9 : 0.6,
  }));

  try {
    const supabase = createServerSupabase();
    const [services, projects, industries, courses, products, posts] = await Promise.all([
      supabase.from('services').select('slug, updated_at').eq('active', true),
      supabase.from('projects').select('slug, updated_at').eq('status', 'published'),
      supabase.from('industries').select('slug, updated_at').eq('published', true),
      supabase.from('courses').select('slug, updated_at').eq('published', true),
      supabase.from('products').select('slug').eq('active', true),
      supabase.from('blog_posts').select('slug, updated_at, published_at, created_at').eq('status', 'published'),
    ]);

    return [
      ...staticRoutes,
      ...(services.data ?? []).map((s) => ({
        url: `${BASE_URL}/services/${s.slug}`,
        lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...(projects.data ?? []).map((p) => ({
        url: `${BASE_URL}/work/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      })),
      ...(industries.data ?? []).map((i) => ({
        url: `${BASE_URL}/industries/${i.slug}`,
        lastModified: i.updated_at ? new Date(i.updated_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
      ...(courses.data ?? []).map((c) => ({
        url: `${BASE_URL}/courses/${c.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
      ...(products.data ?? []).map((p) => ({
        url: `${BASE_URL}/product/${p.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...(posts.data ?? []).map((b) => ({
        url: `${BASE_URL}/insights/${b.slug}`,
        lastModified: b.updated_at
          ? new Date(b.updated_at)
          : b.created_at
            ? new Date(b.created_at)
            : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
