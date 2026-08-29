import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import type { ServiceRecord } from '@/lib/types';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Services — Apps, Websites, AI Agents & Custom Software',
  description:
    'Explore YAIdigitals services: mobile app development, web applications, website development, custom software, AI calling agents, AI automation and e-commerce platforms.',
  path: '/services',
});

export default async function ServicesPage() {
  const supabase = createServerSupabase();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Services', path: '/services' }])) }}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="What we build"
          title="Technology Built Around Your Business"
          description="From an initial idea to production deployment, YAIdigitals helps businesses design, build and scale digital products — each engagement scoped before work begins."
        />
        <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service as unknown as ServiceRecord} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </>
  );
}
