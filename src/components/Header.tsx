'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { EASE } from '@/lib/motion';
import { useSmoothScroll } from '@/components/motion/SmoothScrollProvider';

const SERVICE_LINKS = [
  { href: '/services/website-development', label: 'Website Development', desc: 'Fast, conversion-focused sites' },
  { href: '/services/web-application-development', label: 'Web Applications', desc: 'Systems built around workflows' },
  { href: '/services/mobile-app-development', label: 'Mobile App Development', desc: 'Android, iOS & cross-platform' },
  { href: '/services/custom-software', label: 'Custom Software', desc: 'Tools built around your process' },
  { href: '/services/ai-calling-agents', label: 'AI Calling Agents', desc: '24/7 voice agents for your business' },
  { href: '/services/ai-automation', label: 'AI & Business Automation', desc: 'Streamline repetitive workflows' },
  { href: '/services/ecommerce', label: 'E-commerce & Marketplaces', desc: 'Commerce platforms that sell' },
] as const;

const PRODUCT_LINKS = [
  { href: '/store', label: 'Digital Products', desc: 'Instant-delivery assets' },
  { href: '/courses', label: 'Courses', desc: 'Practical tech & content skills' },
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

export default function Header({ company = 'YAIdigitals' }: { company?: string }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();

  const [openMenu, setOpenMenu] = useState<'services' | 'products' | 'company' | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  /* Close dropdown on outside click / Escape */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenu(null);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  /* Close route-aware UI whenever navigation happens */
  useEffect(() => {
    setOpenMenu(null);
    setIsMobileOpen(false);
  }, [pathname]);

  /* Mobile menu: lock body scroll + Lenis, manage focus */
  useEffect(() => {
    if (!isMobileOpen) return;
    stopScroll();
    const prevOverflow = document.body.style.overflow;
    const toggleButton = toggleButtonRef.current;
    document.body.style.overflow = 'hidden';

    const firstLink = mobilePanelRef.current?.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();

    return () => {
      startScroll();
      document.body.style.overflow = prevOverflow;
      toggleButton?.focus();
    };
  }, [isMobileOpen, stopScroll, startScroll]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const hoverProps = (key: 'services' | 'products' | 'company') => ({
    onMouseEnter: () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      setOpenMenu(key);
    },
    onMouseLeave: () => {
      closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), 150);
    },
  });

  const renderDropdown = (key: 'services' | 'products' | 'company', links: readonly { href: string; label: string; desc?: string }[], footer?: { href: string; label: string }) => {
    const isOpen = openMenu === key;
    const twoCol = key === 'services';
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${key}-menu`}
            initial={reduceMotion ? false : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            {...hoverProps(key)}
            className="absolute left-0 top-full pt-2 z-20 w-[26rem]"
          >
            <div className="rounded-xl border border-border bg-bgCard shadow-card p-2">
              <div className={cn('grid gap-1', twoCol && 'grid-cols-2')}>
                {links.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group rounded-lg px-3 py-2.5 transition-colors hover:bg-white/4 focus-visible:bg-white/4 outline-none"
                  >
                    <span className="block text-sm font-medium text-textMain">{s.label}</span>
                    {s.desc && <span className="mt-0.5 block text-xs text-textMuted">{s.desc}</span>}
                  </Link>
                ))}
              </div>
              {footer && (
                <Link
                  href={footer.href}
                  className="mt-1 flex items-center justify-between rounded-lg border-t border-border px-3 py-2.5 text-sm text-primary hover:text-primaryDark"
                >
                  {footer.label}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const dropdownTrigger = (key: 'services' | 'products' | 'company', label: string) => {
    const isOpen = openMenu === key;
    const active =
      (key === 'services' && pathname.startsWith('/services')) ||
      (key === 'products' && (pathname.startsWith('/store') || pathname.startsWith('/courses'))) ||
      (key === 'company' && (pathname.startsWith('/about') || pathname.startsWith('/contact')));
    return (
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${key}-menu`}
        aria-haspopup="true"
        onClick={() => setOpenMenu(isOpen ? null : key)}
        className={cn(
          'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isOpen || active ? 'text-textMain' : 'text-textMuted hover:text-textMain'
        )}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden="true"
          className={cn('transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bgDark/85 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            aria-label={`${company} — home`}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary shadow-glow-sm" />
            <span>
              <span className="text-primary">YAI</span>
              <span className="text-textMain">digitals</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:flex lg:items-center lg:gap-1" ref={desktopNavRef}>
            <div className="relative" {...hoverProps('services')}>
              {dropdownTrigger('services', 'Services')}
              {renderDropdown('services', SERVICE_LINKS, { href: '/services', label: 'All services' })}
            </div>

            {MAIN_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(l.href) ? 'text-textMain' : 'text-textMuted hover:text-textMain'
                )}
              >
                {l.label}
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-px h-px bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className="relative" {...hoverProps('products')}>
              {dropdownTrigger('products', 'Products')}
              {renderDropdown('products', PRODUCT_LINKS)}
            </div>

            <div className="relative" {...hoverProps('company')}>
              {dropdownTrigger('company', 'Company')}
              {renderDropdown('company', COMPANY_LINKS)}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark hover:shadow-glow-sm active:translate-y-px motion-reduce:transition-none"
            >
              Start a Project
            </Link>

            {/* Mobile menu toggle */}
            <button
              ref={toggleButtonRef}
              type="button"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileOpen((v) => !v)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-textMuted transition-colors hover:text-textMain hover:border-primary/40"
            >
              {isMobileOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            id="mobile-menu"
            ref={mobilePanelRef}
            aria-label="Mobile"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-bgDark/98 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <p className="px-3 pt-3 pb-1 text-xs uppercase tracking-wider text-textMuted">Services</p>
              {SERVICE_LINKS.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive(s.href)
                      ? 'bg-primary/8 text-textMain'
                      : 'text-textMuted hover:text-textMain hover:bg-bgCard'
                  )}
                >
                  {s.label}
                </Link>
              ))}
              <Link
                href="/services"
                className="block rounded-lg px-3 py-2.5 text-sm text-primary hover:text-primaryDark"
              >
                All services →
              </Link>

              <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-textMuted">Company</p>
              {MAIN_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive(l.href)
                      ? 'bg-primary/8 text-textMain'
                      : 'text-textMuted hover:text-textMain hover:bg-bgCard'
                  )}
                >
                  {l.label}
                </Link>
              ))}
              {COMPANY_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive(l.href)
                      ? 'bg-primary/8 text-textMain'
                      : 'text-textMuted hover:text-textMain hover:bg-bgCard'
                  )}
                >
                  {l.label}
                </Link>
              ))}

              <p className="px-3 pt-4 pb-1 text-xs uppercase tracking-wider text-textMuted">Products</p>
              {PRODUCT_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive(l.href)
                      ? 'bg-primary/8 text-textMain'
                      : 'text-textMuted hover:text-textMain hover:bg-bgCard'
                  )}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="block rounded-lg bg-primary px-4 py-3 text-center font-medium text-textMain transition-colors hover:bg-primaryDark"
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
