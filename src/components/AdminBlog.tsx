'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminBlog() {
  const supabase = createClientSupabase();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    await supabase.from('blog_posts').insert({ title, slug, content, published_at: new Date().toISOString(), active: true });
    setTitle(''); setSlug(''); setContent('');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input className="border rounded px-3 py-2 w-full" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
        <textarea className="border rounded px-3 py-2 w-full" rows={4} value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={create} className="bg-black text-white px-4 py-2 rounded">Publish post</button>
      </div>
      <ul className="space-y-2">
        {items.map(p => <li key={p.id} className="border rounded p-3">{p.title}</li>)}
      </ul>
    </div>
  );
}
