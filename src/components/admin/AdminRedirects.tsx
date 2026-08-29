'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Card, Check, EmptyRow, Notice, Panel, RowActions, SubmitButton, Text } from '@/components/admin/ui';

interface Row {
  id: number;
  old_path: string;
  new_path: string;
  status: number;
  active: boolean;
}

const EMPTY: Omit<Row, 'id'> = { old_path: '', new_path: '', status: 301, active: true };

export default function AdminRedirects() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Omit<Row, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('redirects').select('*').order('created_at', { ascending: false });
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows((data ?? []) as unknown as Row[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (patch: Partial<Omit<Row, 'id'>>) => setForm((prev) => ({ ...prev, ...patch }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });
    const { error } =
      editingId != null
        ? await supabase.from('redirects').update(form).eq('id', editingId)
        : await supabase.from('redirects').insert(form);
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Redirect updated.' : 'Redirect created.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete redirect ${row.old_path} → ${row.new_path}?`)) return;
    const { error } = await supabase.from('redirects').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Redirect deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit redirect' : 'Add redirect'}>
        <p className="mb-4 text-sm text-textMuted">
          Preserve link equity when routes change. Paths start with &quot;/&quot;. 301 = permanent, 302 = temporary.
          Note: pattern-level redirects (/projects/:slug → /work/:slug) are already built into the site config.
        </p>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Old path" value={form.old_path} onChange={(v) => set({ old_path: v })} required placeholder="/old-page" />
            <Text label="New path" value={form.new_path} onChange={(v) => set({ new_path: v })} required placeholder="/new-page" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Check
              label="301 (permanent)"
              checked={form.status === 301}
              onChange={(v) => set({ status: v ? 301 : 302 })}
            />
            <Check label="Enabled" checked={form.active} onChange={(v) => set({ active: v })} />
          </div>
          <div className="flex justify-end gap-3">
            {editingId != null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY);
                }}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-textMuted hover:text-textMain"
              >
                Cancel
              </button>
            )}
            <SubmitButton loading={saving}>{editingId != null ? 'Update Redirect' : 'Create Redirect'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Redirects (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No custom redirects yet.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-textMain">
                    {row.old_path} <span className="text-textMuted">→</span> {row.new_path}
                  </p>
                  <p className="mt-0.5 text-xs text-textMuted">
                    {row.status} · {row.active ? 'enabled' : 'disabled'}
                  </p>
                </div>
                <RowActions
                  onEdit={() => {
                    setEditingId(row.id);
                    setForm({ ...row });
                  }}
                  onDelete={() => remove(row)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </Panel>
  );
}
