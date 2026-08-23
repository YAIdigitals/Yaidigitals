import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import type { ServiceRecord } from '@/lib/types';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Services — Apps, Websites, AI Agents & Custom Software',
  description:
    'Explore YAIdigitals services: mobile app development, website and e-commerce builds, AI calling agents, AI automation and custom software — scoped before work begins.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  const supabase = createServerSupabase();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Services"
        title="What we build for you"
        description="Comprehensive technology solutions across the full lifecycle of digital product development — each with a defined process and deliverables."
      />
      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(services ?? []).map((service) => (
          <StaggerItem key={service.id} className="h-full">
            <ServiceCard service={service as unknown as ServiceRecord} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
