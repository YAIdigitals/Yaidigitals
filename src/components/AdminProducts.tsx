'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminProducts() {
  const supabase = createClientSupabase();
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('99');
  const [description, setDescription] = useState('');

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('sort_order');
    setProducts(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await supabase.from('products').insert({ title, slug, price: Number(price), description, active: true, sort_order: 0 });
    setTitle(''); setSlug(''); setPrice('99'); setDescription('');
    load();
  };

  const remove = async (id: number) => {
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={e => { e.preventDefault(); create(); }} className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} required />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark">Add product</button>
      </form>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="rounded-xl border border-border bg-bgCard p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-semibold text-textMain">{p.title}</p>
                <p className="mt-0.5 text-sm text-textMuted">₹{p.price} · {p.active ? 'Active' : 'Hidden'}</p>
              </div>
              <div className="flex shrink-0 gap-3">
                <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary">View</a>
                <button onClick={() => remove(p.id)} className="text-sm text-red-400">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
