'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Area, Card, Check, EmptyRow, Notice, NumberField, Panel, RowActions, SubmitButton, Text } from '@/components/admin/ui';

interface Row {
  id: number;
  client_name: string;
  client_role: string | null;
  company: string | null;
  company_logo_url: string | null;
  photo_url: string | null;
  quote: string;
  project_title: string | null;
  rating: number | null;
  source: string | null;
  source_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const EMPTY: Omit<Row, 'id'> = {
  client_name: '',
  client_role: '',
  company: '',
  company_logo_url: '',
  photo_url: '',
  quote: '',
  project_title: '',
  rating: null,
  source: '',
  source_url: '',
  featured: false,
  published: false,
  sort_order: 0,
};

export default function AdminTestimonials() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Omit<Row, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows(((data ?? []) as unknown as Row[]).map((r) => ({
      ...r,
      client_role: r.client_role ?? '',
      company: r.company ?? '',
      company_logo_url: r.company_logo_url ?? '',
      photo_url: r.photo_url ?? '',
      project_title: r.project_title ?? '',
      source: r.source ?? '',
      source_url: r.source_url ?? '',
    })));
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
        ? await supabase.from('testimonials').update(form).eq('id', editingId)
        : await supabase.from('testimonials').insert(form);
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Testimonial updated.' : 'Testimonial added.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete testimonial from "${row.client_name}"?`)) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Testimonial deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit testimonial' : 'Add testimonial'}>
        <p className="mb-4 text-sm text-textMuted">
          Add only genuine, verified testimonials. Nothing shows on the site until published — and
          the homepage hides this section entirely when no published testimonials exist.
        </p>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Client name" value={form.client_name} onChange={(v) => set({ client_name: v })} required />
            <Text label="Client role" value={form.client_role ?? ''} onChange={(v) => set({ client_role: v })} placeholder="Founder" />
            <Text label="Company" value={form.company ?? ''} onChange={(v) => set({ company: v })} />
            <Text label="Company logo URL" value={form.company_logo_url ?? ''} onChange={(v) => set({ company_logo_url: v })} />
            <Text label="Photo URL" value={form.photo_url ?? ''} onChange={(v) => set({ photo_url: v })} />
            <Text label="Project" value={form.project_title ?? ''} onChange={(v) => set({ project_title: v })} />
          </div>
          <Area label="Testimonial" value={form.quote} onChange={(v) => set({ quote: v })} rows={4} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Source" value={form.source ?? ''} onChange={(v) => set({ source: v })} placeholder="Email / LinkedIn / call" />
            <Text label="Source URL" value={form.source_url ?? ''} onChange={(v) => set({ source_url: v })} />
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
            <SubmitButton loading={saving}>{editingId != null ? 'Update Testimonial' : 'Add Testimonial'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`All testimonials (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No testimonials yet. The homepage section stays hidden until one is published.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-textMain">{row.client_name}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        row.published ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'
                      }`}
                    >
                      {row.published ? 'published' : 'draft'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-textMuted">{[row.client_role, row.company].filter(Boolean).join(', ')}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-textMuted">{row.quote}</p>
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
