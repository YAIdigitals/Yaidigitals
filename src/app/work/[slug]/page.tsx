import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { breadcrumbJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';

export const dynamicParams = true;

interface DbProject {
  id: number;
  slug: string;
  title: string;
  client_business?: string | null;
  website_url?: string | null;
  category?: string | null;
  industry?: string | null;
  status?: string | null;
  short_description?: string | null;
  description?: string | null;
  problem?: string | null;
  solution?: string | null;
  key_features?: unknown;
  services_provided?: unknown;
  technologies?: unknown;
  architecture_overview?: string | null;
  development_approach?: string | null;
  outcome?: string | null;
  cover_image?: string | null;
  logo_url?: string | null;
  screenshots?: unknown;
  cta_text?: string | null;
  cta_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  updated_at?: string | null;
}

async function getProject(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as DbProject | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project || project.status === 'draft') {
    return { title: 'Project Not Found', robots: { index: false, follow: false } };
  }

  const title = project.seo_title || `${project.title} Case Study | YAIdigitals`;
  const description = project.seo_description || project.short_description || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.og_title || title,
      description: project.og_description || description,
      url: `/work/${project.slug}`,
      type: 'article',
      images: project.og_image || project.cover_image ? [{ url: project.og_image || (project.cover_image as string) }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.og_title || title,
      description: project.og_description || description,
    },
  };
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]).filter((v) => typeof v === 'string') : [];
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="mt-14">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-2xl font-bold tracking-tight text-textMain">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project || project.status === 'draft') notFound();

  const keyFeatures = list(project.key_features);
  const services = list(project.services_provided);
  const technologies = list(project.technologies);
  const screenshots = list(project.screenshots);

  // Related services pages for contextual internal linking
  const serviceSlugMap: Record<string, string> = {
    'Web Application Development': '/services/web-application-development',
    'Website Development': '/services/website-development',
    'Mobile App Development': '/services/mobile-app-development',
    'Custom Software': '/services/custom-software',
    'E-commerce & Marketplaces': '/services/ecommerce',
    'AI Calling Agents': '/services/ai-calling-agents',
    'AI & Business Automation': '/services/ai-automation',
  };

  // Next project link
  const supabase = createServerSupabase();
  const { data: nextRows } = await supabase
    .from('projects')
    .select('slug, title')
    .eq('status', 'published')
    .neq('slug', project.slug)
    .order('sort_order')
    .limit(1);
  const nextProject = (nextRows ?? [])[0];
  const heroHeading =
    project.title + (project.client_business && project.client_business !== project.title ? ` — ${project.client_business}` : '');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Work', path: '/work' },
              { name: project.title, path: `/work/${project.slug}` },
            ])
          ),
        }}
      />

      {/* ── Project hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-14">
          <Link
            href="/work"
            className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
          >
            <ArrowLeft
              size={15}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
            All work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.industry && (
              <span className="rounded-md border border-border bg-bgCard px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-textMuted">
                {project.industry}
              </span>
            )}
            {project.category && (
              <span className="rounded-md border border-border bg-bgCard px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-textMuted">
                {project.category}
              </span>
            )}
          </div>

          <AnimatedHeading
            as="h1"
            className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-textMain leading-[1.15] sm:text-4xl"
          >
            {heroHeading}
          </AnimatedHeading>

          {project.short_description && (
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-textMuted">
                {project.short_description}
              </p>
            </Reveal>
          )}

          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-4">
              {project.cta_url && project.cta_text && (
                <a
                  href={project.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
                >
                  {project.cta_text}
                  <ExternalLink
                    size={15}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </a>
              )}
              <MagneticButton href="/contact" variant="outline">
                Build Something Similar
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* ── Summary ──────────────────────────────────────────── */}
        {project.description && (
          <Reveal>
            <div className="rounded-2xl border border-border bg-bgCard p-6 sm:p-8">
              <p className="eyebrow mb-3">Project summary</p>
              <p className="text-lg leading-relaxed text-textMuted">{project.description}</p>
              <dl className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                {project.client_business && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-textMuted">Client</dt>
                    <dd className="mt-1 text-sm font-medium text-textMain">{project.client_business}</dd>
                  </div>
                )}
                {project.industry && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-textMuted">Industry</dt>
                    <dd className="mt-1 text-sm font-medium text-textMain">{project.industry}</dd>
                  </div>
                )}
                {project.website_url && (
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-textMuted">Website</dt>
                    <dd className="mt-1 text-sm font-medium">
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {new URL(project.website_url).hostname}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        )}

        {/* ── Challenge ────────────────────────────────────────── */}
        {project.problem && (
          <Section eyebrow="The challenge" title="What needed to change">
            <p className="leading-relaxed text-textMuted">{project.problem}</p>
          </Section>
        )}

        {/* ── Solution ─────────────────────────────────────────── */}
        {project.solution && (
          <Section eyebrow="The solution" title="What we built">
            <p className="leading-relaxed text-textMuted">{project.solution}</p>
          </Section>
        )}

        {/* ── Screenshots ──────────────────────────────────────── */}
        {screenshots.length > 0 && (
          <Section eyebrow="Screenshots" title="The product">
            <div className="grid gap-5 sm:grid-cols-2">
              {screenshots.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-xl border border-border bg-bgDark object-cover"
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── Key capabilities ─────────────────────────────────── */}
        {keyFeatures.length > 0 && (
          <Section eyebrow="Key capabilities" title="What the platform does">
            <ul className="grid gap-3 sm:grid-cols-2">
              {keyFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-bgCard p-4 text-sm text-textMuted"
                >
                  <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Technology ───────────────────────────────────────── */}
        {technologies.length > 0 && (
          <Section eyebrow="Technology" title="Built with">
            <ul className="flex flex-wrap gap-2.5">
              {technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-lg border border-border bg-bgCard px-3.5 py-1.5 text-sm text-textMain"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Architecture / approach ──────────────────────────── */}
        {(project.architecture_overview || project.development_approach) && (
          <Section eyebrow="Engineering" title="How it was built">
            {project.architecture_overview && (
              <p className="leading-relaxed text-textMuted">{project.architecture_overview}</p>
            )}
            {project.development_approach && (
              <p className="mt-4 leading-relaxed text-textMuted">{project.development_approach}</p>
            )}
          </Section>
        )}

        {/* ── Outcome ──────────────────────────────────────────── */}
        {project.outcome && (
          <Section eyebrow="Outcome" title="Where it stands">
            <p className="leading-relaxed text-textMuted">{project.outcome}</p>
          </Section>
        )}

        {/* ── Related services ─────────────────────────────────── */}
        {services.length > 0 && (
          <Section eyebrow="Related services" title="How we can help you build something similar">
            <ul className="flex flex-wrap gap-3">
              {services.map((s) => (
                <li key={s}>
                  {serviceSlugMap[s] ? (
                    <Link
                      href={serviceSlugMap[s]}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bgCard px-4 py-2 text-sm text-textMain transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {s}
                      <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="inline-flex rounded-lg border border-border bg-bgCard px-4 py-2 text-sm text-textMain">
                      {s}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Next project + CTA ───────────────────────────────── */}
        <Reveal>
          <div className="mt-16 flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className="group text-sm text-textMuted transition-colors hover:text-primary"
              >
                Next case study:{' '}
                <span className="font-semibold text-textMain group-hover:text-primary">
                  {nextProject.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primaryDark"
            >
              Build Something Similar
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
