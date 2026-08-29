import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, ChevronDown, PhoneCall } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import { getSettingsBundle } from '@/lib/settings';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { WorkCard, type WorkCardProject } from '@/components/cards/WorkCard';
import { HeroVisual } from '@/components/visuals/HeroVisual';
import { AICallVisual } from '@/components/visuals/AICallVisual';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'YAIdigitals | Apps, Software, Websites & AI Solutions',
  description:
    'YAIdigitals designs and develops mobile apps, web applications, business websites, custom software and AI-powered solutions for growing businesses.',
  path: '',
});

const FAQS = [
  {
    q: 'What does YAIdigitals build?',
    a: 'We build mobile apps (Android, iOS and cross-platform), business and e-commerce websites, custom web applications, admin dashboards, and AI calling agents that handle customer calls, lead qualification and appointment booking.',
  },
  {
    q: 'How does a project get started?',
    a: 'Send us a brief through the contact form describing your goal, timeline and budget range. We respond with a scoped proposal covering deliverables, milestones and pricing before any work begins.',
  },
  {
    q: 'Can an AI calling agent integrate with my tools?',
    a: 'Where supported, yes — our AI calling agents can work alongside CRMs and calendars, log call summaries, and escalate complex conversations to a human on your team.',
  },
  {
    q: 'Who owns the software you build?',
    a: 'You do. Code, database and infrastructure are yours — there is no lock-in, though most clients continue with us for support and iteration.',
  },
];

const PROCESS = [
  { step: '01', title: 'Discover', body: 'We understand your business, customers, workflows, objectives and technical requirements.' },
  { step: '02', title: 'Plan', body: 'We define the product structure, features, user journeys and technical architecture.' },
  { step: '03', title: 'Design', body: 'We create interfaces focused on clarity, usability and consistent brand experiences.' },
  { step: '04', title: 'Build', body: 'Our development process turns approved designs and requirements into reliable digital products.' },
  { step: '05', title: 'Test', body: 'Functionality, responsiveness, usability and critical workflows are tested before release.' },
  { step: '06', title: 'Launch', body: 'We prepare the product for production and configure the required deployment infrastructure.' },
  { step: '07', title: 'Improve', body: 'Digital products evolve. We can continue supporting improvements, optimization and new features after launch.' },
];

const WHY_US = [
  {
    title: 'Business-First Thinking',
    body: 'Technology should solve a business problem. We start by understanding what needs to work before deciding what needs to be built.',
  },
  {
    title: 'End-to-End Development',
    body: 'Strategy, interface design, development, deployment and ongoing improvement can be handled through one technology partner.',
  },
  {
    title: 'Built for Growth',
    body: "We design systems with future requirements in mind so today's solution does not unnecessarily restrict tomorrow's growth.",
  },
  {
    title: 'Clear Communication',
    body: 'Clear requirements, defined scope and transparent communication help keep projects focused and predictable.',
  },
];

const AI_CAPABILITIES = [
  '24/7 call handling',
  'Lead qualification',
  'Appointment workflows',
  'Common customer enquiries',
  'Call summaries',
  'Human escalation',
  'CRM/workflow integration',
];

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

interface DbPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  published_at?: string | null;
}

interface DbTestimonial {
  id: number;
  client_name: string;
  client_role?: string | null;
  company?: string | null;
  quote: string;
  rating?: number | null;
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-textMuted">
      <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

export default async function Home() {
  const supabase = createServerSupabase();
  const [{ homepage }, { data: projects }, { data: services }, { data: industries }, { data: technologies }, { data: testimonials }, { data: posts }] =
    await Promise.all([
      getSettingsBundle(),
      supabase.from('projects').select('id, slug, title, industry, category, short_description, cover_image, services_provided, technologies').eq('status', 'published').eq('featured', true).order('sort_order').limit(2),
      supabase.from('services').select('*').eq('active', true).eq('featured', true).order('sort_order'),
      supabase.from('industries').select('slug, name, short_description, icon, image_url').eq('published', true).order('sort_order'),
      supabase.from('technologies').select('name, category, website_url').eq('active', true).order('sort_order'),
      supabase.from('testimonials').select('id, client_name, client_role, company, quote, rating').eq('published', true).order('sort_order').limit(3),
      supabase.from('blog_posts').select('id, slug, title, excerpt, published_at, created_at').eq('status', 'published').order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }).limit(3),
    ]);

  const section = (key: string) => homepage.sections.find((s) => s.key === key);
  const enabled = (key: string) => section(key)?.enabled ?? true;
  const head = (key: string) => section(key);

  const featuredProjects = (projects ?? []) as unknown as DbProject[];
  const toWorkCard = (p: DbProject): WorkCardProject => ({
    slug: p.slug,
    title: p.title,
    industry: p.industry,
    category: p.category,
    short_description: p.short_description,
    cover_image: p.cover_image,
    services_provided: Array.isArray(p.services_provided) ? (p.services_provided as string[]) : [],
    technologies: Array.isArray(p.technologies) ? (p.technologies as string[]) : [],
  });

  const techGroups = (technologies ?? []).reduce<Record<string, { name: string; website_url: string | null }[]>>((acc, t) => {
    const cat = t.category || 'Other';
    (acc[cat] ??= []).push(t);
    return acc;
  }, {});

  const faqSection = head('faq');

  return (
    <>
      {faqSection?.enabled && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {homepage.hero.badge}
              </p>
            </Reveal>

            <AnimatedHeading
              as="h1"
              delay={0.1}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-textMain leading-[1.12]"
            >
              {homepage.hero.heading}
            </AnimatedHeading>

            <Reveal delay={0.2}>
              <p className="mt-4 text-lg font-medium text-primary">{homepage.hero.highlighted}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-3 text-lg text-textMuted max-w-xl leading-relaxed">
                {homepage.hero.description}
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton href={homepage.hero.primary_cta_url || '/contact'}>
                  {homepage.hero.primary_cta_text}
                </MagneticButton>
                <MagneticButton href={homepage.hero.secondary_cta_url || '/work'} variant="outline">
                  {homepage.hero.secondary_cta_text}
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <p className="mt-10 text-sm text-textMuted">{homepage.hero.below_cta}</p>
            </Reveal>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── Selected work ────────────────────────────────────── */}
      {enabled('work') && featuredProjects.length > 0 && (
        <section aria-labelledby="work-heading" className="border-t border-border bg-bgCard/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={head('work')?.eyebrow}
                title={head('work')?.title ?? 'Selected Work'}
                description={head('work')?.description}
              />
              <Reveal>
                <Link href="/work" className="group inline-flex items-center gap-1.5 pb-1 text-sm font-medium text-primary hover:text-primaryDark">
                  View all work
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
            <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
              {featuredProjects.map((p, i) => (
                <StaggerItem key={p.id} className="h-full">
                  <WorkCard project={toWorkCard(p)} priority={i === 0} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Services ─────────────────────────────────────────── */}
      {enabled('services') && (services ?? []).length > 0 && (
        <section aria-labelledby="services-heading" className="border-t border-border bg-bgDark">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('services')?.eyebrow}
              title={head('services')?.title ?? 'What We Build'}
              description={head('services')?.description}
            />
            <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(services ?? []).map((service) => (
                <StaggerItem key={service.id} className="h-full">
                  <ServiceCard service={service} />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Reveal className="mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primaryDark"
              >
                Explore all services
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Industries ───────────────────────────────────────── */}
      {enabled('industries') && (industries ?? []).length > 0 && (
        <section aria-labelledby="industries-heading" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('industries')?.eyebrow}
              title={head('industries')?.title ?? 'Industries'}
              description={head('industries')?.description}
              align="center"
            />
            <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(industries ?? []).map((ind) => (
                <StaggerItem key={ind.slug} className="h-full">
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-bgCard p-5 transition-colors duration-300 hover:border-primary/40"
                  >
                    {ind.icon && (
                      <span aria-hidden="true" className="mb-3 text-2xl">
                        {ind.icon}
                      </span>
                    )}
                    <h3 className="font-semibold text-textMain">{ind.name}</h3>
                    {ind.short_description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{ind.short_description}</p>
                    )}
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── AI calling agents ────────────────────────────────── */}
      {enabled('ai-calling') && (
        <section aria-labelledby="ai-heading" className="overflow-x-clip border-t border-border bg-bgCard/40">
          <div className="mx-auto max-w-6xl px-6 py-20 space-y-14">
            <SectionHeading
              eyebrow={head('ai-calling')?.eyebrow}
              title={head('ai-calling')?.title ?? 'AI Calling Agents'}
              description={head('ai-calling')?.description}
              align="center"
            />
            <AICallVisual />
            <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:justify-center">
              <ul className="mx-auto grid max-w-md gap-x-8 gap-y-3 sm:grid-cols-2 lg:mx-0">
                {AI_CAPABILITIES.map((c) => (
                  <CheckItem key={c}>{c}</CheckItem>
                ))}
              </ul>
              <Reveal className="text-center lg:text-left">
                <MagneticButton href="/services/ai-calling-agents">
                  Explore AI Calling Agents
                  <PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
                </MagneticButton>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ── Technology ───────────────────────────────────────── */}
      {enabled('technology') && (technologies ?? []).length > 0 && (
        <section aria-labelledby="tech-heading" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('technology')?.eyebrow}
              title={head('technology')?.title ?? 'Technology'}
              description={head('technology')?.description}
              align="center"
            />
            <div className="mt-12 space-y-8">
              {Object.entries(techGroups).map(([category, items]) => (
                <Reveal key={category}>
                  <div className="rounded-xl border border-border bg-bgCard p-6">
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
                      {category}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2.5">
                      {items.map((t) => (
                        <li
                          key={t.name}
                          className="rounded-lg border border-border bg-bgDark px-3.5 py-1.5 text-sm text-textMain"
                        >
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ──────────────────────────────────────────── */}
      {enabled('process') && (
        <section aria-labelledby="process-heading" className="border-t border-border bg-bgCard/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('process')?.eyebrow}
              title={head('process')?.title ?? 'How We Work'}
              description={head('process')?.description}
            />
            <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((p) => (
                <StaggerItem key={p.step}>
                  <div className="h-full rounded-xl border border-border bg-bgCard p-6 relative overflow-hidden transition-colors duration-300 hover:border-primary/30">
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 -top-3 select-none text-6xl font-bold text-white/4"
                    >
                      {p.step}
                    </span>
                    <span className="eyebrow">{p.step}</span>
                    <h3 className="mt-3 font-semibold text-textMain">{p.title}</h3>
                    <p className="mt-2 text-sm text-textMuted leading-relaxed">{p.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Why YAIdigitals ──────────────────────────────────── */}
      {enabled('why') && (
        <section aria-labelledby="why-heading" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('why')?.eyebrow}
              title={head('why')?.title ?? 'Why YAIdigitals'}
              description={head('why')?.description}
            />
            <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2">
              {WHY_US.map((w) => (
                <StaggerItem key={w.title}>
                  <div className="h-full rounded-xl border border-border bg-bgCard p-6 transition-colors duration-300 hover:border-primary/30">
                    <h3 className="font-semibold text-textMain">{w.title}</h3>
                    <p className="mt-2 text-sm text-textMuted leading-relaxed">{w.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Testimonials (only when verified ones exist) ─────── */}
      {enabled('testimonials') && (testimonials ?? []).length > 0 && (
        <section aria-labelledby="testimonials-heading" className="border-t border-border bg-bgCard/40">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionHeading
              eyebrow={head('testimonials')?.eyebrow}
              title={head('testimonials')?.title ?? 'Testimonials'}
              description={head('testimonials')?.description}
              align="center"
            />
            <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
              {(testimonials as DbTestimonial[]).map((t) => (
                <StaggerItem key={t.id} className="h-full">
                  <figure className="flex h-full flex-col rounded-xl border border-border bg-bgCard p-6">
                    <blockquote className="flex-1 text-sm leading-relaxed text-textMuted">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 border-t border-border pt-4">
                      <p className="font-semibold text-textMain">{t.client_name}</p>
                      <p className="text-xs text-textMuted">
                        {[t.client_role, t.company].filter(Boolean).join(', ')}
                      </p>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── Insights ─────────────────────────────────────────── */}
      {enabled('insights') && (posts ?? []).length > 0 && (
        <section aria-labelledby="insights-heading" className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                eyebrow={head('insights')?.eyebrow}
                title={head('insights')?.title ?? 'Insights'}
                description={head('insights')?.description}
              />
              <Reveal>
                <Link href="/insights" className="group inline-flex items-center gap-1.5 pb-1 text-sm font-medium text-primary hover:text-primaryDark">
                  All insights
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
            <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
              {(posts as DbPost[]).map((post) => (
                <StaggerItem key={post.id} className="h-full">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-bgCard p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
                  >
                    <h3 className="font-semibold leading-snug text-textMain">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-textMuted">{post.excerpt}</p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-primary group-hover:text-primaryDark">
                      Read article
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faqSection?.enabled && (
        <section aria-labelledby="faq-heading" className="border-t border-border bg-bgCard/40">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <SectionHeading eyebrow={faqSection.eyebrow} title={faqSection.title} />
            <div className="mt-10 space-y-3">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.04}>
                  <details className="group rounded-xl border border-border bg-bgCard transition-colors open:border-primary/35">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium text-textMain [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 text-primary transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                      />
                    </summary>
                    <p className="px-6 pb-5 text-sm text-textMuted leading-relaxed">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section aria-labelledby="cta-heading" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-bgCard px-6 py-16 text-center shadow-card">
              <div aria-hidden="true" className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black_20%,transparent_70%)]" />
              <div aria-hidden="true" className="absolute inset-x-0 -bottom-24 h-48 bg-hero-glow" />
              <div className="relative">
                <AnimatedHeading
                  as="h2"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-textMain"
                >
                  Have an Idea Worth Building?
                </AnimatedHeading>
                <p className="mx-auto mt-3 max-w-xl text-textMuted">
                  Tell us what you&apos;re trying to create, improve or automate. We&apos;ll help you determine the right technical approach.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <MagneticButton href="/contact">Start Your Project</MagneticButton>
                  <MagneticButton href="/work" variant="outline">View Our Work</MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
