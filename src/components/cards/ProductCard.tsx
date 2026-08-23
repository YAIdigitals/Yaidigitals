import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import type { ProductRecord } from '@/lib/types';

function formatINR(value?: number | null) {
  return `₹${(value ?? 0).toLocaleString('en-IN')}`;
}

/**
 * Digital product card. Fixed 16/9 media box prevents layout shift;
 * images lazy-load below the fold.
 */
export function ProductCard({ product }: { product: ProductRecord }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate hover:-translate-y-1 focus-visible:border-primary outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-bgDark">
        {product.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.cover_image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-grid-faint bg-grid">
            <Zap aria-hidden="true" size={28} strokeWidth={1.5} className="text-primary/40" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md border border-border bg-bgGlass px-2 py-0.5 text-[11px] font-medium text-textMuted backdrop-blur-sm">
          Instant delivery
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold leading-snug text-textMain">{product.title}</h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-textMain">{formatINR(product.price)}</span>
          <span className="inline-flex items-center gap-1 text-sm text-primary group-hover:text-primaryDark">
            View
            <ArrowRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
