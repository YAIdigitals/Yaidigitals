import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import type { ProjectRecord } from '@/lib/types';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Our Work — Projects & Case Studies',
  description:
    'Explore YAIdigitals projects across website development, app development, AI automation and custom software.',
  alternates: { canonical: '/projects' },
};

interface DbProject {
  id: number;
  slug: string;
  title: string;
  client_business?: string | null;
  category?: string | null;
  description?: string | null;
  screenshots?: unknown;
  featured?: boolean;
  completion_date?: string | null;
}

export default async function ProjectsPage() {
  const supabase = createServerSupabase();
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  const all = (projects ?? []) as unknown as DbProject[];
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);

  const toCard = (p: DbProject): ProjectRecord => {
    const shots = Array.isArray(p.screenshots) ? p.screenshots : [];
    const firstShot = shots.find((s): s is string => typeof s === 'string');
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      short_description: p.description,
      tags: p.category ? [p.category] : [],
      cover_image: firstShot ?? null,
    };
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Our work"
        title="Projects that shipped and delivered"
        description="A selection of the products we've built for clients across industries — each scoped, built and launched by our team."
      />

      {all.length === 0 ? (
        <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
          <h2 className="font-semibold text-textMain">Case studies coming soon</h2>
          <p className="mt-2 text-sm text-textMuted">
            We&apos;re writing up recent projects. Want to see what we can build for you?{' '}
            <Link href="/contact" className="text-primary underline-offset-4 hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-5 text-xl font-bold text-textMain">Featured projects</h2>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((p) => (
                  <StaggerItem key={p.id} className="h-full">
                    <ProjectCard project={toCard(p)} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}

          {rest.length > 0 && (
            <div className={featured.length > 0 ? 'mt-14 border-t border-border pt-12' : 'mt-12'}>
              <h2 className={`mb-5 text-xl font-bold text-textMain ${featured.length > 0 ? '' : 'sr-only'}`}>
                All projects
              </h2>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <StaggerItem key={p.id} className="h-full">
                    <ProjectCard project={toCard(p)} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}
        </>
      )}
    </section>
  );
}
