'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
}

/** Parent container: staggers its <StaggerItem> children on scroll into view. */
export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

/** Child of <StaggerGroup>. Animates in sequence with its siblings. */
export function StaggerItem({ children, className, variants = staggerItem }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
