'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Smartphone, Globe, PhoneCall } from 'lucide-react';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

const floatTransition = (duration: number, delay: number) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: 'easeInOut' as const,
});

/**
 * Hero composition: a layered arrangement of three product-surface cards
 * (app / website / AI call) floating gently above a faint grid + glow.
 * Pure CSS + transform animation — no canvas, no WebGL, no layout impact.
 */
export function HeroVisual() {
  const reduceMotion = useReducedMotion();

  const float = (duration: number, delay = 0) =>
    reduceMotion ? {} : { animate: { y: [0, -10, 0] }, transition: floatTransition(duration, delay) };

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-md lg:max-w-none select-none"
    >
      {/* Backdrop: grid + radial glow */}
      <div className="absolute inset-0 -z-10 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black_30%,transparent_75%)] rounded-3xl" />
      <div className="absolute inset-0 -z-10 bg-hero-glow" />

      {/* Central card — website surface */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 ml-auto mr-6 w-[78%] rounded-xl border border-border bg-bgCard shadow-card overflow-hidden"
        {...float(9)}
      >
        <BrowserChrome />
        <div className="p-4 space-y-2.5">
          <div className="h-2.5 w-1/3 rounded-full bg-primary/70" />
          <div className="h-2 w-4/5 rounded-full bg-white/12" />
          <div className="h-2 w-3/5 rounded-full bg-white/8" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-12 rounded-md border border-border bg-bgDark" />
            <div className="h-12 rounded-md border border-primary/25 bg-primary/5" />
            <div className="h-12 rounded-md border border-border bg-bgDark" />
          </div>
        </div>
      </motion.div>

      {/* Left card — mobile app surface */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -24, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        className="absolute left-0 top-16 z-20 w-[38%] rounded-xl border border-border bg-bgCard shadow-card p-3"
        {...float(7, 0.4)}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Smartphone size={14} strokeWidth={2} />
          </span>
          <span className="text-[11px] font-medium text-textMuted">Mobile app</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-white/12" />
          <div className="h-2 w-2/3 rounded-full bg-white/8" />
          <div className="h-8 w-full rounded-lg bg-primary/10 border border-primary/20" />
        </div>
      </motion.div>

      {/* Bottom-right card — AI call status */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 24, y: -12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        className="absolute right-2 bottom-6 z-20 rounded-xl border border-border bg-bgGlass backdrop-blur-md shadow-card px-3.5 py-3"
        {...float(8, 1)}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
            {!reduceMotion && (
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            )}
            <PhoneCall size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[11px] font-medium text-textMain leading-tight">AI agent live</p>
            <p className="text-[10px] text-textMuted leading-tight mt-0.5">Call answered · booking appointment</p>
          </div>
        </div>
        <MiniWaveform reduceMotion={!!reduceMotion} />
      </motion.div>
    </div>
  );
}

function BrowserChrome() {
  return (
    <div className="flex items-center gap-1.5 border-b border-border bg-bgDark/80 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="ml-2 h-3.5 flex-1 rounded-full bg-white/5" />
    </div>
  );
}

function MiniWaveform({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="mt-2.5 flex h-4 items-center gap-[3px]" aria-hidden="true">
      {[0.9, 0.5, 1.1, 0.7, 1.3, 0.6, 1.0].map((d, i) => (
        <span
          key={i}
          className={cn('w-[3px] rounded-full bg-primary/70 origin-center', !reduceMotion && 'animate-bar-grow')}
          style={{
            height: '100%',
            animationDuration: `${d}s`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}
