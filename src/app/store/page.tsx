import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { cache } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Carousel } from '@/components/carousel/Carousel';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import type { ProductRecord } from '@/lib/types';
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const revalidate = 300;

const getProducts = cache(async () => {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('products').select('*').eq('active', true).order('sort_order');
  return (data ?? []) as unknown as ProductRecord[];
});

export async function generateMetadata(): Promise<Metadata> {
  const products = await getProducts();
  return buildMetadata({
    title: 'Digital Products — Ready-to-Use Assets',
    description:
      'Browse downloadable creator packs and digital assets available from YAIdigitals.',
    path: '/store',
    noindex: products.length === 0,
  });
}

export default async function StorePage() {
  const all = await getProducts();

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'YAIdigitals Digital Products',
            description: 'Downloadable creator packs and digital assets available from YAIdigitals.',
            path: '/store',
            type: 'CollectionPage',
          }),
          breadcrumbJsonLd([{ name: 'Store', path: '/store' }]),
        ]}
      />
      <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Store"
        title="Digital products and creator assets"
        description="Browse ready-to-use digital assets and creator packs currently available from YAIdigitals."
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
    </>
  );
}
