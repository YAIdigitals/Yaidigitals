'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientSupabase } from '@/lib/supabase/client';
import { Card, Notice, Panel, Select } from '@/components/admin/ui';
import { Eye, Download, TrendingUp, BarChart3 } from 'lucide-react';

type AnalyticsData = {
  totals: { views: number; downloads: number };
  period_stats: { views: number; downloads: number; ctr: string };
  referrals: Record<string, number>;
  daily: { date: string; views: number; downloads: number }[];
  top_resources: { id: number; title: string; slug: string; view_count: number; download_count: number }[];
  period: { days: number };
};

export default function AdminResourceAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState('30');

  const getToken = useCallback(async () => {
    const { data } = await createClientSupabase().auth.getSession();
    return data?.session?.access_token ?? '';
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/resources/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load analytics');
      const result = await res.json();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [getToken, days]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) return <Notice kind="error" message={error} />;
  if (!data) return null;

  const maxDailyViews = Math.max(...data.daily.map(d => d.views), 1);

  return (
    <Panel>
      {/* Period selector */}
      <div className="flex justify-end">
        <Select
          label=""
          value={days}
          onChange={setDays}
          options={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
          ]}
        />
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Views', value: data.totals.views, icon: Eye, color: 'text-blue-400' },
          { label: 'Total Downloads', value: data.totals.downloads, icon: Download, color: 'text-primary' },
          { label: `${days}d Views`, value: data.period_stats.views, icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Click-Through', value: data.period_stats.ctr, icon: BarChart3, color: 'text-accentYellow' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-bgCard p-4">
            <div className="flex items-center gap-2">
              <s.icon size={14} className={s.color} />
              <span className="text-xs text-textMuted">{s.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-textMain">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Daily chart */}
      {data.daily.length > 0 && (
        <Card title={`Daily Traffic (${days} days)`}>
          <div className="flex items-end gap-1 h-32">
            {data.daily.slice(-30).map(d => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.views} views, ${d.downloads} downloads`}>
                <div
                  className="w-full rounded-t bg-primary/60 transition-all hover:bg-primary min-h-[2px]"
                  style={{ height: `${Math.max((d.views / maxDailyViews) * 100, 2)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-textMuted">
            <span>{data.daily[0]?.date}</span>
            <span>{data.daily[data.daily.length - 1]?.date}</span>
          </div>
        </Card>
      )}

      {/* Top resources */}
      <Card title="Top Resources">
        {data.top_resources.length === 0 ? (
          <p className="py-6 text-center text-sm text-textMuted">No resource data yet.</p>
        ) : (
          <div className="space-y-2">
            {data.top_resources.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bgDark p-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-textMain">{r.title}</span>
                </div>
                <div className="flex shrink-0 gap-4 text-xs text-textMuted">
                  <span className="flex items-center gap-1"><Eye size={11} /> {r.view_count}</span>
                  <span className="flex items-center gap-1"><Download size={11} /> {r.download_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Referral sources */}
      <Card title="Traffic Sources">
        {Object.keys(data.referrals).length === 0 ? (
          <p className="py-6 text-center text-sm text-textMuted">No traffic data for this period.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(data.referrals)
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => {
                const total = Object.values(data.referrals).reduce((s, c) => s + c, 0);
                const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0';
                return (
                  <div key={source} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-bgDark p-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-sm font-medium text-textMain capitalize">{source}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-border">
                        <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-textMuted">{count} ({pct}%)</span>
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </Panel>
  );
}
