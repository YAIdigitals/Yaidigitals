'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Area, Card, Notice, Panel, SubmitButton, Text } from '@/components/admin/ui';
import type { SiteSettings, IntegrationSettings } from '@/lib/settings';

const FALLBACK: SiteSettings = {
  company_name: 'YAIdigitals',
  contact_email: 'info@yaidigitals.com',
  contact_phone: '',
  whatsapp: '',
  address: '',
  business_hours: '',
  social: { instagram: '', facebook: '', twitter: '', linkedin: '' },
  footer_description: 'Technology built around your business.',
  default_cta_text: 'Start a Project',
  default_cta_url: '/contact',
};

export default function AdminSiteSettings() {
  const supabase = createClientSupabase();
  const [data, setData] = useState<SiteSettings>(FALLBACK);
  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    google_analytics_id: '',
    tag_manager_id: '',
    meta_pixel_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['site', 'integrations']);
      for (const row of rows ?? []) {
        try {
          if (row.key === 'site') setData({ ...FALLBACK, ...JSON.parse(row.value) });
          if (row.key === 'integrations') setIntegrations((prev) => ({ ...prev, ...JSON.parse(row.value) }));
        } catch {
          /* keep fallback */
        }
      }
      setLoading(false);
    })();
  }, [supabase]);

  const set = (patch: Partial<SiteSettings>) => setData((prev) => ({ ...prev, ...patch }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });
    const [siteResult, integrationsResult] = await Promise.all([
      supabase
        .from('settings')
        .upsert({ key: 'site', value: JSON.stringify(data), updated_at: new Date().toISOString() }, { onConflict: 'key' }),
      supabase
        .from('settings')
        .upsert({ key: 'integrations', value: JSON.stringify(integrations), updated_at: new Date().toISOString() }, { onConflict: 'key' }),
    ]);
    const error = siteResult.error ?? integrationsResult.error;
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: 'Site settings saved.' }
    );
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-sm text-textMuted">Loading site settings…</p>;

  return (
    <form onSubmit={save} className="space-y-6">
      <Panel>
        <Notice {...notice} />

        <Card title="Company information">
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Company name" value={data.company_name} onChange={(v) => set({ company_name: v })} required />
            <Text label="Contact email" type="email" value={data.contact_email} onChange={(v) => set({ contact_email: v })} />
            <Text label="Phone" value={data.contact_phone} onChange={(v) => set({ contact_phone: v })} placeholder="+91 …" />
            <Text label="WhatsApp" value={data.whatsapp} onChange={(v) => set({ whatsapp: v })} placeholder="+91 …" />
            <Text label="Business hours" value={data.business_hours} onChange={(v) => set({ business_hours: v })} placeholder="Mon–Sat, 10am–7pm IST" />
            <Text label="Address" value={data.address} onChange={(v) => set({ address: v })} hint="Only shown if filled in — leave empty if you don't publish an address." />
          </div>
        </Card>

        <Card title="Social links">
          <p className="mb-4 text-sm text-textMuted">Only real profiles — links left empty are hidden from the site.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Instagram" value={data.social.instagram} onChange={(v) => set({ social: { ...data.social, instagram: v } })} placeholder="https://instagram.com/…" />
            <Text label="Facebook" value={data.social.facebook} onChange={(v) => set({ social: { ...data.social, facebook: v } })} placeholder="https://facebook.com/…" />
            <Text label="Twitter / X" value={data.social.twitter} onChange={(v) => set({ social: { ...data.social, twitter: v } })} placeholder="https://twitter.com/…" />
            <Text label="LinkedIn" value={data.social.linkedin} onChange={(v) => set({ social: { ...data.social, linkedin: v } })} placeholder="https://linkedin.com/company/…" />
          </div>
        </Card>

        <Card title="Footer & default CTA">
          <div className="grid gap-4 md:grid-cols-2">
            <Area label="Footer description" value={data.footer_description} onChange={(v) => set({ footer_description: v })} rows={2} />
            <div className="grid content-start gap-4">
              <Text label="Default CTA text" value={data.default_cta_text} onChange={(v) => set({ default_cta_text: v })} />
              <Text label="Default CTA URL" value={data.default_cta_url} onChange={(v) => set({ default_cta_url: v })} />
            </div>
          </div>
        </Card>

        <Card title="Integrations">
          <p className="mb-4 text-sm text-textMuted">
            Analytics IDs are public by nature (they ship in page HTML). Secrets like SMTP or AI
            provider keys belong in environment variables — never here.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Text
              label="Google Analytics ID"
              value={integrations.google_analytics_id}
              onChange={(v) => setIntegrations((prev) => ({ ...prev, google_analytics_id: v }))}
              placeholder="G-XXXXXXXXXX"
            />
            <Text
              label="Meta Pixel ID"
              value={integrations.meta_pixel_id}
              onChange={(v) => setIntegrations((prev) => ({ ...prev, meta_pixel_id: v }))}
              placeholder="XXXXXXXXXXXXXXX"
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <SubmitButton loading={saving}>Save Site Settings</SubmitButton>
        </div>
      </Panel>
    </form>
  );
}
