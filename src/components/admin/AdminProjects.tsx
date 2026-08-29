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
  NumberField,
  Panel,
  RowActions,
  Select,
  SubmitButton,
  Text,
} from '@/components/admin/ui';

interface ProjectRow {
  id: number;
  slug: string;
  title: string;
  client_business: string | null;
  website_url: string | null;
  category: string | null;
  industry: string | null;
  status: string;
  short_description: string | null;
  description: string | null;
  problem: string | null;
  business_requirement: string | null;
  solution: string | null;
  key_features: string[] | null;
  services_provided: string[] | null;
  technologies: string[] | null;
  architecture_overview: string | null;
  development_approach: string | null;
  outcome: string | null;
  cover_image: string | null;
  logo_url: string | null;
  screenshots: string[] | null;
  cta_text: string | null;
  cta_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  featured: boolean;
  sort_order: number;
  completion_date: string | null;
}

const EMPTY: Omit<ProjectRow, 'id'> = {
  slug: '',
  title: '',
  client_business: '',
  website_url: '',
  category: '',
  industry: '',
  status: 'draft',
  short_description: '',
  description: '',
  problem: '',
  business_requirement: '',
  solution: '',
  key_features: [],
  services_provided: [],
  technologies: [],
  architecture_overview: '',
  development_approach: '',
  outcome: '',
  cover_image: '',
  logo_url: '',
  screenshots: [],
  cta_text: '',
  cta_url: '',
  seo_title: '',
  seo_description: '',
  og_title: '',
  og_description: '',
  og_image: '',
  featured: false,
  sort_order: 0,
  completion_date: null,
};

function normalize(row: ProjectRow) {
  const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return {
    ...row,
    key_features: list(row.key_features),
    services_provided: list(row.services_provided),
    technologies: list(row.technologies),
    screenshots: list(row.screenshots),
    cover_image: row.cover_image ?? '',
    logo_url: row.logo_url ?? '',
  };
}

export default function AdminProjects() {
  const supabase = createClientSupabase();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [form, setForm] = useState<Omit<ProjectRow, 'id'>>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false });
    if (error) setNotice({ kind: 'error', message: `Load failed: ${error.message}` });
    setRows((data ?? []) as unknown as ProjectRow[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (patch: Partial<Omit<ProjectRow, 'id'>>) => setForm((prev) => ({ ...prev, ...patch }));

  const startEdit = (row: ProjectRow) => {
    setEditingId(row.id);
    setForm(normalize(row));
    setNotice({ kind: 'ok', message: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    const { error } =
      editingId != null
        ? await supabase.from('projects').update(payload).eq('id', editingId)
        : await supabase.from('projects').insert(payload);

    if (error) {
      setNotice({ kind: 'error', message: `Save failed: ${error.message}` });
    } else {
      setNotice({ kind: 'ok', message: editingId != null ? 'Project updated.' : 'Project created.' });
      reset();
      await load();
    }
    setSaving(false);
  };

  const remove = async (row: ProjectRow) => {
    if (!window.confirm(`Delete project "${row.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('projects').delete().eq('id', row.id);
    setNotice(
      error
        ? { kind: 'error', message: `Delete failed: ${error.message}` }
        : { kind: 'ok', message: 'Project deleted.' }
    );
    await load();
  };

  return (
    <Panel>
      <Notice {...notice} />

      <Card title={editingId != null ? 'Edit project' : 'Add project'}>
        <form onSubmit={save} className="space-y-6">
          {/* Basics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Project name" value={form.title} onChange={(v) => set({ title: v })} required />
            <Text label="Slug" value={form.slug} onChange={(v) => set({ slug: v })} required placeholder="localgo" hint="Public URL: /work/<slug>" />
            <Text label="Client / company name" value={form.client_business ?? ''} onChange={(v) => set({ client_business: v })} />
            <Text label="Client website" value={form.website_url ?? ''} onChange={(v) => set({ website_url: v })} placeholder="https://…" />
            <Text label="Category" value={form.category ?? ''} onChange={(v) => set({ category: v })} placeholder="Web Application · Marketplace" />
            <Text label="Industry" value={form.industry ?? ''} onChange={(v) => set({ industry: v })} placeholder="Local Commerce & Delivery" />
          </div>
          <div className="flex flex-wrap gap-6">
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => set({ status: v })}
              options={[
                { value: 'draft', label: 'Draft (hidden from site)' },
                { value: 'published', label: 'Published' },
              ]}
            />
            <div className="flex items-end gap-6 pb-1">
              <Check label="Featured" checked={form.featured} onChange={(v) => set({ featured: v })} />
            </div>
            <div className="w-36">
              <NumberField label="Display order" value={form.sort_order} onChange={(v) => set({ sort_order: v })} />
            </div>
          </div>

          {/* Summary */}
          <Area
            label="Short description (cards & hero)"
            value={form.short_description ?? ''}
            onChange={(v) => set({ short_description: v })}
            rows={2}
          />
          <Area label="Project summary (full)" value={form.description ?? ''} onChange={(v) => set({ description: v })} rows={3} />

          {/* Story */}
          <Area label="The challenge" value={form.problem ?? ''} onChange={(v) => set({ problem: v })} rows={4} />
          <Area label="Business requirement" value={form.business_requirement ?? ''} onChange={(v) => set({ business_requirement: v })} rows={3} />
          <Area label="The solution" value={form.solution ?? ''} onChange={(v) => set({ solution: v })} rows={4} />

          {/* Lists */}
          <div className="grid gap-4 md:grid-cols-2">
            <ListEditor
              label="Services provided"
              items={form.services_provided ?? []}
              onChange={(items) => set({ services_provided: items })}
              placeholder="Web Application Development"
            />
            <ListEditor
              label="Technology stack (verified only)"
              items={form.technologies ?? []}
              onChange={(items) => set({ technologies: items })}
              placeholder="React Native"
            />
          </div>
          <ListEditor
            label="Key capabilities / features"
            items={form.key_features ?? []}
            onChange={(items) => set({ key_features: items })}
            placeholder="Order management"
          />

          {/* Engineering */}
          <Area label="Architecture overview" value={form.architecture_overview ?? ''} onChange={(v) => set({ architecture_overview: v })} rows={3} />
          <Area label="Development approach" value={form.development_approach ?? ''} onChange={(v) => set({ development_approach: v })} rows={3} />
          <Area label="Results / outcome" value={form.outcome ?? ''} onChange={(v) => set({ outcome: v })} rows={3} />

          {/* Media */}
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Cover image URL" value={form.cover_image ?? ''} onChange={(v) => set({ cover_image: v })} placeholder="https://…/cover.png" />
            <Text label="Project logo URL" value={form.logo_url ?? ''} onChange={(v) => set({ logo_url: v })} />
          </div>
          <ListEditor
            label="Screenshots (image URLs)"
            items={form.screenshots ?? []}
            onChange={(items) => set({ screenshots: items })}
            placeholder="https://…/screenshot.png"
            hint="Upload files in the Media tab and paste their URLs here."
          />

          {/* CTA */}
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="CTA text" value={form.cta_text ?? ''} onChange={(v) => set({ cta_text: v })} placeholder="Visit LocalGo" />
            <Text label="CTA URL" value={form.cta_url ?? ''} onChange={(v) => set({ cta_url: v })} placeholder="https://…" />
          </div>

          {/* SEO */}
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="SEO title" value={form.seo_title ?? ''} onChange={(v) => set({ seo_title: v })} />
            <Text label="OG title" value={form.og_title ?? ''} onChange={(v) => set({ og_title: v })} />
          </div>
          <Area label="SEO description" value={form.seo_description ?? ''} onChange={(v) => set({ seo_description: v })} rows={2} />
          <Area label="OG description" value={form.og_description ?? ''} onChange={(v) => set({ og_description: v })} rows={2} />
          <Text label="OG image URL" value={form.og_image ?? ''} onChange={(v) => set({ og_image: v })} />

          <div className="flex justify-end gap-3">
            {editingId != null && (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-textMuted transition-colors hover:text-textMain"
              >
                Cancel
              </button>
            )}
            <SubmitButton loading={saving}>{editingId != null ? 'Update Project' : 'Create Project'}</SubmitButton>
          </div>
        </form>
      </Card>

      <Card title={`All projects (${rows.length})`}>
        {loading ? (
          <EmptyRow>Loading projects…</EmptyRow>
        ) : rows.length === 0 ? (
          <EmptyRow>No projects yet. Add your first case study above.</EmptyRow>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-bgDark p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-textMain">{row.title}</h3>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        row.status === 'published' ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.featured && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-textMuted">/work/{row.slug}</p>
                  {row.short_description && (
                    <p className="mt-1 line-clamp-1 text-sm text-textMuted">{row.short_description}</p>
                  )}
                </div>
                <RowActions onEdit={() => startEdit(row)} onDelete={() => remove(row)} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </Panel>
  );
}
