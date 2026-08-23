'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';

type LenisInstance = { raf: (time: number) => void; destroy: () => void; stop: () => void; start: () => void };

const SmoothScrollContext = createContext<{
  stop: () => void;
  start: () => void;
}>({ stop: () => {}, start: () => {} });

/**
 * Lenis-powered inertial scrolling.
 * - Loaded lazily and only when the user allows motion
 * - Skipped entirely for prefers-reduced-motion (native scrolling kept)
 * - Exposes stop()/start() so overlays (mobile menu) can pause it
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({
        lerp: 0.11,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      lenisRef.current = lenis;
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      const loop = (time: number) => {
        lenisRef.current?.raf(time);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);

      // Anchor links: let Lenis handle them smoothly
      function onAnchorClick(e: MouseEvent) {
        const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -80 });
          history.replaceState(null, '', id);
        }
      }
      document.addEventListener('click', onAnchorClick);

      (lenis as unknown as { __cleanupAnchor?: () => void }).__cleanupAnchor = () =>
        document.removeEventListener('click', onAnchorClick);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      const lenis = lenisRef.current as (LenisInstance & { __cleanupAnchor?: () => void }) | null;
      lenis?.__cleanupAnchor?.();
      lenis?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  const value = {
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

/** Access the global smooth-scroll instance (no-op when motion is reduced). */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
