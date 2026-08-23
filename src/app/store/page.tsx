import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/cards/ProductCard';
import { Carousel } from '@/components/carousel/Carousel';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import type { ProductRecord } from '@/lib/types';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Digital Products — Ready-to-Use Assets',
  description:
    'Browse viral video bundles, creator packs and other instant-delivery digital products. Secure checkout, download access right after payment.',
  alternates: { canonical: '/store' },
};

export default async function StorePage() {
  const supabase = createServerSupabase();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('sort_order');

  const all = (products ?? []) as unknown as ProductRecord[];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Store"
        title="Digital products, delivered instantly"
        description="Ready-to-use digital assets designed to accelerate your projects — checkout online and get download access right after payment."
      />

      {all.length === 0 ? (
        <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
          <h2 className="font-semibold text-textMain">No products available right now</h2>
          <p className="mt-2 text-sm text-textMuted">
            New bundles are on the way — check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: swipeable carousel */}
          <Carousel ariaLabel="Digital products" className="mt-10 md:hidden">
            {all.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Carousel>

          {/* Tablet/desktop: grid */}
          <StaggerGroup className="mt-10 hidden gap-5 sm:grid-cols-2 md:grid lg:grid-cols-3">
            {all.map((p) => (
              <StaggerItem key={p.id} className="h-full">
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </>
      )}
    </section>
  );
}
