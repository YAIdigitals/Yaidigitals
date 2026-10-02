import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import {
  buildMetadata,
  breadcrumbJsonLd,
  faqPageJsonLd,
  metaDescription,
  serviceJsonLd,
  webPageJsonLd,
} from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/motion/Reveal';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { AnalyticsEvent } from '@/components/AnalyticsEvent';
import { whatsappUrl } from '@/lib/whatsapp';

export const dynamicParams = true;
export const revalidate = 300;

const SEO_TITLES: Record<string, string> = {
  'website-development': 'Website Development Company',
  'web-application-development': 'Web Application Development Company',
  'mobile-app-development': 'Mobile App Development Company',
  'custom-software': 'Custom Software Development',
  'ai-calling-agents': 'AI Calling Agents for Business',
  'ai-automation': 'AI Automation Solutions',
  ecommerce: 'E-commerce Development Company',
  'startup-mvp-development': 'Startup MVP Development Company',
  'maintenance-support': 'Website & App Maintenance Support',
};

const RELATED_SERVICE_SLUGS: Record<string, string[]> = {
  'website-development': ['web-application-development', 'ecommerce', 'custom-software'],
  'web-application-development': ['custom-software', 'mobile-app-development', 'ai-automation'],
  'mobile-app-development': ['web-application-development', 'custom-software', 'ecommerce'],
  'custom-software': ['web-application-development', 'ai-automation', 'mobile-app-development'],
  'ai-calling-agents': ['ai-automation', 'custom-software', 'web-application-development'],
  'ai-automation': ['ai-calling-agents', 'custom-software', 'web-application-development'],
  ecommerce: ['website-development', 'web-application-development', 'mobile-app-development'],
  'startup-mvp-development': ['web-application-development', 'mobile-app-development', 'custom-software'],
  'maintenance-support': ['website-development', 'web-application-development', 'custom-software'],
};

interface DbService {
  slug: string;
  title: string;
  hero_title?: string | null;
  hero_image?: string | null;
  short_description?: string | null;
  full_content?: string | null;
  icon?: string | null;
  features?: unknown;
  process?: unknown;
  faqs?: unknown;
  related_project_slugs?: unknown;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
}

interface DbProject {
  slug: string;
  title: string;
  industry?: string | null;
  short_description?: string | null;
  cover_image?: string | null;
}

interface RelatedService {
  slug: string;
  title: string;
  short_description?: string | null;
}

async function getService(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  return (data ?? null) as DbService | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) {
    return { title: 'Service Not Found' };
  }
  return buildMetadata({
    title: service.seo_title || SEO_TITLES[service.slug] || service.title,
    absoluteTitle: Boolean(service.seo_title?.includes('YAIdigitals')),
    description: metaDescription(service.seo_description, service.short_description),
    path: `/services/${service.slug}`,
    image: service.og_image || service.hero_image || '',
  });
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]).filter((v) => typeof v === 'string') : [];
}

interface ProcessStep {
  step?: string;
  body?: string;
}
interface Faq {
  q?: string;
  a?: string;
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const features = list(service.features);
  const process = (Array.isArray(service.process) ? service.process : []) as ProcessStep[];
  const faqs = (Array.isArray(service.faqs) ? service.faqs : []).filter(
    (f): f is Faq & { q: string; a: string } => Boolean(f?.q && f?.a)
  );
  const relatedSlugs = list(service.related_project_slugs);
  const relatedServiceSlugs = RELATED_SERVICE_SLUGS[service.slug] ?? [];

  const supabase = createServerSupabase();
  let relatedServices: RelatedService[] = [];
  if (relatedServiceSlugs.length > 0) {
    const { data: serviceRows } = await supabase
      .from('services')
      .select('slug, title, short_description')
      .eq('active', true)
      .in('slug', relatedServiceSlugs);
    relatedServices = ((serviceRows ?? []) as RelatedService[]).sort(
      (a, b) => relatedServiceSlugs.indexOf(a.slug) - relatedServiceSlugs.indexOf(b.slug)
    );
  }

  let relatedProjects: DbProject[] = [];
  if (relatedSlugs.length > 0) {
    const { data } = await supabase
      .from('projects')
      .select('slug, title, industry, short_description, cover_image')
      .eq('status', 'published')
      .in('slug', relatedSlugs);
    relatedProjects = (data ?? []) as DbProject[];
  }

  const h1 = service.hero_title || service.title;

  return (
    <>
      <AnalyticsEvent name="service_view" context={service.slug} />
      <JsonLd
        data={[
          webPageJsonLd({
            name: h1,
            description: service.short_description || undefined,
            path: `/services/${service.slug}`,
          }),
            breadcrumbJsonLd([
              { name: 'Services', path: '/services' },
              { name: service.title, path: `/services/${service.slug}` },
            ]),
            serviceJsonLd({
              title: h1,
              description: service.short_description || '',
              slug: service.slug,
              features,
            }),
            ...(faqs.length ? [faqPageJsonLd(faqs)] : []),
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-4xl px-6 pt-12 pb-14">
          <Breadcrumbs
            items={[
              { name: 'Services', href: '/services' },
              { name: service.title },
            ]}
          />

          <div className="mt-8">
            {service.icon && (
              <div
                aria-hidden="true"
                className="mb-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-bgCard text-2xl"
              >
                {typeof service.icon === 'string' && service.icon.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.icon} alt="" className="h-7 w-7 object-contain" loading="eager" decoding="async" />
                ) : (
                  <span>{String(service.icon).substring(0, 1).toUpperCase()}</span>
                )}
              </div>
            )}
            <AnimatedHeading
              as="h1"
              className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-textMain sm:text-4xl"
            >
              {h1}
            </AnimatedHeading>
            {service.short_description && (
              <Reveal delay={0.15}>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-textMuted">
                  {service.short_description}
                </p>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href={`/contact?service=${encodeURIComponent(service.slug)}`} analyticsEvent="cta_project_click" analyticsPlacement="service_hero">Discuss Your Project</MagneticButton>
              <a href={whatsappUrl(`${service.title} service page`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-primary/35 px-5 py-3 text-sm font-medium text-primary hover:border-primary">
                <MessageCircle size={17} aria-hidden="true" /> Ask on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-14">
        {/* ── Capabilities ─────────────────────────────────────── */}
        {features.length > 0 && (
          <Reveal>
            <section aria-labelledby="capabilities-heading" className="rounded-2xl border border-border bg-bgCard p-6 sm:p-8">
              <h2 id="capabilities-heading" className="text-xl font-bold text-textMain">
                What we deliver
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-lg border border-border bg-bgDark p-4 text-sm text-textMuted"
                  >
                    <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

        {/* ── Body content ─────────────────────────────────────── */}
        {service.full_content && (
          <div className="mt-12 space-y-5 text-base leading-relaxed text-textMuted">
            {String(service.full_content)
              .split(/\n{2,}/)
              .map((block, i) =>
                block.startsWith('## ') ? (
                  <h2 key={i} className="mt-10 text-2xl font-semibold text-textMain">
                    {block.slice(3)}
                  </h2>
                ) : (
                  <p key={i}>{block}</p>
                )
              )}
          </div>
        )}

        {/* ── Process ──────────────────────────────────────────── */}
        {process.length > 0 && (
          <Reveal>
            <section aria-labelledby="process-heading" className="mt-14">
              <p className="eyebrow mb-2">How we work</p>
              <h2 className="text-2xl font-bold tracking-tight text-textMain">Our process</h2>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2">
                {process.map((p, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl border border-border bg-bgCard p-5">
                    <span aria-hidden="true" className="text-lg font-bold leading-none text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-semibold text-textMain">{p.step}</h3>
                      {p.body && <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{p.body}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>
        )}

        {/* ── FAQs ─────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <Reveal>
            <section aria-labelledby="faq-heading" className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-textMain">
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-3">
                {faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-xl border border-border bg-bgCard transition-colors open:border-primary/35"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium text-textMain [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ArrowLeft
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 rotate-90 text-primary transition-transform duration-300 group-open:-rotate-90 motion-reduce:transition-none"
                      />
                    </summary>
                    <p className="px-6 pb-5 text-sm leading-relaxed text-textMuted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── Related work ─────────────────────────────────────── */}
        {relatedProjects.length > 0 && (
          <Reveal>
            <section aria-labelledby="related-heading" className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-textMain">Related work</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-bgDark bg-grid-faint bg-grid">
                      {p.cover_image?.startsWith('/') ? (
                        <Image
                          src={p.cover_image}
                          alt={`${p.title} — ${p.industry || 'case study'}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : p.cover_image ? (
                        // Transitional fallback for CMS records created before media was localised.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover_image} alt={`${p.title} — ${p.industry || 'case study'}`} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-grid-faint bg-grid">
                          <span aria-hidden="true" className="text-primary/30">
                            {p.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-textMain">{p.title}</h3>
                      {p.short_description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">
                          {p.short_description}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-primary group-hover:text-primaryDark">
                        View case study
                        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {relatedServices.length > 0 && (
          <Reveal>
            <section aria-labelledby="related-services-heading" className="mt-14">
              <h2 id="related-services-heading" className="text-2xl font-bold tracking-tight text-textMain">
                Related services
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {relatedServices.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/services/${related.slug}`}
                    className="group rounded-xl border border-border bg-bgCard p-5 transition-colors hover:border-primary/40"
                  >
                    <h3 className="font-semibold text-textMain">{related.title}</h3>
                    {related.short_description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-textMuted">
                        {related.short_description}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary group-hover:text-primaryDark">
                      Explore service
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bgCard p-8 shadow-card">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-textMain">Discuss Your Project</h2>
              <p className="mt-1 text-sm text-textMuted">
                Tell us about your project — you&apos;ll receive a scoped proposal with deliverables and pricing.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-bgDark shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
            >
              Start a Project
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
