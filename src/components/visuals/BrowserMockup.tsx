'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';
import { EASE, viewportOnce } from '@/lib/motion';

/**
 * Browser mockup with an abstract landing-page skeleton that "builds
 * itself" as it scrolls into view. Abstract skeleton — not a fake
 * screenshot of a real client site.
 */
export function BrowserMockup() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          whileInView: { opacity: 1, y: 0 },
          viewport: viewportOnce,
          transition: { duration: 0.5, ease: EASE, delay },
        };

  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-8 -z-10 bg-hero-glow" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-xl border border-border bg-bgCard shadow-elevate overflow-hidden"
      >
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-border bg-bgDark/90 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-3 flex h-6 flex-1 items-center gap-1.5 rounded-md bg-white/5 px-2.5">
            <Lock size={10} strokeWidth={2} className="text-primary shrink-0" />
            <span className="h-1.5 w-28 rounded-full bg-white/12" />
          </span>
        </div>

        {/* Page body */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Nav skeleton */}
          <div {...reveal(0.15)} className="flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-primary/70" />
            <div className="hidden sm:flex gap-2">
              {[16, 20, 14].map((w, i) => (
                <span key={i} className="h-2 rounded-full bg-white/12" style={{ width: w * 4 }} />
              ))}
            </div>
            <span className="h-6 w-16 rounded-md bg-primary/25 border border-primary/30" />
          </div>

          {/* Hero skeleton */}
          <div className="grid gap-5 pt-2 sm:grid-cols-[1.2fr_1fr] items-center">
            <div className="space-y-2.5">
              <div {...reveal(0.25)} className="h-3.5 w-11/12 rounded-full bg-white/25" />
              <div {...reveal(0.32)} className="h-3.5 w-2/3 rounded-full bg-white/15" />
              <div {...reveal(0.39)} className="mt-1 space-y-1.5">
                <div className="h-2 w-full rounded-full bg-white/8" />
                <div className="h-2 w-4/5 rounded-full bg-white/8" />
              </div>
              <div {...reveal(0.46)} className="flex gap-2 pt-2">
                <span className="h-7 w-24 rounded-lg bg-primary shadow-glow-sm" />
                <span className="h-7 w-24 rounded-lg border border-border" />
              </div>
            </div>
            <div {...reveal(0.35)} className="hidden sm:block aspect-[4/3] rounded-lg border border-border bg-bgDark p-3">
              <div className="space-y-2">
                <div className="h-2 w-1/2 rounded-full bg-primary/40" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="h-10 rounded-md border border-border" />
                  <div className="h-10 rounded-md border border-primary/25 bg-primary/8" />
                </div>
                <div className="h-2 w-3/4 rounded-full bg-white/12" />
                <div className="h-2 w-1/2 rounded-full bg-white/8" />
              </div>
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[0.55, 0.62, 0.69].map((delay, i) => (
              <div key={i} {...reveal(delay)} className="rounded-lg border border-border bg-bgDark p-3 space-y-2">
                <div className={`h-6 w-6 rounded-md ${i === 1 ? 'bg-primary/20' : 'bg-white/8'}`} />
                <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
                <div className="h-1.5 w-full rounded-full bg-white/8" />
              </div>
            ))}
          </div>

          {/* Address-bar hint */}
          <div {...reveal(0.8)} className="flex items-center justify-center gap-1.5 text-[11px] text-textMuted">
            <span>Responsive by default</span>
            <ArrowRight size={11} strokeWidth={2} className="text-primary" />
            <span>mobile · tablet · desktop</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
