/* eslint-disable @next/next/no-html-link-for-pages -- Footer links do not need client-side routing or prefetching. */
import type { SiteSettings } from '@/lib/settings';
import { BrandLogo } from '@/components/BrandLogo';
import { whatsappUrl, WHATSAPP_DISPLAY_NUMBER } from '@/lib/whatsapp';

const SERVICE_LINKS = [
  { href: '/services/mobile-app-development', label: 'Mobile Apps' },
  { href: '/services/website-development', label: 'Web Development' },
  { href: '/services/custom-software', label: 'Custom Software' },
  { href: '/services/ai-calling-agents', label: 'AI Calling Agents' },
  { href: '/services/ai-automation', label: 'AI Automation' },
  { href: '/services/ecommerce', label: 'E-commerce' },
  { href: '/services/startup-mvp-development', label: 'Startup MVPs' },
  { href: '/services/maintenance-support', label: 'Maintenance & Support' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/insights', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
  { href: '/industries', label: 'Industries' },
];

const PRODUCT_LINKS = [
  { href: '/store', label: 'Digital Products' },
  { href: '/courses', label: 'Courses' },
  { href: '/creator-resources', label: 'Creator Resources' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-conditions', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

export default function Footer({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear();
  const socials = [
    { href: site.social.instagram, label: 'Instagram', shortLabel: 'IG' },
    { href: site.social.facebook, label: 'Facebook', shortLabel: 'FB' },
    { href: site.social.twitter, label: 'Twitter / X', shortLabel: 'X' },
    { href: site.social.linkedin, label: 'LinkedIn', shortLabel: 'IN' },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-16 border-t border-border bg-bgDark">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-xs space-y-4">
            <a href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              <BrandLogo className="w-[158px]" />
            </a>
            <p className="text-sm leading-relaxed text-textMuted">
              {site.footer_description || 'Technology built around your business.'}
            </p>
            {site.contact_email && (
              <p className="text-sm text-textMuted">
                Email:{' '}
                <a
                  href={`mailto:${site.contact_email}`}
                  className="text-textMain underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {site.contact_email}
                </a>
              </p>
            )}
            <p className="text-sm text-textMuted">
              WhatsApp:{' '}
              <a
                href={whatsappUrl('the website footer')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textMain underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {WHATSAPP_DISPLAY_NUMBER}
              </a>
            </p>
            {socials.length > 0 && (
              <div className="flex gap-2 pt-1">
                {socials.map(({ href, label, shortLabel }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.company_name} on ${label} (${shortLabel})`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-textMuted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <span aria-hidden="true" className="text-[10px] font-bold tracking-wide">
                      {shortLabel}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Services" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Services</h2>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Company</h2>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Products</h2>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Legal</h2>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-center text-sm text-textMuted">
            © {year} <span className="text-textMain">YAIdigitals</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
