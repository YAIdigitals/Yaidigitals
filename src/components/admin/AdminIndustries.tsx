'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Area, Card, Check, EmptyRow, Notice, NumberField, Panel, RowActions, SubmitButton, Text } from '@/components/admin/ui';

interface Row {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  short_description: string | null;
  long_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const EMPTY: Omit<Row, 'id'> = {
  name: '',
  slug: '',
  icon: '',
  image_url: '',
  short_description: '',
  long_description: '',
  seo_title: '',
  seo_description: '',
  featured: false,
  published: true,
  sort_order: 0,
};

export default function AdminIndustries() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Omit<Row, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('industries').select('*').order('sort_order');
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows(
      ((data ?? []) as unknown as Row[]).map((r) => ({
        ...r,
        icon: r.icon ?? '',
        image_url: r.image_url ?? '',
      }))
    );
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
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } =
      editingId != null
        ? await supabase.from('industries').update(payload).eq('id', editingId)
        : await supabase.from('industries').insert(payload);
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Industry updated.' : 'Industry created.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete industry "${row.name}"?`)) return;
    const { error } = await supabase.from('industries').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Industry deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit industry' : 'Add industry'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Name" value={form.name} onChange={(v) => set({ name: v })} required />
            <Text label="Slug" value={form.slug} onChange={(v) => set({ slug: v })} required placeholder="ecommerce" hint="Public URL: /industries/<slug>" />
            <Text label="Icon (emoji)" value={form.icon ?? ''} onChange={(v) => set({ icon: v })} placeholder="🛒" />
            <Text label="Image URL" value={form.image_url ?? ''} onChange={(v) => set({ image_url: v })} />
          </div>
          <Area label="Short description" value={form.short_description ?? ''} onChange={(v) => set({ short_description: v })} rows={2} />
          <Area label="Long description" value={form.long_description ?? ''} onChange={(v) => set({ long_description: v })} rows={4} />
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="SEO title" value={form.seo_title ?? ''} onChange={(v) => set({ seo_title: v })} />
            <Text label="SEO description" value={form.seo_description ?? ''} onChange={(v) => set({ seo_description: v })} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Check label="Published" checked={form.published} onChange={(v) => set({ published: v })} />
            <Check label="Featured" checked={form.featured} onChange={(v) => set({ featured: v })} />
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
            <SubmitButton loading={saving}>{editingId != null ? 'Update Industry' : 'Create Industry'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`All industries (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No industries yet.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-textMain">
                      {row.icon ? `${row.icon} ` : ''}
                      {row.name}
                    </h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        row.published ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'
                      }`}
                    >
                      {row.published ? 'published' : 'draft'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-textMuted">/industries/{row.slug}</p>
                </div>
                <RowActions
                  onEdit={() => {
                    setEditingId(row.id);
                    setForm({ ...row });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
