'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost';

interface MagneticButtonBaseProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
}

interface MagneticButtonLinkProps extends MagneticButtonBaseProps {
  href: string;
  onClick?: () => void;
  'aria-label'?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary text-textMain font-medium hover:bg-primaryDark shadow-glow-sm hover:shadow-glow',
  outline:
    'border border-border text-textMuted font-medium hover:text-textMain hover:border-primary/60',
  ghost: 'text-primary font-medium hover:text-primaryDark',
};

/**
 * CTA with a subtle magnetic pull toward the cursor (desktop, fine pointers
 * only). Motion is skipped entirely for touch devices and reduced-motion
 * users — the underlying link/button always works.
 */
export function MagneticButton({ href, onClick, children, className, variant = 'primary', ...rest }: MagneticButtonLinkProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 22 });
  const y = useSpring(0, { stiffness: 300, damping: 22 });

  const isFinePointer =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;
  const enabled = !reduceMotion && isFinePointer;

  function handleMouseMove(e: React.MouseEvent) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-4, Math.min(4, relX * 0.12)));
    y.set(Math.max(-3, Math.min(3, relY * 0.16)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span style={enabled ? { x, y } : undefined} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onClick={onClick}
        aria-label={rest['aria-label']}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 transition-[background-color,border-color,color,box-shadow] duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'active:translate-y-px',
          VARIANT_CLASSES[variant],
          className
        )}
      >
        {children}
      </Link>
    </motion.span>
  );
}
