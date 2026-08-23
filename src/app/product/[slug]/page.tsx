import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('products').select('*').eq('slug', params.slug).maybeSingle();
  if (!data) notFound();
  
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-6">
        {data.cover_image && (
          <img
            src={data.cover_image}
            alt={data.title}
            className="rounded-lg aspect-w-16 aspect-h-9 object-cover w-full"
          />
        )}
        <h1 className="text-3xl font-bold text-textMain mb-4">{data.title}</h1>
        {data.description && (
          <p className="mb-4 text-textMuted whitespace-pre-line">{data.description}</p>
        )}
        {data.features && data.features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-textMain mb-2">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-textMuted">
              {(data.features as string[]).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mb-6 flex items-baseline">
          <h2 className="text-xl font-bold text-textMain">Price</h2>
          <div className="ml-4">
            <span className="text-3xl font-bold text-textMain">
              ₹{data.price}
            </span>
          </div>
        </div>
        <div className="mt-6">
          {data.payment_url ? (
            <a
              href={data.payment_url}
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 w-full inline-block text-center"
            >
              Buy Now
            </a>
          ) : (
            <a href="/contact" className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 w-full">
              Get Access
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
