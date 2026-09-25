import { MetadataRoute } from 'next';
import { createServerSupabase } from '@/lib/supabase/server';
import { BASE_URL } from '@/lib/seo';

export const revalidate = 3600;

function validDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/services',
    '/work',
    '/insights',
    '/industries',
    '/courses',
    '/privacy-policy',
    '/terms-conditions',
    '/refund-policy',
  ].map((path) => ({
    url: `${BASE_URL}${path || '/'}`,
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
      ...((products.data ?? []).length > 0 ? [{ url: `${BASE_URL}/store` }] : []),
      ...(services.data ?? []).map((s) => ({
        url: `${BASE_URL}/services/${s.slug}`,
        ...(validDate(s.updated_at) ? { lastModified: validDate(s.updated_at) } : {}),
      })),
      ...(projects.data ?? []).map((p) => ({
        url: `${BASE_URL}/work/${p.slug}`,
        ...(validDate(p.updated_at) ? { lastModified: validDate(p.updated_at) } : {}),
      })),
      ...(industries.data ?? []).map((i) => ({
        url: `${BASE_URL}/industries/${i.slug}`,
        ...(validDate(i.updated_at) ? { lastModified: validDate(i.updated_at) } : {}),
      })),
      ...(courses.data ?? []).map((c) => ({
        url: `${BASE_URL}/courses/${c.slug}`,
        ...(validDate(c.updated_at) ? { lastModified: validDate(c.updated_at) } : {}),
      })),
      ...(products.data ?? []).map((p) => ({
        url: `${BASE_URL}/product/${p.slug}`,
      })),
      ...(posts.data ?? []).map((b) => ({
        url: `${BASE_URL}/insights/${b.slug}`,
        ...(validDate(b.updated_at || b.published_at || b.created_at)
          ? { lastModified: validDate(b.updated_at || b.published_at || b.created_at) }
          : {}),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
