'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Bell, CalendarCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { EASE, viewportOnce } from '@/lib/motion';

const SCREENS = [
  { id: 'home', bars: ['w-1/2', 'w-full', 'w-4/5'] },
  { id: 'list', bars: ['w-full', 'w-full', 'w-3/5'] },
  { id: 'detail', bars: ['w-2/3', 'w-full', 'w-full'] },
] as const;

/**
 * Animated mobile device showing an abstract app UI cycling through
 * screens. Deliberately abstract skeleton UI — not a fake screenshot of
 * any real YAIdigitals product.
 */
export function MobileAppMockup() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="relative mx-auto w-fit">
      {/* Ambient glow */}
      <div className="absolute -inset-10 -z-10 bg-hero-glow opacity-80" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative w-[240px] rounded-[2.2rem] border border-border bg-bgCard p-2.5 shadow-elevate"
      >
        {/* Notch */}
        <div className="mx-auto mb-2 h-1.5 w-16 rounded-full bg-white/12" />

        <div className="relative h-[420px] overflow-hidden rounded-[1.7rem] border border-border bg-bgDark">
          {SCREENS.map((screen, i) => (
            <AppScreen key={screen.id} index={i} reduceMotion={!!reduceMotion} bars={screen.bars} />
          ))}
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-2.5 h-1 w-20 rounded-full bg-white/15" />
      </motion.div>

      {/* Floating notification chips */}
      <FloatChip
        icon={<CalendarCheck size={13} strokeWidth={2} />}
        label="Appointment booked"
        className="-right-14 top-14"
        delay={0.9}
        duration={6}
        reduceMotion={!!reduceMotion}
      />
      <FloatChip
        icon={<Bell size={13} strokeWidth={2} />}
        label="Push notification"
        className="-left-16 bottom-24"
        delay={1.4}
        duration={8}
        reduceMotion={!!reduceMotion}
      />
      <FloatChip
        icon={<CheckCircle2 size={13} strokeWidth={2} />}
        label="Sync complete"
        className="-right-10 bottom-10"
        delay={1.1}
        duration={7}
        reduceMotion={!!reduceMotion}
      />
    </div>
  );
}

function AppScreen({
  index,
  reduceMotion,
  bars,
}: {
  index: number;
  reduceMotion: boolean;
  bars: readonly string[];
}) {
  return (
    <div
      className={`absolute inset-0 p-4 ${!reduceMotion ? 'app-screen-cycle' : ''}`}
      style={{ animationDelay: `${index * 3}s` }}
    >
      {/* Status bar */}
      <div className="mb-4 flex items-center justify-between">
        <span className="h-2 w-10 rounded-full bg-white/25" />
        <span className="h-2 w-5 rounded-full bg-white/15" />
      </div>
      {/* Header block */}
      <div className="mb-3 h-16 rounded-xl border border-primary/25 bg-primary/8" />
      {/* Content lines */}
      <div className="space-y-2">
        {bars.map((w, i) => (
          <div key={i} className={`h-2 ${w} rounded-full bg-white/12`} />
        ))}
      </div>
      {/* List items */}
      <div className="mt-4 space-y-2.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-bgCard p-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
              <MessageSquare size={12} strokeWidth={2} />
            </span>
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
              <div className="h-1.5 w-1/2 rounded-full bg-white/8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloatChip({
  icon,
  label,
  className,
  delay,
  duration,
  reduceMotion,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
  delay: number;
  duration: number;
  reduceMotion: boolean;
}) {
  const hidden = { opacity: 0, scale: 0.9 };
  return (
    <motion.div
      initial={reduceMotion ? false : hidden}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -6, 0] }
      }
      transition={
        reduceMotion
          ? { duration: 0.3 }
          : {
              opacity: { duration: 0.45, ease: EASE, delay },
              scale: { duration: 0.45, ease: EASE, delay },
              y: { duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay },
            }
      }
      className={`absolute z-10 hidden sm:flex items-center gap-2 rounded-lg border border-border bg-bgGlass backdrop-blur-md px-3 py-2 shadow-card ${className}`}
    >
      <span className="text-primary">{icon}</span>
      <span className="text-[11px] font-medium text-textMuted whitespace-nowrap">{label}</span>
    </motion.div>
  );
}
