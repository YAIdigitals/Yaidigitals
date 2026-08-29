'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  Card,
  Check,
  EmptyRow,
  ListEditor,
  Notice,
  Panel,
  RowActions,
  SubmitButton,
  Text,
} from '@/components/admin/ui';

interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_name: string | null;
  author_role: string | null;
  tags: string[] | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string | null;
  active: boolean;
  featured: boolean;
}

const EMPTY: Omit<PostRow, 'id' | 'published_at' | 'updated_at'> = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author_name: '',
  author_role: '',
  tags: [],
  seo_title: '',
  seo_description: '',
  active: false,
  featured: false,
};

export default function AdminBlog() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<PostRow[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows(((data ?? []) as unknown as PostRow[]).map((r) => ({
      ...r,
      excerpt: r.excerpt ?? '',
      cover_image: r.cover_image ?? '',
      author_name: r.author_name ?? '',
      author_role: r.author_role ?? '',
      tags: Array.isArray(r.tags) ? r.tags : [],
      seo_title: r.seo_title ?? '',
      seo_description: r.seo_description ?? '',
    })));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (patch: Partial<typeof EMPTY>) => setForm((prev) => ({ ...prev, ...patch }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });

    const now = new Date().toISOString();
    const payload = { ...form, updated_at: now };
    const { error } =
      editingId != null
        ? await supabase.from('blog_posts').update(payload).eq('id', editingId)
        : await supabase.from('blog_posts').insert({ ...payload, published_at: now });
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: editingId != null ? 'Article updated.' : 'Article created.' }
    );
    if (!error) {
      setEditingId(null);
      setForm(EMPTY);
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: PostRow) => {
    if (!window.confirm(`Delete article "${row.title}"?`)) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', row.id);
    setNotice(
      error ? { kind: 'error', message: `Delete failed: ${error.message}` } : { kind: 'ok', message: 'Article deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />
      <Card title={editingId != null ? 'Edit article' : 'Add article'}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Title" value={form.title} onChange={(v) => set({ title: v })} required />
            <Text label="Slug" value={form.slug} onChange={(v) => set({ slug: v })} required hint="Public URL: /insights/<slug>" />
          </div>
          <Area label="Excerpt (used as meta description when SEO description is empty)" value={form.excerpt ?? ''} onChange={(v) => set({ excerpt: v })} rows={2} />
          <Area
            label="Content"
            value={form.content}
            onChange={(v) => set({ content: v })}
            rows={12}
            hint="Blank line separates paragraphs. Lines starting with '## ' render as section headings."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Cover image URL" value={form.cover_image ?? ''} onChange={(v) => set({ cover_image: v })} />
            <Text label="Author name" value={form.author_name ?? ''} onChange={(v) => set({ author_name: v })} placeholder="YAIdigitals Team" />
            <Text label="Author role" value={form.author_role ?? ''} onChange={(v) => set({ author_role: v })} />
            <Text label="SEO title" value={form.seo_title ?? ''} onChange={(v) => set({ seo_title: v })} />
          </div>
          <Area label="SEO description" value={form.seo_description ?? ''} onChange={(v) => set({ seo_description: v })} rows={2} />
          <ListEditor label="Tags" items={form.tags ?? []} onChange={(items) => set({ tags: items })} placeholder="mobile-apps" />
          <div className="flex flex-wrap items-center gap-6">
            <Check label="Published (visible on site)" checked={form.active} onChange={(v) => set({ active: v })} />
            <Check label="Featured" checked={form.featured} onChange={(v) => set({ featured: v })} />
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
            <SubmitButton loading={saving}>{editingId != null ? 'Update Article' : 'Create Article'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`All articles (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No articles yet.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-textMain">{row.title}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        row.active ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'
                      }`}
                    >
                      {row.active ? 'published' : 'draft'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-textMuted">/insights/{row.slug}</p>
                </div>
                <RowActions
                  onEdit={() => {
                    setEditingId(row.id);
                    setForm({
                      slug: row.slug,
                      title: row.title,
                      excerpt: row.excerpt ?? '',
                      content: row.content ?? '',
                      cover_image: row.cover_image ?? '',
                      author_name: row.author_name ?? '',
                      author_role: row.author_role ?? '',
                      tags: Array.isArray(row.tags) ? row.tags : [],
                      seo_title: row.seo_title ?? '',
                      seo_description: row.seo_description ?? '',
                      active: row.active,
                      featured: row.featured,
                    });
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
