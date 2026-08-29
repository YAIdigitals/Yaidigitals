'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Card, Check, EmptyRow, Notice, NumberField, Panel, RowActions, SubmitButton, Text } from '@/components/admin/ui';

interface Row {
  id: number;
  name: string;
  logo_url: string | null;
  category: string | null;
  website_url: string | null;
  sort_order: number;
  active: boolean;
}

const EMPTY: Omit<Row, 'id'> = { name: '', logo_url: '', category: 'Frontend', website_url: '', sort_order: 0, active: true };

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Mobile', 'Cloud & Infrastructure', 'AI', 'Integrations'];

export default function AdminTechnologies() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Omit<Row, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('technologies').select('*').order('sort_order');
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows(((data ?? []) as unknown as Row[]).map((r) => ({ ...r, logo_url: r.logo_url ?? '' })));
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
        ? await supabase.from('technologies').update(form).eq('id', editingId)
        : await supabase.from('technologies').insert(form);
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Technology updated.' : 'Technology added.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Remove "${row.name}"?`)) return;
    const { error } = await supabase.from('technologies').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Technology removed.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit technology' : 'Add technology'}>
        <p className="mb-4 text-sm text-textMuted">
          Only add technologies YAIdigitals genuinely uses — this list is public on the homepage.
        </p>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Name" value={form.name} onChange={(v) => set({ name: v })} required />
            <Text label="Logo URL" value={form.logo_url ?? ''} onChange={(v) => set({ logo_url: v })} />
            <Text label="Category" value={form.category ?? ''} onChange={(v) => set({ category: v })} hint={`One of: ${CATEGORIES.join(', ')}`} />
            <Text label="Website" value={form.website_url ?? ''} onChange={(v) => set({ website_url: v })} placeholder="https://…" />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Check label="Active (visible)" checked={form.active} onChange={(v) => set({ active: v })} />
            <div className="w-36">
              <NumberField label="Display order" value={form.sort_order} onChange={(v) => set({ sort_order: v })} />
            </div>
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
            <SubmitButton loading={saving}>{editingId != null ? 'Update Technology' : 'Add Technology'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`All technologies (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No technologies yet.</EmptyRow>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-textMain">{row.name}</h3>
                  <p className="text-xs text-textMuted">{row.category}</p>
                </div>
                <RowActions
                  onEdit={() => {
                    setEditingId(row.id);
                    setForm({ ...row });
                  }}
                  onDelete={() => remove(row)}
                  deleteLabel="Remove"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </Panel>
  );
}
