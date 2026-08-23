'use client';
import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<{ key: string; value: string }[]>([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const load = async () => {
    const { data } = await supabase.from('settings').select('*');
    setRows(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    await supabase.from('settings').upsert({ key, value });
    setKey(''); setValue('');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
        <input className="border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <button onClick={save} className="bg-primary text-textMain px-4 py-2 rounded">Save</button>
      </div>
      <ul className="space-y-2">
        {rows.map(r => <li key={r.key} className="border rounded p-2"><strong>{r.key}</strong> = {r.value}</li>)}
      </ul>
    </div>
  );
}
