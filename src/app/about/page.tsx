import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'YAIdigitals is a technology company building websites, mobile apps, AI automation, custom software and digital products that move businesses forward.',
  alternates: { canonical: '/about' },
};

const WHAT_WE_BUILD = [
  {
    title: 'Website Development',
    body: 'Business websites, corporate websites, e-commerce platforms and custom web applications.',
  },
  {
    title: 'Mobile App Development',
    body: 'Android and iOS apps, cross-platform applications, customer-facing apps and admin panels.',
  },
  {
    title: 'AI Automation',
    body: 'Workflow automation, AI calling agents, chatbots, WhatsApp automation and CRM automation.',
  },
  {
    title: 'Custom Software',
    body: 'Tailored business tools, internal systems and specialized software solutions.',
  },
];

const WHY = [
  {
    title: 'Technical Excellence',
    body: 'Experienced developers who stay current with modern technologies and best practices.',
  },
  {
    title: 'Business-Focused Solutions',
    body: "We don't just build technology — we build solutions that address real business challenges and deliver measurable results.",
  },
  {
    title: 'Quality & Reliability',
    body: 'Rigorous testing and quality assurance processes ensure our solutions are reliable and performant.',
  },
  {
    title: 'Ongoing Support',
    body: "Our relationship doesn't end at launch. We provide ongoing support and maintenance for long-term success.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="About"
        title="A technology company built around business outcomes"
        description="YAIdigitals builds digital products that move businesses forward — spanning website development, mobile app development, AI automation, custom software and instant-delivery digital products."
      />

      <Reveal delay={0.15}>
        <div className="mt-12 rounded-xl border border-border bg-bgCard p-6 sm:p-8">
          <h2 className="text-xl font-bold text-textMain">Our mission</h2>
          <p className="mt-3 leading-relaxed text-textMuted">
            To empower businesses with cutting-edge technology that drives growth, efficiency and
            innovation.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <h2 className="mt-14 text-2xl font-bold text-textMain">Our approach</h2>
        <p className="mt-3 leading-relaxed text-textMuted">
          We combine technical expertise with business acumen to deliver solutions that don&apos;t just
          work but deliver measurable results. Our process focuses on understanding your unique challenges
          and crafting tailored solutions around them.
        </p>
      </Reveal>

      <Reveal delay={0.25}>
        <h2 className="mt-14 text-2xl font-bold text-textMain">What we build</h2>
      </Reveal>
      <StaggerGroup className="mt-6 grid gap-5 md:grid-cols-2">
        {WHAT_WE_BUILD.map((item) => (
          <StaggerItem key={item.title}>
            <div className="h-full rounded-xl border border-border bg-bgCard p-6 transition-colors duration-300 hover:border-primary/30">
              <h3 className="font-semibold text-textMain">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textMuted">{item.body}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.25}>
        <h2 className="mt-14 text-2xl font-bold text-textMain">Why choose YAIdigitals</h2>
      </Reveal>
      <StaggerGroup className="mt-6 space-y-4">
        {WHY.map((item, i) => (
          <StaggerItem key={item.title}>
            <div className="flex items-start gap-4 rounded-xl border border-border bg-bgCard p-5 transition-colors duration-300 hover:border-primary/30">
              <span aria-hidden="true" className="text-2xl font-bold leading-none text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-semibold text-textMain">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{item.body}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.3}>
        <Link
          href="/contact"
          className="group mt-14 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
        >
          Start a Project
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </Link>
      </Reveal>
    </section>
  );
}
