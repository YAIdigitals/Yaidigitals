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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Key" value={key} onChange={e => setKey(e.target.value)} />
        <input className="w-full rounded-lg border border-border bg-bgCard px-3 py-2 text-sm text-textMain transition-colors placeholder:text-textMuted/50 focus:border-primary focus:outline-none" placeholder="Value" value={value} onChange={e => setValue(e.target.value)} />
        <button onClick={save} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark">Save</button>
      </div>
      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.key} className="min-w-0 break-words rounded-xl border border-border bg-bgCard p-3 text-sm">
            <strong className="text-textMain">{r.key}</strong> = <span className="text-textMuted">{r.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
