import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedResources, getResourceCategories } from '@/lib/resources';
import { buildMetadata, webPageJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { SectionHeading } from '@/components/SectionHeading';
import { ChevronRight, BookOpen } from 'lucide-react';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Free Developer Resources',
  description: 'Free downloadable resources, guides, and templates for developers and digital creators. Download PDFs, tools, and frameworks — no signup required.',
  path: '/resources',
});

export default async function ResourcesPage() {
  let resources: import('@/lib/resources').Resource[] = [];
  let categories: import('@/lib/resources').ResourceCategory[] = [];

  try {
    const [resourcesResult, categoriesResult] = await Promise.all([
      getPublishedResources({ limit: 24 }),
      getResourceCategories(),
    ]);
    resources = resourcesResult.data ?? [];
    categories = categoriesResult ?? [];
  } catch {
    // Graceful degradation — show empty state
  }

  const featured = resources.filter((r) => r.featured);
  const rest = resources.filter((r) => !r.featured);

  return (
    <>
      <JsonLd data={[
        webPageJsonLd({
          name: 'Free Developer Resources',
          description: 'Free downloadable resources, guides, and templates for developers and digital creators.',
          path: '/resources',
          type: 'CollectionPage',
        }),
        breadcrumbJsonLd([{ name: 'Resources', path: '/resources' }]),
      ]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-bgDark">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="eyebrow">Free Resources</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-textMain sm:text-5xl">
              Tools & Guides for{' '}
              <span className="text-primary">Developers</span> &{' '}
              <span className="text-primary">Creators</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-textMuted">
              Practical, free resources to help you build better — templates, frameworks, checklists and guides. No signup required.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        {/* Category filters */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <Link
              href="/resources"
              className="rounded-full border border-border bg-bgCard px-4 py-1.5 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-primary"
            >
              All
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/resources/category/${cat.slug}`}
                className="rounded-full border border-border bg-bgCard px-4 py-1.5 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen size={48} className="mb-4 text-primary/30" />
            <h2 className="text-xl font-semibold text-textMain">Resources coming soon</h2>
            <p className="mt-2 text-textMuted">We are preparing free resources for developers and creators.</p>
          </div>
        ) : (
          <>
            {/* Featured resources */}
            {featured.length > 0 && (
              <div className="mb-16">
                <SectionHeading as="h2" eyebrow="Featured" title="Must-have resources" />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            )}

            {/* All resources */}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && (
                  <SectionHeading as="h2" eyebrow="All Resources" title="Everything we have published" />
                )}
                <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featured.length > 0 ? 'mt-8' : ''}`}>
                  {rest.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Cross-promo */}
        <div className="mt-20 rounded-2xl border border-border bg-bgCard p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">YAIdigitals</p>
              <h3 className="mt-1 text-xl font-bold text-textMain">Need a custom solution built?</h3>
              <p className="mt-2 text-textMuted">We build websites, apps, and AI systems for businesses.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-bgDark transition-colors hover:bg-primaryDark hover:shadow-glow-sm"
            >
              Start a Project <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
