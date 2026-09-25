import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import type { ServiceRecord } from '@/lib/types';

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: 'Development Services: Web, Apps, Software & AI',
  description:
    'Explore YAIdigitals services for websites, mobile apps, web applications, custom software, AI agents, automation and e-commerce platforms.',
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
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'YAIdigitals Development Services',
            description:
              'Mobile app development, web applications, website development, custom software, AI calling agents, AI automation and e-commerce platforms.',
            path: '/services',
            type: 'CollectionPage',
          }),
          breadcrumbJsonLd([{ name: 'Services', path: '/services' }]),
        ]}
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
