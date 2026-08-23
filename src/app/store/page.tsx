import { createServerSupabase } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function StorePage() {
  const supabase = createServerSupabase();
  const { data: products } = await supabase.from('products').select('*').eq('active', true).order('sort_order');
  
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Digital Products</h1>
      <p className="mb-8 text-textMuted max-w-3xl mx-auto">
        Browse our collection of ready-to-use digital assets designed to accelerate your projects and enhance your digital presence.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products ?? []).map((p: any) => (
          <a key={p.id} href={`/product/${p.slug}`} className="border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg">
            {p.cover_image && (
              <img
                src={p.cover_image}
                alt={p.title}
                className="rounded-lg aspect-w-16 aspect-h-9 object-cover w-full"
              />
            )}
            <h3 className="mt-4 font-semibold text-textMain">{p.title}</h3>
            <p className="mt-2 text-textMuted">
              ₹{p.price}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
