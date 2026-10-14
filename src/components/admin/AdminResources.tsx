'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { Card, Notice, EmptyRow, Panel } from '@/components/admin/ui';
import AdminResourceEditor from '@/components/admin/AdminResourceEditor';
import { Eye, Download, FileText, Plus, Search, Copy, Pencil, Trash2, Globe, ExternalLink } from 'lucide-react';

type Resource = {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  status: string;
  featured: boolean;
  ads_enabled: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  published_at: string | null;
  category: { id: number; name: string; slug: string } | null;
};

type Category = { id: number; name: string; slug: string; description: string | null; sort_order: number };

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  const getToken = useCallback(async () => {
    const { data } = await createClientSupabase().auth.getSession();
    return data?.session?.access_token ?? '';
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [resRes, catRes] = await Promise.all([
        fetch('/api/admin/resources', { headers }),
        fetch('/api/admin/resources/categories', { headers }),
      ]);

      if (!resRes.ok) throw new Error('Failed to load resources');
      const resData = await resRes.json();
      const catData = await catRes.json();

      setResources(resData.data ?? []);
      setCategories(catData.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setNotice({ kind: 'ok', message: `"${title}" deleted.` });
      fetchAll();
    } catch {
      setNotice({ kind: 'error', message: 'Failed to delete resource.' });
    }
  };

  const handleToggleStatus = async (resource: Resource) => {
    const newStatus = resource.status === 'published' ? 'draft' : 'published';
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, title: resource.title, slug: resource.slug, status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      setNotice({ kind: 'ok', message: `"${resource.title}" ${newStatus === 'published' ? 'published' : 'unpublished'}.` });
      fetchAll();
    } catch {
      setNotice({ kind: 'error', message: 'Failed to update status.' });
    }
  };

  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(`https://www.yaidigitals.co.in/resources/${slug}`);
    setNotice({ kind: 'ok', message: 'Public URL copied!' });
  };

  if (editingId !== null || creating) {
    return (
      <AdminResourceEditor
        resourceId={editingId}
        categories={categories}
        onBack={() => { setEditingId(null); setCreating(false); fetchAll(); }}
      />
    );
  }

  // Filter/search
  const filtered = resources.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterCategory !== 'all' && r.category?.slug !== filterCategory) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: resources.length,
    published: resources.filter(r => r.status === 'published').length,
    drafts: resources.filter(r => r.status === 'draft').length,
    totalViews: resources.reduce((s, r) => s + r.view_count, 0),
    totalDownloads: resources.reduce((s, r) => s + r.download_count, 0),
  };

  return (
    <Panel>
      {notice && <Notice kind={notice.kind} message={notice.message} />}

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, icon: FileText },
          { label: 'Published', value: stats.published, icon: Globe },
          { label: 'Drafts', value: stats.drafts, icon: FileText },
          { label: 'Views', value: stats.totalViews, icon: Eye },
          { label: 'Downloads', value: stats.totalDownloads, icon: Download },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-bgCard p-4">
            <div className="flex items-center gap-2 text-textMuted">
              <s.icon size={14} />
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-textMain">{s.value}</p>
          </div>
        ))}
      </div>

      <Card
        title="Resources"
        actions={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-bgDark transition-colors hover:bg-primaryDark"
          >
            <Plus size={16} /> New Resource
          </button>
        }
      >
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
            <input
              type="text"
              placeholder="Search resources…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-bgDark py-2 pl-9 pr-3 text-sm text-textMain placeholder:text-textMuted/50 focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-lg border border-border bg-bgDark px-3 py-2 text-sm text-textMain focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="rounded-lg border border-border bg-bgDark px-3 py-2 text-sm text-textMain focus:border-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <Notice kind="error" message={error} />
        ) : filtered.length === 0 ? (
          <EmptyRow>No resources found. Click &quot;New Resource&quot; to create one.</EmptyRow>
        ) : (
          <div className="space-y-2">
            {filtered.map(r => (
              <div
                key={r.id}
                className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-bgDark p-4 transition-colors hover:border-primary/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium text-textMain">{r.title}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      r.status === 'published'
                        ? 'bg-primary/15 text-primary'
                        : r.status === 'draft'
                          ? 'bg-yellow-500/15 text-yellow-400'
                          : r.status === 'archived'
                            ? 'bg-red-500/15 text-red-400'
                            : 'bg-blue-500/15 text-blue-400'
                    }`}>
                      {r.status}
                    </span>
                    {r.featured && (
                      <span className="shrink-0 rounded-full bg-accentYellow/15 px-2 py-0.5 text-[10px] font-medium text-accentYellow">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-textMuted">
                    {r.category && <span>{r.category.name}</span>}
                    <span className="flex items-center gap-1"><Eye size={11} /> {r.view_count}</span>
                    <span className="flex items-center gap-1"><Download size={11} /> {r.download_count}</span>
                    {r.published_at && <span>Published {new Date(r.published_at).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditingId(r.id)}
                    title="Edit"
                    className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(r)}
                    title={r.status === 'published' ? 'Unpublish' : 'Publish'}
                    className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"
                  >
                    <Globe size={14} />
                  </button>
                  <button
                    onClick={() => copyUrl(r.slug)}
                    title="Copy public URL"
                    className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy size={14} />
                  </button>
                  {r.status === 'published' && (
                    <a
                      href={`/resources/${r.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Preview"
                      className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(r.id, r.title)}
                    title="Delete"
                    className="rounded p-1.5 text-textMuted hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Panel>
  );
}
