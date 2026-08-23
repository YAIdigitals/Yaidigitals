'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface AnimatedHeadingProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

/**
 * Word-by-word masked reveal for headings.
 * The full sentence is exposed via aria-label on the heading element while
 * individual words are aria-hidden — screen readers and crawlers see normal
 * text. Falls back to static text for reduced motion / no JS.
 */
export function AnimatedHeading({ children, as: Tag = 'h2', className, delay = 0 }: AnimatedHeadingProps) {
  const reduceMotion = useReducedMotion();
  const words = children.split(' ');

  if (reduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = MOTION_TAGS[Tag];

  return (
    <MotionTag
      className={className}
      aria-label={children}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.045, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-1 -mb-1 align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '105%' },
              visible: { y: '0%', transition: { duration: 0.6, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
