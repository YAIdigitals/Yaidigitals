import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { buildMetadata, breadcrumbJsonLd, metaDescription, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Reveal } from '@/components/motion/Reveal';

export const dynamicParams = true;
export const revalidate = 300;

interface DbIndustry {
  slug: string;
  name: string;
  icon?: string | null;
  image_url?: string | null;
  short_description?: string | null;
  long_description?: string | null;
  services?: unknown;
  seo_title?: string | null;
  seo_description?: string | null;
}

const SERVICE_MAP: Record<string, { label: string; href: string }> = {
  'E-commerce & Marketplaces': { label: 'E-commerce & Marketplaces', href: '/services/ecommerce' },
  'Web Application Development': { label: 'Web Application Development', href: '/services/web-application-development' },
  'Website Development': { label: 'Website Development', href: '/services/website-development' },
  'Mobile App Development': { label: 'Mobile App Development', href: '/services/mobile-app-development' },
  'Custom Software': { label: 'Custom Software', href: '/services/custom-software' },
  'AI Calling Agents': { label: 'AI Calling Agents', href: '/services/ai-calling-agents' },
  'AI & Business Automation': { label: 'AI & Business Automation', href: '/services/ai-automation' },
};

async function getIndustry(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('industries')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  return (data ?? null) as DbIndustry | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry || !industry.name) {
    return { title: 'Industry Not Found' };
  }
  return buildMetadata({
    title: industry.seo_title || `${industry.name} Technology Solutions`,
    description: metaDescription(
      industry.seo_description,
      industry.long_description,
      industry.short_description,
      `How YAIdigitals builds technology for ${industry.name.toLowerCase()} businesses.`
    ),
    path: `/industries/${industry.slug}`,
    image: industry.image_url || '',
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  if (!industry || !industry.name) notFound();

  const services = Array.isArray(industry.services)
    ? (industry.services as string[]).filter((s) => SERVICE_MAP[s])
    : [];

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: `${industry.name} Technology Solutions`,
            description: industry.short_description || undefined,
            path: `/industries/${industry.slug}`,
          }),
            breadcrumbJsonLd([
              { name: 'Industries', path: '/industries' },
              { name: industry.name, path: `/industries/${industry.slug}` },
            ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-4xl px-6 pt-12 pb-14">
          <Breadcrumbs
            items={[
              { name: 'Industries', href: '/industries' },
              { name: industry.name },
            ]}
          />

          <div className="mt-8">
            {industry.icon && (
              <span aria-hidden="true" className="mb-5 block text-4xl">
                {industry.icon}
              </span>
            )}
            <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-textMain sm:text-4xl">
              {industry.name}
            </h1>
            {industry.short_description && (
              <Reveal delay={0.15}>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-textMuted">
                  {industry.short_description}
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-14">
        {industry.long_description && (
          <Reveal>
            <p className="text-lg leading-relaxed text-textMuted">{industry.long_description}</p>
          </Reveal>
        )}

        {services.length > 0 && (
          <Reveal>
            <section aria-labelledby="industry-services" className="mt-12">
              <h2 id="industry-services" className="text-2xl font-bold tracking-tight text-textMain">
                How we help {industry.name.toLowerCase()} businesses
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {services.map((s) => (
                  <li key={s}>
                    <Link
                      href={SERVICE_MAP[s].href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bgCard px-4 py-2 text-sm text-textMain transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {SERVICE_MAP[s].label}
                      <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

        <Reveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bgCard p-8 shadow-card">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-textMain">
                Building something for {industry.name.toLowerCase()}?
              </h2>
              <p className="mt-1 text-sm text-textMuted">
                Tell us about your project — we&apos;ll help you determine the right technical approach.
              </p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-bgDark shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
            >
              Start a Project
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
