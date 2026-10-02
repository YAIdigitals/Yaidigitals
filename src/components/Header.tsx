/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids shipping a client router in the global header. */
import { ChevronDown, Menu, MessageCircle, X } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { whatsappUrl } from '@/lib/whatsapp';

const SERVICE_LINKS = [
  { href: '/services/website-development', label: 'Website Development', desc: 'Fast, conversion-focused sites' },
  { href: '/services/web-application-development', label: 'Web Applications', desc: 'Systems built around workflows' },
  { href: '/services/mobile-app-development', label: 'Mobile App Development', desc: 'Android, iOS & cross-platform' },
  { href: '/services/custom-software', label: 'Custom Software', desc: 'Tools built around your process' },
  { href: '/services/ai-calling-agents', label: 'AI Calling Agents', desc: '24/7 voice agents for your business' },
  { href: '/services/ai-automation', label: 'AI & Business Automation', desc: 'Streamline repetitive workflows' },
  { href: '/services/ecommerce', label: 'E-commerce & Marketplaces', desc: 'Commerce platforms that sell' },
  { href: '/services/startup-mvp-development', label: 'Startup MVP Development', desc: 'Validate and launch with focus' },
  { href: '/services/maintenance-support', label: 'Maintenance & Support', desc: 'Keep digital products reliable' },
] as const;

const PRODUCT_LINKS = [
  { href: '/store', label: 'Digital Products', desc: 'Instant-delivery assets' },
  { href: '/courses', label: 'Courses', desc: 'Practical tech & content skills' },
  { href: '/creator-resources', label: 'Creator Resources', desc: 'Content tools and practical guides' },
] as const;

const COMPANY_LINKS = [
  { href: '/about', label: 'About', desc: 'Who we are and how we think' },
  { href: '/contact', label: 'Contact', desc: 'Start a conversation' },
] as const;

const MAIN_LINKS = [
  { href: '/industries', label: 'Industries' },
  { href: '/work', label: 'Work' },
  { href: '/insights', label: 'Insights' },
] as const;

type MenuLink = { href: string; label: string; desc?: string };

function DesktopMenu({ label, links, footer }: { label: string; links: readonly MenuLink[]; footer?: MenuLink }) {
  const twoColumns = label === 'Services';
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-textMuted transition-colors hover:text-textMain [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown aria-hidden="true" size={14} strokeWidth={2} className="transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="absolute left-0 top-full z-20 w-[26rem] pt-3">
        <div className="rounded-xl border border-border bg-bgCard p-2 shadow-card">
          <div className={`grid gap-1 ${twoColumns ? 'grid-cols-2' : ''}`}>
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 outline-none transition-colors hover:bg-white/4 focus-visible:bg-white/4">
                <span className="block text-sm font-medium text-textMain">{link.label}</span>
                {link.desc && <span className="mt-0.5 block text-xs text-textMuted">{link.desc}</span>}
              </a>
            ))}
          </div>
          {footer && (
            <a href={footer.href} className="mt-1 flex items-center justify-between rounded-lg border-t border-border px-3 py-2.5 text-sm text-primary hover:text-primaryDark">
              {footer.label}<span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </details>
  );
}

export default function Header({ company = 'YAIdigitals' }: { company?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bgDark/95 lg:bg-bgDark/85 lg:backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex min-h-11 items-center" aria-label={`${company} — home`}>
            <BrandLogo priority className="w-[146px] sm:w-[162px]" />
          </a>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <DesktopMenu label="Services" links={SERVICE_LINKS} footer={{ href: '/services', label: 'All services' }} />
            {MAIN_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-textMuted transition-colors hover:text-textMain">
                {link.label}
              </a>
            ))}
            <DesktopMenu label="Products" links={PRODUCT_LINKS} />
            <DesktopMenu label="Company" links={COMPANY_LINKS} />
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={whatsappUrl()}
              data-whatsapp-link
              data-analytics-event="cta_whatsapp_click"
              data-analytics-placement="header"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with YAIdigitals on WhatsApp"
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-border text-textMuted transition-colors hover:border-primary/40 hover:text-primary xl:inline-flex"
            >
              <MessageCircle size={18} aria-hidden="true" />
            </a>
            <a
              href="/contact"
              data-analytics-event="cta_project_click"
              data-analytics-placement="header"
              className="hidden items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-bgDark transition-colors hover:bg-primaryDark hover:shadow-glow-sm active:translate-y-px sm:inline-flex"
            >
              Start a Project
            </a>

            <details className="group lg:hidden">
              <summary
                aria-label="Toggle navigation menu"
                className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-border text-textMuted transition-colors hover:border-primary/40 hover:text-textMain [&::-webkit-details-marker]:hidden"
              >
                <Menu size={20} strokeWidth={2} aria-hidden="true" className="group-open:hidden" />
                <X size={20} strokeWidth={2} aria-hidden="true" className="hidden group-open:block" />
              </summary>
              <nav aria-label="Mobile" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain border-b border-border bg-bgDark/98">
                <div className="space-y-1 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
                  <p className="px-3 pb-1 pt-3 text-xs uppercase tracking-wider text-textMuted">Services</p>
                  {SERVICE_LINKS.map((link) => (
                    <a key={link.href} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm text-textMuted transition-colors hover:bg-bgCard hover:text-textMain">
                      {link.label}
                    </a>
                  ))}
                  <a href="/services" className="block rounded-lg px-3 py-2.5 text-sm text-primary hover:text-primaryDark">All services →</a>

                  <p className="px-3 pb-1 pt-4 text-xs uppercase tracking-wider text-textMuted">Company</p>
                  {[...MAIN_LINKS, ...COMPANY_LINKS].map((link) => (
                    <a key={link.href} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm text-textMuted transition-colors hover:bg-bgCard hover:text-textMain">
                      {link.label}
                    </a>
                  ))}

                  <p className="px-3 pb-1 pt-4 text-xs uppercase tracking-wider text-textMuted">Products</p>
                  {PRODUCT_LINKS.map((link) => (
                    <a key={link.href} href={link.href} className="block rounded-lg px-3 py-2.5 text-sm text-textMuted transition-colors hover:bg-bgCard hover:text-textMain">
                      {link.label}
                    </a>
                  ))}

                  <div className="pt-4">
                    <a href="/contact" data-analytics-event="cta_project_click" data-analytics-placement="mobile_menu" className="block rounded-lg bg-primary px-4 py-3 text-center font-semibold text-bgDark transition-colors hover:bg-primaryDark">
                      Start a Project
                    </a>
                    <a href={whatsappUrl()} data-whatsapp-link data-analytics-event="cta_whatsapp_click" data-analytics-placement="mobile_menu" target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-primary/40 px-4 py-3 text-center font-medium text-primary">
                      <MessageCircle size={18} aria-hidden="true" /> WhatsApp us
                    </a>
                  </div>
                </div>
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
