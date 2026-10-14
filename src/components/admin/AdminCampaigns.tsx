'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { Card, Text, Area, Select, Notice, SubmitButton, Panel, EmptyRow } from '@/components/admin/ui';
import { Plus, Copy, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';

type Campaign = {
  id: number;
  name: string;
  resource_id: number;
  reel_id: string | null;
  comment_keyword: string | null;
  landing_url: string | null;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string | null;
  automation_provider: string;
  automation_status: string;
  notes: string | null;
  resource?: { id: number; title: string; slug: string };
};

type ResourceOption = { id: number; title: string; slug: string };

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  // Form
  const [name, setName] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [reelId, setReelId] = useState('');
  const [keyword, setKeyword] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [provider, setProvider] = useState('manychat');
  const [automationStatus, setAutoStatus] = useState('manual');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const getToken = useCallback(async () => {
    const { data } = await createClientSupabase().auth.getSession();
    return data?.session?.access_token ?? '';
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [cRes, rRes] = await Promise.all([
        fetch('/api/admin/resources/campaigns', { headers }),
        fetch('/api/admin/resources', { headers }),
      ]);
      const cData = await cRes.json();
      const rData = await rRes.json();
      setCampaigns(cData.data ?? []);
      setResources((rData.data ?? []).map((r: ResourceOption) => ({ id: r.id, title: r.title, slug: r.slug })));
    } catch {
      setNotice({ kind: 'error', message: 'Failed to load campaigns.' });
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openEditor = (c?: Campaign) => {
    if (c) {
      setEditing(c);
      setCreating(false);
      setName(c.name);
      setResourceId(String(c.resource_id));
      setReelId(c.reel_id || '');
      setKeyword(c.comment_keyword || '');
      setUtmCampaign(c.utm_campaign || '');
      setProvider(c.automation_provider || 'manychat');
      setAutoStatus(c.automation_status || 'manual');
      setNotes(c.notes || '');
    } else {
      setEditing(null);
      setCreating(true);
      setName('');
      setResourceId('');
      setReelId('');
      setKeyword('');
      setUtmCampaign('');
      setProvider('manychat');
      setAutoStatus('manual');
      setNotes('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const token = await getToken();
      const selResource = resources.find(r => r.id === Number(resourceId));
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        name,
        resource_id: Number(resourceId),
        reel_id: reelId || null,
        comment_keyword: keyword || null,
        landing_url: selResource ? `https://www.yaidigitals.co.in/resources/${selResource.slug}` : null,
        utm_campaign: utmCampaign || null,
        automation_provider: provider,
        automation_status: automationStatus,
        notes: notes || null,
      };
      const res = await fetch('/api/admin/resources/campaigns', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setNotice({ kind: 'ok', message: editing ? 'Campaign updated!' : 'Campaign created!' });
      setEditing(null);
      setCreating(false);
      fetchAll();
    } catch {
      setNotice({ kind: 'error', message: 'Failed to save campaign.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      const token = await getToken();
      await fetch(`/api/admin/resources/campaigns?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotice({ kind: 'ok', message: 'Campaign deleted.' });
      fetchAll();
    } catch {
      setNotice({ kind: 'error', message: 'Failed to delete.' });
    }
  };

  const copyTrackingUrl = (c: Campaign) => {
    const slug = c.resource?.slug || '';
    const url = `https://www.yaidigitals.co.in/resources/${slug}?utm_source=${c.utm_source}&utm_medium=${c.utm_medium}${c.utm_campaign ? `&utm_campaign=${c.utm_campaign}` : ''}`;
    navigator.clipboard.writeText(url);
    setNotice({ kind: 'ok', message: 'Tracking URL copied!' });
  };

  const copyDMMessage = (c: Campaign) => {
    const slug = c.resource?.slug || '';
    const url = `https://www.yaidigitals.co.in/resources/${slug}?utm_source=${c.utm_source}&utm_medium=${c.utm_medium}${c.utm_campaign ? `&utm_campaign=${c.utm_campaign}` : ''}`;
    const msg = `Hey! 👋 Here's your free resource: "${c.resource?.title || c.name}"\n\n📄 Download it here:\n${url}\n\nEnjoy! 🎉`;
    navigator.clipboard.writeText(msg);
    setNotice({ kind: 'ok', message: 'DM message copied!' });
  };

  if (editing || creating) {
    const selectedResource = resources.find(r => r.id === Number(resourceId));
    return (
      <Panel>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditing(null); setCreating(false); }} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-textMuted hover:text-textMain">
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-lg font-bold text-textMain">{editing ? 'Edit Campaign' : 'New Campaign'}</h2>
        </div>

        {notice && <Notice kind={notice.kind} message={notice.message} />}

        <form onSubmit={handleSave} className="space-y-6">
          <Card title="Campaign Details">
            <div className="space-y-4">
              <Text label="Campaign Name" value={name} onChange={setName} required placeholder="6 Documents Before Vibe Coding — Instagram" />
              <Select label="Resource" value={resourceId} onChange={setResourceId} options={[{ value: '', label: 'Select a resource…' }, ...resources.map(r => ({ value: String(r.id), label: r.title }))]} />
              <Text label="Reel / Post ID" value={reelId} onChange={setReelId} placeholder="Instagram reel or post ID" />
              <Text label="Comment Keyword" value={keyword} onChange={setKeyword} placeholder="DOC" hint="Keyword users comment to trigger DM automation" />
              <Text label="UTM Campaign" value={utmCampaign} onChange={setUtmCampaign} placeholder="6_documents" hint="Campaign identifier for tracking" />
            </div>
          </Card>

          <Card title="Automation">
            <div className="space-y-4">
              <Select label="Provider" value={provider} onChange={setProvider} options={[
                { value: 'manychat', label: 'Manychat' },
                { value: 'chatfuel', label: 'Chatfuel' },
                { value: 'meta_api', label: 'Meta API (future)' },
                { value: 'manual', label: 'Manual' },
              ]} />
              <Select label="Automation Status" value={automationStatus} onChange={setAutoStatus} options={[
                { value: 'manual', label: '🔧 Manual — Not automated' },
                { value: 'configured', label: '⚙️ Configured — Ready to test' },
                { value: 'active', label: '🟢 Active — Running' },
                { value: 'paused', label: '⏸️ Paused' },
              ]} />
              <Area label="Notes" value={notes} onChange={setNotes} rows={3} placeholder="Setup instructions or campaign notes…" />
            </div>
          </Card>

          {selectedResource && (
            <Card title="Generated Outputs">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-textMuted">Tracking URL:</p>
                  <code className="mt-1 block break-all rounded bg-bgDark p-2 text-primary">
                    https://www.yaidigitals.co.in/resources/{selectedResource.slug}?utm_source=instagram&utm_medium=dm{utmCampaign ? `&utm_campaign=${utmCampaign}` : ''}
                  </code>
                </div>
                {keyword && (
                  <div>
                    <p className="text-textMuted">Comment keyword:</p>
                    <code className="mt-1 block rounded bg-bgDark p-2 font-bold text-accentYellow">{keyword}</code>
                  </div>
                )}
                <p className="text-xs text-textMuted">
                  ⚠️ Instagram DM automation requires a configured Manychat or Chatfuel account. Set up the automation flow in your chosen provider using the tracking URL above.
                </p>
              </div>
            </Card>
          )}

          <div className="flex items-center gap-3">
            <SubmitButton loading={saving}>{editing ? 'Update Campaign' : 'Create Campaign'}</SubmitButton>
          </div>
        </form>
      </Panel>
    );
  }

  return (
    <Panel>
      {notice && <Notice kind={notice.kind} message={notice.message} />}

      <Card
        title="Instagram Campaigns"
        actions={
          <button onClick={() => openEditor()} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-bgDark hover:bg-primaryDark">
            <Plus size={16} /> New Campaign
          </button>
        }
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyRow>No campaigns yet. Create one to generate tracking URLs and DM templates.</EmptyRow>
        ) : (
          <div className="space-y-2">
            {campaigns.map(c => (
              <div key={c.id} className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-bgDark p-4 hover:border-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} className="shrink-0 text-pink-400" />
                    <h3 className="truncate font-medium text-textMain">{c.name}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                      c.automation_status === 'active' ? 'bg-primary/15 text-primary' :
                      c.automation_status === 'configured' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {c.automation_status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-textMuted">
                    {c.resource?.title && <span>→ {c.resource.title}</span>}
                    {c.comment_keyword && <span>Keyword: <strong className="text-accentYellow">{c.comment_keyword}</strong></span>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5 opacity-60 group-hover:opacity-100">
                  <button onClick={() => copyTrackingUrl(c)} title="Copy URL" className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"><Copy size={14} /></button>
                  <button onClick={() => copyDMMessage(c)} title="Copy DM" className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary"><MessageCircle size={14} /></button>
                  <button onClick={() => openEditor(c)} title="Edit" className="rounded p-1.5 text-textMuted hover:bg-primary/10 hover:text-primary">✏️</button>
                  <button onClick={() => handleDelete(c.id)} title="Delete" className="rounded p-1.5 text-textMuted hover:bg-red-500/10 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Panel>
  );
}
