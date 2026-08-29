import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'About — Technology Company for Growing Businesses',
  description:
    'YAIdigitals is a technology company focused on designing and developing digital products that help businesses operate, connect with customers and grow.',
  path: '/about',
});

const WHAT_WE_BUILD = [
  { label: 'Mobile applications' },
  { label: 'Web applications' },
  { label: 'Business websites' },
  { label: 'Custom software' },
  { label: 'AI calling agents' },
  { label: 'AI automation' },
  { label: 'E-commerce' },
  { label: 'Marketplace platforms' },
];

interface DbProject {
  slug: string;
  title: string;
  industry?: string | null;
  short_description?: string | null;
}

export default async function AboutPage() {
  const supabase = createServerSupabase();
  const { data: projects } = await supabase
    .from('projects')
    .select('slug, title, industry, short_description')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order')
    .limit(2);
  const featured = (projects ?? []) as unknown as DbProject[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'About', path: '/about' }])) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="About YAIdigitals"
          title="We Build Technology Around Real Business Problems."
          description="YAIdigitals is a technology company focused on designing and developing digital products that help businesses operate, connect with customers and grow."
        />

        <Reveal delay={0.15}>
          <p className="mt-8 leading-relaxed text-textMuted">
            Our work spans websites, web applications, mobile experiences, custom software and
            AI-powered automation. Rather than forcing every business into the same template, we
            approach each project around its users, workflows and objectives.
          </p>
        </Reveal>

        {/* What we believe */}
        <Reveal delay={0.2}>
          <div className="mt-14 rounded-2xl border border-border bg-bgCard p-6 sm:p-8">
            <h2 className="text-xl font-bold text-textMain">What we believe</h2>
            <p className="mt-3 font-medium text-textMain">
              Useful technology begins with understanding the problem.
            </p>
            <p className="mt-3 leading-relaxed text-textMuted">
              A beautiful interface alone does not make a successful digital product. The underlying
              workflows, performance, reliability and user experience matter just as much.
            </p>
            <p className="mt-3 leading-relaxed text-textMuted">
              That&apos;s why our process connects business thinking with design and engineering.
            </p>
          </div>
        </Reveal>

        {/* What we do */}
        <Reveal delay={0.25}>
          <h2 className="mt-14 text-2xl font-bold text-textMain">What we do</h2>
        </Reveal>
        <StaggerGroup className="mt-6 grid gap-3 sm:grid-cols-2">
          {WHAT_WE_BUILD.map((item) => (
            <StaggerItem key={item.label}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4 transition-colors duration-300 hover:border-primary/30">
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-sm font-medium text-textMain">{item.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* How we work */}
        <Reveal delay={0.25}>
          <h2 className="mt-14 text-2xl font-bold text-textMain">How we work</h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            Understand → Plan → Design → Build → Test → Launch → Improve
          </p>
          <p className="mt-3 leading-relaxed text-textMuted">
            Every project starts with the business requirement and moves through a structured
            process — with working previews along the way, so there are no big reveals and no
            surprises at launch.
          </p>
        </Reveal>

        {/* Our work */}
        {featured.length > 0 && (
          <>
            <Reveal delay={0.25}>
              <h2 className="mt-14 text-2xl font-bold text-textMain">Our work</h2>
              <p className="mt-3 leading-relaxed text-textMuted">
                The clearest evidence of how we work is what we have shipped.
              </p>
            </Reveal>
            <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-2">
              {featured.map((p) => (
                <StaggerItem key={p.slug}>
                  <Link
                    href={`/work/${p.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-bgCard p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-textMain">{p.title}</h3>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 text-textMuted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                      />
                    </div>
                    {p.industry && <p className="mt-1 text-xs text-textMuted">{p.industry}</p>}
                    {p.short_description && (
                      <p className="mt-3 text-sm leading-relaxed text-textMuted">{p.short_description}</p>
                    )}
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Reveal delay={0.3}>
              <Link
                href="/work"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primaryDark"
              >
                Explore Our Work
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </>
        )}

        {/* CTA */}
        <Reveal delay={0.3}>
          <div className="mt-16 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bgCard p-8 shadow-card">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-textMain">Work With YAIdigitals</h2>
              <p className="mt-1 text-sm text-textMuted">
                Tell us what you&apos;re building — we&apos;ll help you determine the right technical approach.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
            >
              Start a Project
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
