'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from 'framer-motion';

interface CarouselProps {
  /** One <div> per slide; gets flex sizing applied automatically. */
  children: ReactNode[];
  ariaLabel: string;
  className?: string;
}

/**
 * Accessible Embla carousel: arrow controls with disabled states,
 * slide counter, keyboard-operable buttons, instant jumps under
 * reduced motion.
 */
export function Carousel({ children, ariaLabel, className }: CarouselProps) {
  const reduceMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    duration: reduceMotion ? 1 : 22,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p aria-live="polite" className="text-xs text-textMuted tabular-nums">
          {selectedIndex + 1} / {children.length}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bgCard text-textMuted transition-colors hover:text-textMain hover:border-primary/40 disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-bgCard text-textMuted transition-colors hover:text-textMain hover:border-primary/40 disabled:opacity-35 disabled:pointer-events-none"
          >
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={emblaRef} className="overflow-hidden" aria-live="polite">
        <div className="flex touch-pan-y -ml-4">
          {children.map((child, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${children.length}`}
              className={cn('flex-[0_0_86%] min-w-0 pl-4')}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
