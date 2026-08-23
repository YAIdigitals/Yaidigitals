import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { generateServiceMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDollarSign } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';

export const dynamicParams = true;

async function getService(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('services').select('*').eq('slug', slug).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getService(params.slug);
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
    };
  }
  return generateServiceMetadata(service);
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug);
  if (!service) notFound();

  const features = Array.isArray(service.features) ? (service.features as string[]) : [];

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <Reveal>
        <Link
          href="/services"
          className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
          All services
        </Link>
      </Reveal>

      <header className="mt-8">
        {service.icon && (
          <div aria-hidden="true" className="mb-5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-bgCard text-2xl">
            {typeof service.icon === 'string' && service.icon.startsWith('http') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.icon} alt="" className="h-7 w-7 object-contain" loading="eager" decoding="async" />
            ) : (
              <span>{String(service.icon).substring(0, 1).toUpperCase()}</span>
            )}
          </div>
        )}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-textMain sm:text-4xl">
          {service.title}
        </h1>
        {service.short_description && (
          <p className="mt-4 max-w-2xl leading-relaxed text-textMuted">{service.short_description}</p>
        )}
      </header>

      {features.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-textMain">What&apos;s included</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-lg border border-border bg-bgCard p-4 text-sm text-textMuted">
                <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {service.full_content && (
        <div className="mt-12 space-y-5 text-base leading-relaxed text-textMuted [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline">
          {String(service.full_content)
            .split(/\n{2,}/)
            .map((block, i) =>
              block.startsWith('## ') ? (
                <h2 key={i} className="mt-10 text-xl font-semibold text-textMain">
                  {block.slice(3)}
                </h2>
              ) : (
                <p key={i}>{block}</p>
              )
            )}
        </div>
      )}

      {service.pricing_info && (
        <Reveal className="mt-12">
          <div className="flex items-start gap-4 rounded-xl border border-primary/25 bg-primary/8 p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CircleDollarSign size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-textMain">Pricing</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-textMuted">
                Pricing is tailored to your specific project requirements. You&apos;ll receive a scoped proposal with
                deliverables and a fixed price before any work begins.
              </p>
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bgCard p-8 shadow-card">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-textMain">Ready to get started?</h2>
            <p className="mt-1 text-sm text-textMuted">
              Tell us about your project — we respond within one business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
          >
            Start a Project
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
