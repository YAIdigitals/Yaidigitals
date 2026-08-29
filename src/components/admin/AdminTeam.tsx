'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import { Area, Card, Check, EmptyRow, Notice, NumberField, Panel, RowActions, SubmitButton, Text } from '@/components/admin/ui';

interface Row {
  id: number;
  name: string;
  photo_url: string | null;
  role: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  sort_order: number;
  published: boolean;
}

const EMPTY: Omit<Row, 'id'> = {
  name: '',
  photo_url: '',
  role: '',
  short_bio: '',
  linkedin_url: '',
  github_url: '',
  website_url: '',
  sort_order: 0,
  published: false,
};

export default function AdminTeam() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Omit<Row, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('team_members').select('*').order('sort_order');
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows(((data ?? []) as unknown as Row[]).map((r) => ({
      ...r,
      photo_url: r.photo_url ?? '',
      role: r.role ?? '',
      short_bio: r.short_bio ?? '',
      linkedin_url: r.linkedin_url ?? '',
      github_url: r.github_url ?? '',
      website_url: r.website_url ?? '',
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
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } =
      editingId != null
        ? await supabase.from('team_members').update(payload).eq('id', editingId)
        : await supabase.from('team_members').insert(payload);
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Team member updated.' : 'Team member added.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete team member "${row.name}"?`)) return;
    const { error } = await supabase.from('team_members').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Team member deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit team member' : 'Add team member'}>
        <p className="mb-4 text-sm text-textMuted">
          Never invent team members — add real people only. Published members can appear on the
          About page and Insights articles.
        </p>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Name" value={form.name} onChange={(v) => set({ name: v })} required />
            <Text label="Role" value={form.role ?? ''} onChange={(v) => set({ role: v })} placeholder="Full-Stack Developer" />
            <Text label="Photo URL" value={form.photo_url ?? ''} onChange={(v) => set({ photo_url: v })} />
          </div>
          <Area label="Short bio" value={form.short_bio ?? ''} onChange={(v) => set({ short_bio: v })} rows={3} />
          <div className="grid gap-4 md:grid-cols-3">
            <Text label="LinkedIn" value={form.linkedin_url ?? ''} onChange={(v) => set({ linkedin_url: v })} />
            <Text label="GitHub" value={form.github_url ?? ''} onChange={(v) => set({ github_url: v })} />
            <Text label="Website" value={form.website_url ?? ''} onChange={(v) => set({ website_url: v })} />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Check label="Published" checked={form.published} onChange={(v) => set({ published: v })} />
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
            <SubmitButton loading={saving}>{editingId != null ? 'Update Member' : 'Add Member'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`Team (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No team members yet.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-textMain">{row.name}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        row.published ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'
                      }`}
                    >
                      {row.published ? 'published' : 'draft'}
                    </span>
                  </div>
                  {row.role && <p className="mt-0.5 text-xs text-textMuted">{row.role}</p>}
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
