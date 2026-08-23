import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Download } from 'lucide-react';

export const dynamicParams = true;

async function getProduct(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  return data as {
    title: string;
    description: string | null;
    price: number | null;
    cover_image: string | null;
  } | null;
}

function formatINR(value?: number | null) {
  return `₹${(value ?? 0).toLocaleString('en-IN')}`;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.title,
    description:
      product.description?.slice(0, 155) ||
      `Get ${product.title} for ${formatINR(product.price)} — instant delivery from the YAIdigitals store.`,
    alternates: { canonical: `/product/${params.slug}` },
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 155) || undefined,
      images: product.cover_image ? [{ url: product.cover_image }] : undefined,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/store"
        className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
      >
        <ArrowLeft
          size={15}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
        All products
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Media */}
        <div className="overflow-hidden rounded-xl border border-border bg-bgDark">
          {product.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.cover_image}
              alt={product.title}
              loading="eager"
              decoding="async"
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center bg-grid-faint bg-grid">
              <span aria-hidden="true" className="text-primary/40">
                <Download size={32} strokeWidth={1.5} />
              </span>
            </div>
          )}
        </div>

        {/* Details + purchase */}
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-textMain">{product.title}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-textMain">{formatINR(product.price)}</span>
            <span className="text-sm text-textMuted">one-time</span>
          </div>

          <ul className="mt-6 space-y-2.5 text-sm text-textMuted">
            {['Instant digital delivery after checkout', 'Yours forever — no subscription'].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/contact?product=${encodeURIComponent(product.title)}`}
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
          >
            Get Instant Access
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
          <p className="mt-3 text-center text-xs text-textMuted">
            Questions first? The link opens a short form — we&apos;ll reply within one business day.
          </p>
        </div>
      </div>

      {product.description && (
        <div className="mt-12 border-t border-border pt-10">
          <h2 className="text-xl font-bold text-textMain">About this product</h2>
          <div className="mt-4 space-y-4 leading-relaxed text-textMuted">
            {product.description.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
