import Image from 'next/image';
import { cn } from '@/lib/utils';

export function BrandLogo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/yaidigitals-logo.webp"
      width={720}
      height={239}
      alt="YAIdigitals"
      priority={priority}
      className={cn('h-auto w-[156px] object-contain', className)}
    />
  );
}
