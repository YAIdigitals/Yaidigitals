import { Reveal } from '@/components/motion/Reveal';
import { AnimatedHeading } from '@/components/motion/AnimatedHeading';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
}

/** Consistent section header: green eyebrow label, animated title, optional lede. */
export function SectionHeading({ eyebrow, title, description, align = 'left', as = 'h2' }: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="eyebrow mb-3 justify-center">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
      )}
      <AnimatedHeading
        as={as}
        className="text-3xl sm:text-4xl font-bold tracking-tight text-textMain leading-tight"
      >
        {title}
      </AnimatedHeading>
      {description && (
        <p className={`mt-4 text-textMuted leading-relaxed ${centered ? 'mx-auto' : ''}`}>{description}</p>
      )}
    </Reveal>
  );
}
