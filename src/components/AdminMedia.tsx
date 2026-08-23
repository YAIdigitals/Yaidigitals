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
      <label className="bg-black text-white px-4 py-2 rounded inline-block cursor-pointer">
        {uploading ? 'Uploading...' : 'Upload file'}
        <input type="file" className="hidden" onChange={e => e.target.files && upload(e.target.files[0])} />
      </label>
      <ul className="space-y-2">
        {files.map(f => (
          <li key={f.id} className="border rounded p-3 flex items-center justify-between">
            <a href={f.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{f.path}</a>
            <button onClick={() => remove(f.id)} className="text-red-600 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
