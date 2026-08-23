'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminMedia() {
  const supabase = createClientSupabase();
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from('media').select('*').order('id', { ascending: false });
    setFiles(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `media/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file);
    if (!error) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
      await supabase.from('media').insert({ path, url, type: file.type.startsWith('video') ? 'video' : 'image', size: file.size });
      load();
    }
    setUploading(false);
  };

  const remove = async (id: number) => {
    await supabase.from('media').delete().eq('id', id);
    load();
  };

  return (
    <div className="space-y-4">
      <label className="bg-primary text-textMain px-4 py-2 rounded inline-block cursor-pointer">
        {uploading ? 'Uploading...' : 'Upload file'}
        <input type="file" className="hidden" onChange={e => e.target.files && upload(e.target.files[0])} />
      </label>
      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.id} className="flex flex-col gap-2 rounded-xl border border-border bg-bgCard p-3 sm:flex-row sm:items-center sm:justify-between">
            <a href={f.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-sm text-primary underline-offset-4 hover:underline">{f.path}</a>
            <button onClick={() => remove(f.id)} className="shrink-0 self-start text-sm text-red-400 sm:self-auto">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
