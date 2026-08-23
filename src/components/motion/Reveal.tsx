'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE, viewportOnce } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  variants?: Variants;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}

/**
 * Fades + slides content in when it enters the viewport.
 * Renders a plain element (fully visible) when reduced motion is preferred
 * or when JavaScript is unavailable — content is never hidden by default CSS.
 */
export function Reveal({ children, className, delay = 0, variants, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={variants ? 'hidden' : { opacity: 0, y: 18 }}
      whileInView={variants ? 'visible' : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={variants ? undefined : { duration: 0.55, ease: EASE, delay }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
