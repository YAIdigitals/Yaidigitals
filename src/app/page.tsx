import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe2,
  MessageSquareText,
  PhoneCall,
  Smartphone,
} from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import { Reveal } from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { ProductCard } from '@/components/cards/ProductCard';
import { HeroVisual } from '@/components/visuals/HeroVisual';
import { MobileAppMockup } from '@/components/visuals/MobileAppMockup';
import { BrowserMockup } from '@/components/visuals/BrowserMockup';
import { AICallVisual } from '@/components/visuals/AICallVisual';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'YAIdigitals — App, Website & AI Automation Development',
  description:
    'We build mobile apps, high-performance websites and AI calling agents for growing businesses. Browse instant-delivery digital products and practical tech courses.',
  alternates: { canonical: '/' },
};

const FAQS = [
  {
    q: 'What does YAIdigitals build?',
    a: 'We build mobile apps (Android, iOS and cross-platform), business and e-commerce websites, custom web applications, admin dashboards, and AI calling agents that handle customer calls, lead qualification and appointment booking.',
  },
  {
    q: 'How does a project get started?',
    a: 'Send us a brief through the contact form describing your goal, timeline and budget range. We respond with a scoped proposal covering deliverables, milestones and pricing before any work begins.',
  },
  {
    q: 'How are digital products delivered?',
    a: 'Every product in our store is delivered digitally. After checkout you receive access or download instructions right away — nothing ships physically.',
  },
  {
    q: 'Can an AI calling agent integrate with my tools?',
    a: 'Where supported, yes — our AI calling agents can work alongside CRMs and calendars, log call summaries, and escalate complex conversations to a human on your team.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const CAPABILITIES = ['Mobile Apps', 'Websites', 'AI Calling Agents', 'Custom Software', 'Digital Products'];

const WHY_US = [
  {
    title: 'End-to-end delivery',
    body: 'One team handles strategy, design, development and launch — no coordinating between separate agencies for the app, the website and the automation.',
  },
  {
    title: 'Business-first engineering',
    body: 'We start from the outcome you need — more qualified leads, faster support, a store that sells — then choose the technology that gets there.',
  },
  {
    title: 'Products, not promises',
    body: 'We run our own digital-products store and course platform, so we understand firsthand what it takes to ship and sell software.',
  },
  {
    title: 'Clear scope, clear pricing',
    body: 'Every engagement starts with a written proposal: deliverables, milestones and price agreed before development begins.',
  },
];

const PROCESS = [
  { step: '01', title: 'Discover', body: 'A short call or brief to map your goal, users and constraints.' },
  { step: '02', title: 'Scope', body: 'A written proposal with deliverables, timeline and fixed pricing.' },
  { step: '03', title: 'Build', body: 'Iterative development with previews at every milestone.' },
  { step: '04', title: 'Launch & support', body: 'Deployment, handover documentation and ongoing support options.' },
];

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-textMuted">
      <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}

export default async function Home() {
  const supabase = createServerSupabase();
  const [{ data: services }, { data: products }] = await Promise.all([
    supabase.from('services').select('*').eq('active', true).order('sort_order'),
    supabase.from('products').select('*').eq('active', true).order('sort_order').limit(3),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-hero-glow" />
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping motion-reduce:hidden" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Technology company for growing businesses
              </p>
            </Reveal>

            <AnimatedHeading
              as="h1"
              delay={0.1}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-textMain leading-[1.12]"
            >
              Apps, websites &amp; AI calling agents that move businesses forward
            </AnimatedHeading>

            <Reveal delay={0.25}>
              <p className="mt-5 text-lg text-textMuted max-w-xl leading-relaxed">
                YAIdigitals designs and builds the software your business needs — from cross-platform mobile
                apps and high-performance websites to AI agents that answer and qualify customer calls.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton href="/contact">Start a Project</MagneticButton>
                <MagneticButton href="/store" variant="outline">
                  Browse Digital Products
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
                {CAPABILITIES.map((c) => (
                  <CheckItem key={c}>{c}</CheckItem>
                ))}
              </ul>
            </Reveal>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section aria-labelledby="services-heading" className="border-t border-border bg-bgDark">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Services"
            title="What we build"
            description="Focused services, each with a defined process and deliverables — scoped before work begins."
          />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── App development ──────────────────────────────────── */}
      <section aria-labelledby="app-heading" className="overflow-x-clip border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="App development"
              title="Mobile apps your customers actually keep"
              description="Cross-platform Android and iOS apps with the polish of native builds — designed around real user journeys, not templates."
            />
            <Reveal delay={0.15}>
              <ul className="mt-8 space-y-3">
                <CheckItem>Android, iOS &amp; cross-platform releases</CheckItem>
                <CheckItem>Admin dashboards and analytics included</CheckItem>
                <CheckItem>Store submission handled end-to-end</CheckItem>
              </ul>
            </Reveal>
            <Reveal delay={0.25}>
              <Link
                href="/services/mobile-app-development"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primaryDark"
              >
                Explore app development
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <MobileAppMockup />
        </div>
      </section>

      {/* ── Website development ──────────────────────────────── */}
      <section aria-labelledby="web-heading" className="border-t border-border bg-bgCard/40">
        <div className="mx-auto max-w-6xl px-6 py-20 space-y-14">
          <SectionHeading
            eyebrow="Website development"
            title="Websites that load fast and convert faster"
            description="Marketing sites, e-commerce stores and web applications engineered for speed, search visibility and measurable results."
            align="center"
          />
          <BrowserMockup />
          <StaggerGroup className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: <Globe2 size={18} strokeWidth={1.75} aria-hidden="true" />,
                title: 'Responsive by default',
                body: 'Every layout is built mobile-first and tested across devices before launch.',
              },
              {
                icon: <MessageSquareText size={18} strokeWidth={1.75} aria-hidden="true" />,
                title: 'Content you control',
                body: 'Manage products, posts and pages yourself — no developer needed for daily edits.',
              },
              {
                icon: <Smartphone size={18} strokeWidth={1.75} aria-hidden="true" />,
                title: 'Performance budgets',
                body: 'Fast load times and clean Core Web Vitals treated as requirements, not extras.',
              },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="h-full rounded-xl border border-border bg-bgCard p-6 transition-colors duration-300 hover:border-primary/30">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {f.icon}
                  </span>
                  <h3 className="font-semibold text-textMain">{f.title}</h3>
                  <p className="mt-2 text-sm text-textMuted leading-relaxed">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── AI calling agents ────────────────────────────────── */}
      <section aria-labelledby="ai-heading" className="overflow-x-clip border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 space-y-14">
          <SectionHeading
            eyebrow="AI calling agents"
            title="AI calling agents that never miss a call"
            description="A voice agent that answers around the clock, qualifies leads and books appointments — escalating complex conversations to your team with a full summary."
            align="center"
          />
          <AICallVisual />
          <Reveal className="text-center">
            <MagneticButton href="/services/ai-calling-agents">
              Explore AI Calling
              <PhoneCall size={16} strokeWidth={2} aria-hidden="true" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ── Why YAIdigitals ──────────────────────────────────── */}
      <section aria-labelledby="why-heading" className="border-t border-border bg-bgCard/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading eyebrow="Why us" title="Why teams choose YAIdigitals" />
          <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2">
            {WHY_US.map((w) => (
              <StaggerItem key={w.title}>
                <div className="h-full rounded-xl border border-border bg-bgCard p-6 transition-colors duration-300 hover:border-primary/30">
                  <h3 className="font-semibold text-textMain">{w.title}</h3>
                  <p className="mt-2 text-sm text-textMuted leading-relaxed">{w.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Featured products ────────────────────────────────── */}
      <section aria-labelledby="products-heading" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Store"
              title="Instant-delivery digital products"
              description="Ready-to-use content bundles from our own store — checkout online, download immediately."
            />
            <Reveal>
              <Link href="/store" className="group inline-flex items-center gap-1.5 pb-1 text-sm font-medium text-primary hover:text-primaryDark">
                View all products
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(products ?? []).map((p) => (
              <StaggerItem key={p.id} className="h-full">
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGroup>
          <Reveal>
            <p className="mt-8 text-sm text-textMuted">
              Prefer structured learning?{' '}
              <Link href="/courses" className="text-primary underline-offset-4 hover:underline">
                Explore our courses
              </Link>{' '}
              on short-form content, editing and AI automation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section aria-labelledby="process-heading" className="border-t border-border bg-bgCard/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Process"
            title="How we work"
            description="A simple, transparent process from first message to launch."
          />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <StaggerItem key={p.step}>
                <div className="h-full rounded-xl border border-border bg-bgCard p-6 relative overflow-hidden transition-colors duration-300 hover:border-primary/30">
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-3 select-none text-6xl font-bold text-white/4"
                  >
                    {p.step}
                  </span>
                  <span className="eyebrow">{p.step}</span>
                  <h3 className="mt-3 font-semibold text-textMain">{p.title}</h3>
                  <p className="mt-2 text-sm text-textMuted leading-relaxed">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section aria-labelledby="faq-heading" className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <details className="group rounded-xl border border-border bg-bgCard transition-colors open:border-primary/35">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium text-textMain [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown
                      size={17}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="shrink-0 text-primary transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                    />
                  </summary>
                  <p className="px-6 pb-5 text-sm text-textMuted leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section aria-labelledby="cta-heading" className="border-t border-border bg-bgCard/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-bgCard px-6 py-16 text-center shadow-card">
              <div aria-hidden="true" className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black_20%,transparent_70%)]" />
              <div aria-hidden="true" className="absolute inset-x-0 -bottom-24 h-48 bg-hero-glow" />
              <div className="relative">
                <AnimatedHeading
                  as="h2"
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-textMain"
                >
                  Have a project in mind?
                </AnimatedHeading>
                <p className="mx-auto mt-3 max-w-xl text-textMuted">
                  Tell us what you want to build. You&apos;ll get a scoped proposal with deliverables and pricing — no obligation.
                </p>
                <div className="mt-8">
                  <MagneticButton href="/contact">Start a Project</MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
