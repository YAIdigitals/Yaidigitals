import type { Transition, Variants } from 'framer-motion';

/** Shared easing — consistent across every animated component. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 26 };

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const viewportOnce = { once: true, margin: '-80px' } as const;
