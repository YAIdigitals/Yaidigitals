import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { WorkCard, type WorkCardProject } from '@/components/cards/WorkCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Our Work — Products We Have Built',
  description:
    'Case studies of digital products built by YAIdigitals: hyperlocal commerce platforms, delivery systems, business web applications and more.',
  path: '/work',
});

interface DbProject {
  id: number;
  slug: string;
  title: string;
  industry?: string | null;
  category?: string | null;
  short_description?: string | null;
  cover_image?: string | null;
  services_provided?: unknown;
  technologies?: unknown;
}

function toCard(p: DbProject): WorkCardProject {
  return {
    slug: p.slug,
    title: p.title,
    industry: p.industry,
    category: p.category,
    short_description: p.short_description,
    cover_image: p.cover_image,
    services_provided: Array.isArray(p.services_provided) ? (p.services_provided as string[]) : [],
    technologies: Array.isArray(p.technologies) ? (p.technologies as string[]) : [],
  };
}

export default async function WorkPage() {
  const supabase = createServerSupabase();
  const { data: projects } = await supabase
    .from('projects')
    .select('id, slug, title, industry, category, short_description, cover_image, services_provided, technologies')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('sort_order')
    .order('created_at', { ascending: false });

  const all = (projects ?? []) as unknown as DbProject[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Work', path: '/work' }])) }}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="Selected work"
          title="Real Products. Real Businesses. Real Engineering."
          description="We don't just design screens. We build digital systems designed to solve real business problems."
        />

        {all.length === 0 ? (
          <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
            <h2 className="font-semibold text-textMain">Case studies coming soon</h2>
            <p className="mt-2 text-sm text-textMuted">
              We&apos;re writing up recent projects. Want to see what we can build for you?{' '}
              <a href="/contact" className="text-primary underline-offset-4 hover:underline">
                Get in touch
              </a>
              .
            </p>
          </div>
        ) : (
          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
            {all.map((p, i) => (
              <StaggerItem key={p.id} className="h-full">
                <WorkCard project={toCard(p)} priority={i < 2} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </section>
    </>
  );
}
