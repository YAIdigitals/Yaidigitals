import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Industries We Serve',
  description:
    'YAIdigitals builds technology for e-commerce, local commerce, automotive, restaurants, startups, professional services, education and real estate businesses.',
  path: '/industries',
});

interface DbIndustry {
  slug: string;
  name: string;
  icon?: string | null;
  short_description?: string | null;
}

export default async function IndustriesPage() {
  const supabase = createServerSupabase();
  const { data: industries } = await supabase
    .from('industries')
    .select('slug, name, icon, short_description')
    .eq('published', true)
    .order('sort_order');

  const all = (industries ?? []) as unknown as DbIndustry[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Industries', path: '/industries' }])) }}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="Industries"
          title="Technology for Businesses That Want to Grow"
          description="Every industry has different workflows, customers and challenges. We build technology around those differences."
        />

        {all.length === 0 ? (
          <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
            <h2 className="font-semibold text-textMain">Industry pages coming soon</h2>
            <p className="mt-2 text-sm text-textMuted">
              Meanwhile, explore our{' '}
              <Link href="/services" className="text-primary underline-offset-4 hover:underline">
                services
              </Link>
              .
            </p>
          </div>
        ) : (
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((ind) => (
              <StaggerItem key={ind.slug} className="h-full">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-bgCard p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
                >
                  {ind.icon && (
                    <span aria-hidden="true" className="mb-4 text-3xl">
                      {ind.icon}
                    </span>
                  )}
                  <h2 className="font-semibold text-lg text-textMain">{ind.name}</h2>
                  {ind.short_description && (
                    <p className="mt-2 text-sm leading-relaxed text-textMuted">{ind.short_description}</p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-primary group-hover:text-primaryDark">
                    Explore
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>
    </>
  );
}
