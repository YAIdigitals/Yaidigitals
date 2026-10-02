interface AnimatedHeadingProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  delay?: number;
}

/** Immediately rendered heading—better for LCP, accessibility and no-JS use. */
export function AnimatedHeading({ children, as: Tag = 'h2', className }: AnimatedHeadingProps) {
  return <Tag className={className}>{children}</Tag>;
}
