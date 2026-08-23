'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminBundles() {
  const supabase = createClientSupabase();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('199');
  const [slug, setSlug] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('bundles').select('*').order('sort_order');
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await supabase.from('bundles').insert({ name, slug, price: Number(price), active: true });
    setName(''); setSlug('');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none" placeholder="slug" value={slug} onChange={e => setSlug(e.target.value)} />
        <input className="border-border bg-bgCard text-textMain rounded px-3 py-2 w-24" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={create} className="bg-primary text-textMain px-4 py-2 rounded">Add bundle</button>
      </div>
      <ul className="space-y-2">
        {items.map(b => <li key={b.id} className="border rounded p-3 flex justify-between"><span>{b.name} — ₹{b.price}</span></li>)}
      </ul>
    </div>
  );
}
