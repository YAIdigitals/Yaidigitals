import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AnalyticsEvent } from '@/lib/analytics';

type Variant = 'primary' | 'outline' | 'ghost';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  href: string;
  analyticsEvent?: AnalyticsEvent;
  analyticsPlacement?: string;
  'aria-label'?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary text-bgDark font-semibold hover:bg-primaryDark shadow-glow-sm hover:shadow-glow',
  outline: 'border border-border text-textMuted font-medium hover:text-textMain hover:border-primary/60',
  ghost: 'text-primary font-medium hover:text-primaryDark',
};

export function MagneticButton({ href, analyticsEvent, analyticsPlacement, children, className, variant = 'primary', ...rest }: Props) {
  return (
    <a
      href={href}
      data-analytics-event={analyticsEvent}
      data-analytics-placement={analyticsPlacement}
      data-analytics-destination={href}
      aria-label={rest['aria-label']}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-7 py-3.5 transition-[background-color,border-color,color,box-shadow,transform] duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px',
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </a>
  );
}
