'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Area, Card, Check, Notice, SubmitButton, Text, inputCls } from '@/components/admin/ui';
import type { HomepageSettings } from '@/lib/settings';

const FALLBACK: HomepageSettings = {
  hero: {
    badge: 'Technology • Software • AI',
    heading: 'We Build Digital Products That Move Businesses Forward.',
    highlighted: 'Apps. Software. Websites. AI. Built Around Your Business.',
    description:
      'YAIdigitals designs and develops powerful digital products for ambitious businesses—from high-performance websites and custom applications to scalable platforms and AI-powered automation.',
    primary_cta_text: 'Start Your Project',
    primary_cta_url: '/contact',
    secondary_cta_text: 'Explore Our Work',
    secondary_cta_url: '/work',
    below_cta: 'Strategy • Design • Development • Deployment • Support',
  },
  sections: [],
};

const SECTION_LABELS: Record<string, string> = {
  work: 'Featured Projects',
  services: 'Services',
  industries: 'Industries',
  'ai-calling': 'AI Calling Agents',
  technology: 'Technology',
  process: 'Development Process',
  why: 'Why YAIdigitals',
  testimonials: 'Testimonials',
  insights: 'Insights',
  faq: 'FAQ',
};

export default function AdminHomepage() {
  const supabase = createClientSupabase();
  const [data, setData] = useState<HomepageSettings>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; message: string }>({ kind: 'ok', message: '' });

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from('settings').select('value').eq('key', 'homepage').maybeSingle();
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

  const hero = data.hero;
  const setHero = (patch: Partial<HomepageSettings['hero']>) =>
    setData((prev) => ({ ...prev, hero: { ...prev.hero, ...patch } }));

  const sections = [...data.sections].sort((a, b) => a.sort_order - b.sort_order);
  const setSection = (key: string, patch: Partial<HomepageSettings['sections'][number]>) =>
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.key === key ? { ...s, ...patch } : s)),
    }));
  const moveSection = (index: number, dir: -1 | 1) => {
    const ordered = [...sections];
    const j = index + dir;
    if (j < 0 || j >= ordered.length) return;
    [ordered[index], ordered[j]] = [ordered[j], ordered[index]];
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => {
        const idx = ordered.findIndex((o) => o.key === s.key);
        return { ...s, sort_order: idx + 1 };
      }),
    }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ kind: 'ok', message: '' });
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'homepage', value: JSON.stringify(data), updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setNotice(
      error
        ? { kind: 'error', message: `Save failed: ${error.message}` }
        : { kind: 'ok', message: 'Homepage saved. Changes are live on the site.' }
    );
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-sm text-textMuted">Loading homepage settings…</p>;

  return (
    <form onSubmit={save} className="space-y-6">
      <Notice {...notice} />

      <Card title="Hero section">
        <div className="space-y-4">
          <Text label="Small label (badge)" value={hero.badge} onChange={(v) => setHero({ badge: v })} />
          <Text label="Main heading (H1)" value={hero.heading} onChange={(v) => setHero({ heading: v })} required />
          <Text label="Highlighted line" value={hero.highlighted} onChange={(v) => setHero({ highlighted: v })} />
          <Area label="Description" value={hero.description} onChange={(v) => setHero({ description: v })} rows={3} />
          <div className="grid gap-4 md:grid-cols-2">
            <Text label="Primary CTA text" value={hero.primary_cta_text} onChange={(v) => setHero({ primary_cta_text: v })} />
            <Text label="Primary CTA URL" value={hero.primary_cta_url} onChange={(v) => setHero({ primary_cta_url: v })} />
            <Text label="Secondary CTA text" value={hero.secondary_cta_text} onChange={(v) => setHero({ secondary_cta_text: v })} />
            <Text label="Secondary CTA URL" value={hero.secondary_cta_url} onChange={(v) => setHero({ secondary_cta_url: v })} />
          </div>
          <Text label="Line below CTAs" value={hero.below_cta} onChange={(v) => setHero({ below_cta: v })} />
        </div>
      </Card>

      <Card title="Homepage sections">
        <p className="mb-4 text-sm text-textMuted">
          Enable, disable and reorder sections. Titles update the section headings on the homepage.
          Section content comes from their own admin areas (Projects, Services, Industries, etc.).
        </p>
        <div className="space-y-3">
          {sections.map((s, i) => (
            <div key={s.key} className="rounded-lg border border-border bg-bgDark p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Check
                    label={SECTION_LABELS[s.key] ?? s.key}
                    checked={s.enabled}
                    onChange={(v) => setSection(s.key, { enabled: v })}
                  />
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveSection(i, -1)}
                    aria-label={`Move ${s.key} up`}
                    className="h-8 w-8 rounded border border-border text-textMuted hover:text-textMain"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(i, 1)}
                    aria-label={`Move ${s.key} down`}
                    className="h-8 w-8 rounded border border-border text-textMuted hover:text-textMain"
                  >
                    ↓
                  </button>
                </div>
              </div>
              {s.enabled && (
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <input
                    type="text"
                    value={s.eyebrow}
                    placeholder="Eyebrow label"
                    onChange={(e) => setSection(s.key, { eyebrow: e.target.value })}
                    className={inputCls}
                    aria-label={`${s.key} eyebrow`}
                  />
                  <input
                    type="text"
                    value={s.title}
                    placeholder="Section heading"
                    onChange={(e) => setSection(s.key, { title: e.target.value })}
                    className={inputCls}
                    aria-label={`${s.key} title`}
                  />
                  <input
                    type="text"
                    value={s.description}
                    placeholder="Section description"
                    onChange={(e) => setSection(s.key, { description: e.target.value })}
                    className={inputCls}
                    aria-label={`${s.key} description`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <SubmitButton loading={saving}>Save Homepage</SubmitButton>
      </div>
    </form>
  );
}
