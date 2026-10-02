import type { Metadata } from 'next';
import { Clock3, Mail, MessageCircle, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';
import { getSettingsBundle } from '@/lib/settings';
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { whatsappUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp';

export const revalidate = 300;

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
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'Contact YAIdigitals',
            description:
              'Tell us about the product, website, software or automation you are planning.',
            path: '/contact',
            type: 'ContactPage',
          }),
          breadcrumbJsonLd([{ name: 'Contact', path: '/contact' }]),
        ]}
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's Build Something Useful."
          description="Tell us about the product, website, software or automation you're planning. Share as much detail as you can and we'll help you understand the next technical steps."
        />

        <Reveal delay={0.15}>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <a href={whatsappUrl('the contact page')} target="_blank" rel="noopener noreferrer" className="flex min-h-20 items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 transition hover:border-primary/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><MessageCircle size={18} aria-hidden="true" /></span>
              <span><span className="block text-sm font-semibold text-textMain">WhatsApp</span><span className="text-xs text-textMuted">{WHATSAPP_DISPLAY_NUMBER}</span></span>
            </a>
            <a href={`mailto:${site.contact_email}`} className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4 transition hover:border-primary/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Mail size={18} aria-hidden="true" /></span>
              <span><span className="block text-sm font-semibold text-textMain">Email</span><span className="text-xs text-textMuted">{site.contact_email}</span></span>
            </a>
            <a href="tel:+916006107923" className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4 transition hover:border-primary/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Phone size={18} aria-hidden="true" /></span>
              <span><span className="block text-sm font-semibold text-textMain">Call</span><span className="text-xs text-textMuted">{WHATSAPP_DISPLAY_NUMBER}</span></span>
            </a>
            <div className="flex min-h-20 items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock3 size={18} aria-hidden="true" /></span>
              <span><span className="block text-sm font-semibold text-textMain">Response time</span><span className="text-xs text-textMuted">Within one business day</span></span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 rounded-xl border border-border bg-bgCard p-6 sm:p-8 shadow-card">
          <ContactForm contactEmail={site.contact_email} />
        </div>
      </section>
    </>
  );
}
