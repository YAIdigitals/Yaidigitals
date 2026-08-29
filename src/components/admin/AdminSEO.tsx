'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Area, Card, Notice, Panel, SubmitButton, Text } from '@/components/admin/ui';
import type { SeoSettings } from '@/lib/settings';

const FALLBACK: SeoSettings = {
  site_name: 'YAIdigitals',
  title_template: '%s | YAIdigitals',
  default_title: 'YAIdigitals | Apps, Software, Websites & AI Solutions',
  default_description:
    'YAIdigitals designs and develops mobile apps, web applications, business websites, custom software and AI-powered solutions for growing businesses.',
  canonical_domain: 'https://yaidigitals.co.in',
  og_image: '',
  twitter_handle: '',
  google_site_verification: '',
  organization: { name: 'YAIdigitals', email: 'info@yaidigitals.com' },
};

function titleLengthClass(len: number) {
  if (len === 0) return 'text-red-400';
  if (len < 30 || len > 60) return 'text-yellow-400';
  return 'text-primary';
}

function descriptionLengthClass(len: number) {
  if (len === 0) return 'text-red-400';
  if (len < 70 || len > 160) return 'text-yellow-400';
  return 'text-primary';
}

export default function AdminSEO() {
  const supabase = createClientSupabase();
  const [data, setData] = useState<SeoSettings>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from('settings').select('value').eq('key', 'seo').maybeSingle();
      if (rows?.value) {
        try {
          setData({ ...FALLBACK, ...JSON.parse(rows.value) });
        } catch {
          /* keep fallback */
        }
      }
      setLoading(false);
    })();
  }, [supabase]);

  const set = (patch: Partial<SeoSettings>) => setData((prev) => ({ ...prev, ...patch }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'seo', value: JSON.stringify(data), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: 'SEO defaults saved.' }
    );
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-sm text-textMuted">Loading SEO settings…</p>;

  const titleLen = data.default_title.length;
  const descLen = data.default_description.length;
  const domainOk = /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(data.canonical_domain);

  return (
    <form onSubmit={save} className="space-y-6">
      <Panel>
        <Notice {...notice} />

        {/* SERP preview */}
        <Card title="Search result preview">
          <div className="rounded-lg border border-border bg-bgDark p-5">
            <p className="text-sm text-[#8ab4f8]">{data.site_name}</p>
            <p className="mt-0.5 text-xs text-textMuted">
              {data.canonical_domain.replace(/^https?:\/\//, '')}
            </p>
            <p className="mt-1 text-lg text-[#d2e3fc]">
              {data.default_title || '— missing title —'}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-[#a3a3a3]">
              {data.default_description || '— missing meta description —'}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <span className={titleLengthClass(titleLen)}>Title: {titleLen} chars (aim 30–60)</span>
            <span className={descriptionLengthClass(descLen)}>Description: {descLen} chars (aim 70–160)</span>
            {!domainOk && <span className="text-red-400">Canonical domain should be https://…</span>}
          </div>
        </Card>

        <Card title="Defaults">
          <div className="space-y-4">
            <Text label="Site name" value={data.site_name} onChange={(v) => set({ site_name: v })} required />
            <Text label="Title template (%s is the page title)" value={data.title_template} onChange={(v) => set({ title_template: v })} />
            <Text label="Default title (homepage)" value={data.default_title} onChange={(v) => set({ default_title: v })} />
            <Area label="Default meta description" value={data.default_description} onChange={(v) => set({ default_description: v })} rows={3} />
            <Text
              label="Canonical domain"
              value={data.canonical_domain}
              onChange={(v) => set({ canonical_domain: v })}
              placeholder="https://yaidigitals.co.in"
            />
          </div>
        </Card>

        <Card title="Organization & social">
          <div className="space-y-4">
            <Text label="Organization name" value={data.organization?.name ?? ''} onChange={(v) => set({ organization: { ...data.organization, name: v } })} />
            <Text label="Organization email" type="email" value={data.organization?.email ?? ''} onChange={(v) => set({ organization: { ...data.organization, email: v } })} />
            <Text label="Twitter handle" value={data.twitter_handle} onChange={(v) => set({ twitter_handle: v })} placeholder="@yaidigitals" />
          </div>
        </Card>

        <Card title="Search console">
          <Text
            label="Google site verification code"
            value={data.google_site_verification}
            onChange={(v) => set({ google_site_verification: v })}
            hint="The value from Google Search Console's HTML tag method — exposed publicly in meta tags, safe to store."
          />
        </Card>

        <div className="flex justify-end">
          <SubmitButton loading={saving}>Save SEO Settings</SubmitButton>
        </div>
      </Panel>
    </form>
  );
}
