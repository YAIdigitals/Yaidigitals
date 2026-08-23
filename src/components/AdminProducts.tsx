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
      <form onSubmit={e => { e.preventDefault(); create(); }} className="flex flex-wrap gap-2 items-end">
        <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input className="border rounded px-3 py-2" placeholder="slug" value={slug} onChange={e => setSlug(e.target.value)} required />
        <input className="border rounded px-3 py-2 w-24" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <input className="border rounded px-3 py-2 w-64" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">Add product</button>
      </form>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-600">₹{p.price} · {p.active ? 'Active' : 'Hidden'}</p>
            </div>
            <div className="flex gap-3">
              <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">View</a>
              <button onClick={() => remove(p.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
