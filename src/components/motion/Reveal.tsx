import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: unknown;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}

/**
 * Semantic server-rendered wrapper. The previous per-section animation
 * hydrated most of every page; native CSS transitions now handle local hover
 * feedback while content stays immediately visible and crawlable.
 */
export function Reveal({ children, className, as: Tag = 'div' }: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
