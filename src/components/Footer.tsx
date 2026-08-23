import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const SERVICE_LINKS = [
  { href: '/services/website-development', label: 'Website Development' },
  { href: '/services/mobile-app-development', label: 'Mobile App Development' },
  { href: '/services/ai-calling-agents', label: 'AI Calling Agents' },
  { href: '/services/ai-automation', label: 'AI Automation' },
  { href: '/services/custom-software', label: 'Custom Software' },
  { href: '/services/ecommerce', label: 'E-commerce Development' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Our Work' },
  { href: '/courses', label: 'Courses' },
  { href: '/store', label: 'Digital Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-conditions', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com/yaidigitals_', label: 'Instagram', Icon: Instagram },
  { href: 'https://facebook.com/yaidigitals', label: 'Facebook', Icon: Facebook },
  { href: 'https://twitter.com/yaidigitals', label: 'Twitter / X', Icon: Twitter },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bgDark">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          <div className="max-w-xs space-y-4">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-textMain">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
              YAIdigitals
            </Link>
            <p className="text-sm leading-relaxed text-textMuted">
              A technology company building mobile apps, websites, AI calling agents and instant-delivery
              digital products.
            </p>
            <p className="text-sm text-textMuted">
              Email:{' '}
              <a href="mailto:info@yaidigitals.com" className="text-textMain underline-offset-4 transition-colors hover:text-primary hover:underline">
                info@yaidigitals.com
              </a>
            </p>
            <div className="flex gap-2 pt-1">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`YAIdigitals on ${label}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-textMuted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Services" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Services</h2>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Company</h2>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal" className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-textMain">Resources</h2>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-textMuted transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 sm:flex-row">
          <p className="text-center text-sm text-textMuted">
            © {new Date().getFullYear()} YAIdigitals. All rights reserved.
          </p>
          <p className="text-sm text-textMuted">Built with Next.js · Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
