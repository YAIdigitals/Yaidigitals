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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <button onClick={create} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark">Add bundle</button>
      </div>
      <ul className="space-y-2">
        {items.map(b => (
          <li key={b.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bgCard p-3">
            <span className="min-w-0 truncate text-textMain">{b.name} — ₹{b.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
