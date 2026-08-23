import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/motion/Reveal';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Contact — Start Your Project',
  description:
    'Get in touch with YAIdigitals to discuss your technology project. We build websites, mobile apps, AI calling agents, AI automation and custom software.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Tell us what you want to build"
        description="Share your goal, timeline and budget range — you'll receive a scoped proposal with deliverables and pricing before any work begins."
      />

      <Reveal delay={0.15}>
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-bgCard px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail size={16} strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="text-sm text-textMuted">
            Prefer email? Write to{' '}
            <a href="mailto:info@yaidigitals.com" className="font-medium text-textMain underline-offset-4 hover:underline">
              info@yaidigitals.com
            </a>{' '}
            and we&apos;ll respond within one business day.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 rounded-xl border border-border bg-bgCard p-6 sm:p-8 shadow-card">
        <ContactForm />
      </div>
    </section>
  );
}
