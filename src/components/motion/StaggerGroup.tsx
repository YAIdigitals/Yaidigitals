import type { ReactNode } from 'react';

export function StaggerGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string; variants?: unknown }) {
  return <div className={className}>{children}</div>;
}
