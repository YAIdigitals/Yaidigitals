'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { Card, Text, Area, Select, Check, Notice, SubmitButton, Panel, Field, inputCls } from '@/components/admin/ui';
import { ArrowLeft, Copy } from 'lucide-react';

type Category = { id: number; name: string; slug: string; description: string | null; sort_order: number };

type ResourceData = {
  id?: number;
  title: string;
  slug: string;
  summary: string;
  article: string;
  category_id: string;
  tags: string;
  cover_image: string;
  file_type: string;
  file_name: string;
  file_size: string;
  google_drive_url: string;
  storage_path: string;
  external_download_url: string;
  seo_title: string;
  meta_description: string;
  og_image: string;
  featured: boolean;
  ads_enabled: boolean;
  status: string;
  published_at: string;
  scheduled_at: string;
};

const EMPTY: ResourceData = {
  title: '', slug: '', summary: '', article: '', category_id: '', tags: '',
  cover_image: '', file_type: 'pdf', file_name: '', file_size: '',
  google_drive_url: '', storage_path: '', external_download_url: '',
  seo_title: '', meta_description: '', og_image: '',
  featured: false, ads_enabled: true, status: 'draft',
  published_at: '', scheduled_at: '',
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminResourceEditor({
  resourceId,
  categories,
  onBack,
}: {
  resourceId: number | null;
  categories: Category[];
  onBack: () => void;
}) {
  const [form, setForm] = useState<ResourceData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);
  const [autoSlug, setAutoSlug] = useState(true);

  const getToken = useCallback(async () => {
    const { data } = await createClientSupabase().auth.getSession();
    return data?.session?.access_token ?? '';
  }, []);

  // Load existing resource
  useEffect(() => {
    if (!resourceId) return;
    setLoading(true);
    (async () => {
      const token = await getToken();
      const res = await fetch('/api/admin/resources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await res.json();
      const r = (data ?? []).find((d: { id: number }) => d.id === resourceId);
      if (r) {
        setForm({
          id: r.id,
          title: r.title || '',
          slug: r.slug || '',
          summary: r.summary || '',
          article: r.article || '',
          category_id: r.category_id ? String(r.category_id) : '',
          tags: Array.isArray(r.tags) ? r.tags.join(', ') : '',
          cover_image: r.cover_image || '',
          file_type: r.file_type || 'pdf',
          file_name: r.file_name || '',
          file_size: r.file_size ? String(r.file_size) : '',
          google_drive_url: r.google_drive_url || '',
          storage_path: r.storage_path || '',
          external_download_url: r.external_download_url || '',
          seo_title: r.seo_title || '',
          meta_description: r.meta_description || '',
          og_image: r.og_image || '',
          featured: r.featured ?? false,
          ads_enabled: r.ads_enabled ?? true,
          status: r.status || 'draft',
          published_at: r.published_at || '',
          scheduled_at: r.scheduled_at || '',
        });
        setAutoSlug(false);
      }
      setLoading(false);
    })();
  }, [resourceId, getToken]);

  const set = (key: keyof ResourceData, value: string | boolean) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && autoSlug && typeof value === 'string') {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const token = await getToken();
      const payload = {
        ...(form.id ? { id: form.id } : {}),
        title: form.title,
        slug: form.slug,
        summary: form.summary || null,
        article: form.article || null,
        category_id: form.category_id ? Number(form.category_id) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        cover_image: form.cover_image || null,
        file_type: form.file_type || null,
        file_name: form.file_name || null,
        file_size: form.file_size ? Number(form.file_size) : null,
        google_drive_url: form.google_drive_url || null,
        storage_path: form.storage_path || null,
        external_download_url: form.external_download_url || null,
        seo_title: form.seo_title || null,
        meta_description: form.meta_description || null,
        og_image: form.og_image || null,
        featured: form.featured,
        ads_enabled: form.ads_enabled,
        status: form.status,
        published_at: form.published_at || null,
        scheduled_at: form.scheduled_at || null,
      };

      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Save failed');

      setNotice({ kind: 'ok', message: form.id ? 'Resource updated!' : 'Resource created!' });
      if (!form.id && result.data?.id) {
        setForm(prev => ({ ...prev, id: result.data.id }));
      }
    } catch (e) {
      setNotice({ kind: 'error', message: e instanceof Error ? e.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const copyDMMessage = () => {
    const url = `https://www.yaidigitals.co.in/resources/${form.slug}?utm_source=instagram&utm_medium=dm`;
    const msg = `Hey! 👋 Here's your free resource: "${form.title}"\n\n📄 Download it here:\n${url}\n\nEnjoy! 🎉`;
    navigator.clipboard.writeText(msg);
    setNotice({ kind: 'ok', message: 'DM message copied!' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Panel>
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h2 className="text-lg font-bold text-textMain">
          {form.id ? 'Edit Resource' : 'New Resource'}
        </h2>
      </div>

      {notice && <Notice kind={notice.kind} message={notice.message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core */}
        <Card title="Resource Details">
          <div className="space-y-4">
            <Text label="Title" value={form.title} onChange={v => set('title', v)} required placeholder="6 Documents Before Vibe Coding" />
            <div>
              <Text
                label="Slug"
                value={form.slug}
                onChange={v => { setAutoSlug(false); set('slug', v); }}
                required
                placeholder="6-documents-before-vibe-coding"
                hint="URL path: /resources/your-slug"
              />
            </div>
            <Area label="Summary" value={form.summary} onChange={v => set('summary', v)} rows={3} placeholder="Short description shown in listings…" />
            <Area label="Article Content" value={form.article} onChange={v => set('article', v)} rows={12} placeholder="Detailed educational article content (supports markdown-style formatting)…" />
            <Select
              label="Category"
              value={form.category_id}
              onChange={v => set('category_id', v)}
              options={[{ value: '', label: 'None' }, ...categories.map(c => ({ value: String(c.id), label: c.name }))]}
            />
            <Text label="Tags" value={form.tags} onChange={v => set('tags', v)} placeholder="vibe-coding, ai, development" hint="Comma-separated tags" />
          </div>
        </Card>

        {/* File Delivery */}
        <Card title="File Delivery">
          <div className="space-y-4">
            <Select
              label="File Type"
              value={form.file_type}
              onChange={v => set('file_type', v)}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'zip', label: 'ZIP Archive' },
                { value: 'doc', label: 'Document' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Text label="File Name" value={form.file_name} onChange={v => set('file_name', v)} placeholder="6-documents-vibe-coding.pdf" />
            <Text label="File Size (bytes)" value={form.file_size} onChange={v => set('file_size', v)} type="number" placeholder="1048576" />
            <Text
              label="Google Drive URL"
              value={form.google_drive_url}
              onChange={v => set('google_drive_url', v)}
              placeholder="https://drive.google.com/file/d/..."
              hint="Paste a Google Drive sharing URL. Ensure the file has appropriate sharing permissions."
            />
            <Text
              label="External Download URL"
              value={form.external_download_url}
              onChange={v => set('external_download_url', v)}
              placeholder="https://example.com/file.pdf"
              hint="HTTPS links only. Alternative to Google Drive."
            />
            <Text label="Supabase Storage Path" value={form.storage_path} onChange={v => set('storage_path', v)} placeholder="resources/file.pdf" hint="Supabase Storage object path (if uploaded)" />
          </div>
        </Card>

        {/* Media */}
        <Card title="Media">
          <div className="space-y-4">
            <Text label="Cover Image URL" value={form.cover_image} onChange={v => set('cover_image', v)} placeholder="/brand/resource-cover.jpg" />
            <Text label="Open Graph Image" value={form.og_image} onChange={v => set('og_image', v)} placeholder="/brand/resource-og.jpg" hint="Social sharing preview image" />
          </div>
        </Card>

        {/* SEO */}
        <Card title="SEO">
          <div className="space-y-4">
            <Text label="SEO Title" value={form.seo_title} onChange={v => set('seo_title', v)} placeholder="Custom page title for search engines" hint="Defaults to resource title if empty" />
            <Area label="Meta Description" value={form.meta_description} onChange={v => set('meta_description', v)} rows={3} placeholder="Meta description for search results (70-160 chars)" />
          </div>
        </Card>

        {/* Publishing */}
        <Card title="Publishing">
          <div className="space-y-4">
            <Select
              label="Status"
              value={form.status}
              onChange={v => set('status', v)}
              options={[
                { value: 'draft', label: '📝 Draft' },
                { value: 'published', label: '🟢 Published' },
                { value: 'scheduled', label: '📅 Scheduled' },
                { value: 'archived', label: '📦 Archived' },
              ]}
            />
            {form.status === 'scheduled' && (
              <Field label="Scheduled Date">
                <input
                  type="datetime-local"
                  value={form.scheduled_at ? form.scheduled_at.slice(0, 16) : ''}
                  onChange={e => set('scheduled_at', e.target.value ? new Date(e.target.value).toISOString() : '')}
                  className={inputCls}
                />
              </Field>
            )}
            <div className="flex flex-wrap gap-6">
              <Check label="Featured" checked={form.featured} onChange={v => set('featured', v)} />
              <Check label="Advertisements enabled" checked={form.ads_enabled} onChange={v => set('ads_enabled', v)} />
            </div>
          </div>
        </Card>

        {/* Instagram DM */}
        {form.slug && (
          <Card title="Instagram Campaign">
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-bgDark p-4 text-sm">
                <p className="text-textMuted">Generated tracking URL:</p>
                <code className="mt-1 block break-all text-primary">
                  https://www.yaidigitals.co.in/resources/{form.slug}?utm_source=instagram&utm_medium=dm
                </code>
              </div>
              <button
                type="button"
                onClick={copyDMMessage}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
              >
                <Copy size={14} /> Copy DM Message
              </button>
            </div>
          </Card>
        )}

        <div className="flex items-center gap-3">
          <SubmitButton loading={saving}>
            {form.id ? 'Update Resource' : 'Create Resource'}
          </SubmitButton>
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-border px-5 py-2.5 text-sm text-textMuted transition-colors hover:text-textMain"
          >
            Cancel
          </button>
        </div>
      </form>
    </Panel>
  );
}
