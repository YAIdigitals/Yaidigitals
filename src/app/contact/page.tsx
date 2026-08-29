import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { getSettingsBundle } from '@/lib/settings';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Contact — Start Your Project',
  description:
    'Tell us about the product, website, software or automation you are planning. YAIdigitals will help you understand the next technical steps.',
  path: '/contact',
});

export default async function ContactPage() {
  const { site } = await getSettingsBundle();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])) }}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's Build Something Useful."
          description="Tell us about the product, website, software or automation you're planning. Share as much detail as you can and we'll help you understand the next technical steps."
        />

        <Reveal delay={0.15}>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail size={16} strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="text-sm text-textMuted">
              Prefer email? Write to{' '}
              <a href={`mailto:${site.contact_email}`} className="font-medium text-textMain underline-offset-4 hover:underline">
                {site.contact_email}
              </a>{' '}
              and we&apos;ll respond within one business day.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 rounded-xl border border-border bg-bgCard p-6 sm:p-8 shadow-card">
          <ContactForm contactEmail={site.contact_email} />
        </div>
      </section>
    </>
  );
}
