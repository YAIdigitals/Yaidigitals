'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { Card, Check, Notice, SubmitButton, Panel, Text } from '@/components/admin/ui';

type AdSettings = {
  id?: number;
  global_enabled: boolean;
  native_enabled: boolean;
  banner_300x250_enabled: boolean;
  banner_320x50_enabled: boolean;
  banner_728x90_enabled: boolean;
  website_id: string;
};

const DEFAULT: AdSettings = {
  global_enabled: false,
  native_enabled: true,
  banner_300x250_enabled: true,
  banner_320x50_enabled: true,
  banner_728x90_enabled: true,
  website_id: '6121931',
};

export default function AdminAdvertising() {
  const [settings, setSettings] = useState<AdSettings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  const getToken = useCallback(async () => {
    const { data } = await createClientSupabase().auth.getSession();
    return data?.session?.access_token ?? '';
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/resources/advertising', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await res.json();
      if (data) {
        setSettings({
          id: data.id,
          global_enabled: data.global_enabled ?? false,
          native_enabled: data.native_enabled ?? true,
          banner_300x250_enabled: data.banner_300x250_enabled ?? true,
          banner_320x50_enabled: data.banner_320x50_enabled ?? true,
          banner_728x90_enabled: data.banner_728x90_enabled ?? true,
          website_id: data.website_id || '6121931',
        });
      }
    } catch {
      setNotice({ kind: 'error', message: 'Failed to load advertising settings.' });
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/resources/advertising', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Save failed');
      setNotice({ kind: 'ok', message: 'Advertising settings updated!' });
      fetchSettings();
    } catch {
      setNotice({ kind: 'error', message: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <Panel>
      {notice && <Notice kind={notice.kind} message={notice.message} />}

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="Global Advertising Controls">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-bgDark p-4">
              <Check
                label="Enable advertisements globally"
                checked={settings.global_enabled}
                onChange={v => setSettings(s => ({ ...s, global_enabled: v }))}
              />
              <p className="mt-2 text-xs text-textMuted">
                When disabled, no advertisements will appear on any resource page. Individual resources can also disable ads independently.
              </p>
            </div>

            <Text
              label="Adsterra Website ID"
              value={settings.website_id}
              onChange={v => setSettings(s => ({ ...s, website_id: v }))}
              placeholder="6121931"
              hint="Your Adsterra publisher website ID"
            />
          </div>
        </Card>

        <Card title="Ad Format Controls">
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-bgDark p-4">
              <Check
                label="Native Banner"
                checked={settings.native_enabled}
                onChange={v => setSettings(s => ({ ...s, native_enabled: v }))}
              />
              <p className="mt-1 text-xs text-textMuted">
                Ad Unit: 31723170 — Content-integrated native advertisement
              </p>
            </div>

            <div className="rounded-lg border border-border bg-bgDark p-4">
              <Check
                label="300×250 Banner"
                checked={settings.banner_300x250_enabled}
                onChange={v => setSettings(s => ({ ...s, banner_300x250_enabled: v }))}
              />
              <p className="mt-1 text-xs text-textMuted">
                Ad Unit: 31723171 — Medium rectangle, shown on mobile and desktop
              </p>
            </div>

            <div className="rounded-lg border border-border bg-bgDark p-4">
              <Check
                label="320×50 Mobile Banner"
                checked={settings.banner_320x50_enabled}
                onChange={v => setSettings(s => ({ ...s, banner_320x50_enabled: v }))}
              />
              <p className="mt-1 text-xs text-textMuted">
                Ad Unit: 31723172 — Mobile-only leaderboard banner
              </p>
            </div>

            <div className="rounded-lg border border-border bg-bgDark p-4">
              <Check
                label="728×90 Desktop Banner"
                checked={settings.banner_728x90_enabled}
                onChange={v => setSettings(s => ({ ...s, banner_728x90_enabled: v }))}
              />
              <p className="mt-1 text-xs text-textMuted">
                Ad Unit: 31723173 — Desktop-only full-width leaderboard
              </p>
            </div>
          </div>
        </Card>

        <Card title="Integration Status">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-border bg-bgDark p-3">
              <span className="text-textMuted">Provider</span>
              <span className="font-medium text-textMain">Adsterra</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-bgDark p-3">
              <span className="text-textMuted">Website ID</span>
              <span className="font-mono text-primary">{settings.website_id}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-bgDark p-3">
              <span className="text-textMuted">Status</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${settings.global_enabled ? 'bg-primary/15 text-primary' : 'bg-yellow-500/15 text-yellow-400'}`}>
                {settings.global_enabled ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-textMuted">
              ⚠️ Verify ad scripts against the Adsterra publisher dashboard before enabling in production. Adult advertising is disabled. No popunders, forced redirects, or Smartlinks are implemented.
            </p>
            <a
              href="https://publishers.adsterra.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open Adsterra Dashboard →
            </a>
          </div>
        </Card>

        <SubmitButton loading={saving}>Save Advertising Settings</SubmitButton>
      </form>
    </Panel>
  );
}
