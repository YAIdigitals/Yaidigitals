import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedResources, getResourceCategories } from '@/lib/resources';
import { buildMetadata, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { BookOpen } from 'lucide-react';

export const revalidate = 300;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categories = await getResourceCategories().catch(() => []);
  const cat = categories.find(c => c.slug === category);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} Resources`,
    description: cat.description || `Free ${cat.name} resources, guides and templates from YAIdigitals.`,
    path: `/resources/category/${cat.slug}`,
  });
}

export async function generateStaticParams() {
  const categories = await getResourceCategories().catch(() => []);
  return categories.map(c => ({ category: c.slug }));
}

export default async function ResourceCategoryPage({ params }: Props) {
  const { category } = await params;
  const [categories, { data: resources }] = await Promise.all([
    getResourceCategories().catch(() => []),
    getPublishedResources({ category, limit: 24 }).catch(() => ({ data: [], count: 0 })),
  ]);

  const cat = categories.find(c => c.slug === category);
  if (!cat) notFound();

  return (
    <>
      <JsonLd data={[
        webPageJsonLd({
          name: `${cat.name} Resources`,
          description: cat.description || undefined,
          path: `/resources/category/${cat.slug}`,
          type: 'CollectionPage',
        }),
        breadcrumbJsonLd([
          { name: 'Resources', path: '/resources' },
          { name: cat.name, path: `/resources/category/${cat.slug}` },
        ]),
      ]} />

      {/* Hero */}
      <section className="border-b border-border bg-bgDark py-16">
        <div className="mx-auto max-w-6xl px-6">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-textMuted">
            <Link href="/resources" className="hover:text-primary">Resources</Link>
            <span aria-hidden>/</span>
            <span className="text-textMain">{cat.name}</span>
          </nav>
          <span className="eyebrow">{cat.name}</span>
          <h1 className="mt-3 text-3xl font-bold text-textMain sm:text-4xl">{cat.name} Resources</h1>
          {cat.description && (
            <p className="mt-3 text-textMuted">{cat.description}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Link href="/resources" className="rounded-full border border-border bg-bgCard px-4 py-1.5 text-sm text-textMuted hover:border-primary/40 hover:text-primary">
            All
          </Link>
          {categories.map(c => (
            <Link
              key={c.slug}
              href={`/resources/category/${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${c.slug === category
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-bgCard text-textMuted hover:border-primary/40 hover:text-primary'}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen size={48} className="mb-4 text-primary/30" />
            <h2 className="text-xl font-semibold text-textMain">No resources yet in {cat.name}</h2>
            <p className="mt-2 text-textMuted">Check back soon — resources are being added regularly.</p>
            <Link href="/resources" className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm text-textMuted hover:text-textMain">
              View all resources →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
