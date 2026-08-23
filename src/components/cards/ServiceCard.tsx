'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { ServiceRecord } from '@/lib/types';

/**
 * Service card with a pointer-tracking glow border (fine pointers only).
 * Content (what/who/delivers + CTA) is always visible — the effect never
 * hides information.
 */
export function ServiceCard({ service }: { service: ServiceRecord }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full flex-col rounded-xl border border-border bg-bgCard p-6 transition-colors duration-300 hover:border-primary/40 focus-visible:border-primary outline-none"
      >
        {service.icon && (
          <div
            aria-hidden="true"
            className="mb-4 h-11 w-11 flex items-center justify-center bg-bgDark rounded-lg text-xl overflow-hidden"
          >
            {typeof service.icon === 'string' && service.icon.startsWith('http') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.icon} alt="" className="h-7 w-7 object-contain" loading="lazy" decoding="async" />
            ) : (
              <span>{service.icon}</span>
            )}
          </div>
        )}
        <h3 className="mb-2 font-semibold text-lg text-textMain">{service.title}</h3>
        {service.short_description && (
          <p className="mb-5 text-textMuted text-sm leading-relaxed">{service.short_description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-primary group-hover:text-primaryDark">
          Learn more
          <ArrowRight
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
          <span className="sr-only">about {service.title}</span>
        </span>
      </Link>
    </motion.div>
  );
}
