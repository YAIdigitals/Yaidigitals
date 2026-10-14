import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET — Resource analytics (admin only) */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const url = new URL(request.url);
  const resourceId = url.searchParams.get('resource_id');
  const days = parseInt(url.searchParams.get('days') || '30', 10);

  const admin = createServerAdminSupabase();
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Top resources by views
  const { data: topResources } = await admin
    .from('resources')
    .select('id, title, slug, view_count, download_count')
    .order('view_count', { ascending: false })
    .limit(10);

  // Recent events summary
  let eventsQuery = admin
    .from('resource_events')
    .select('event_type, utm_source, utm_campaign, created_at, resource_id')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })
    .limit(500);

  if (resourceId) {
    eventsQuery = eventsQuery.eq('resource_id', Number(resourceId));
  }

  const { data: events } = await eventsQuery;

  // Compute aggregates
  const views = (events ?? []).filter(e => e.event_type === 'view').length;
  const downloads = (events ?? []).filter(e => e.event_type === 'download_click').length;
  const ctr = views > 0 ? ((downloads / views) * 100).toFixed(1) : '0';

  // Referral breakdown
  const referrals: Record<string, number> = {};
  for (const e of events ?? []) {
    const source = e.utm_source || 'direct';
    referrals[source] = (referrals[source] || 0) + 1;
  }

  // Daily breakdown
  const daily: Record<string, { views: number; downloads: number }> = {};
  for (const e of events ?? []) {
    const day = e.created_at.split('T')[0];
    if (!daily[day]) daily[day] = { views: 0, downloads: 0 };
    if (e.event_type === 'view') daily[day].views++;
    else daily[day].downloads++;
  }

  // Total stats from resources table
  const { data: totals } = await admin
    .from('resources')
    .select('view_count, download_count')
    .eq('status', 'published');

  const totalViews = (totals ?? []).reduce((sum, r) => sum + (r.view_count || 0), 0);
  const totalDownloads = (totals ?? []).reduce((sum, r) => sum + (r.download_count || 0), 0);

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    totals: { views: totalViews, downloads: totalDownloads },
    period_stats: { views, downloads, ctr: `${ctr}%` },
    referrals,
    daily: Object.entries(daily).map(([date, stats]) => ({ date, ...stats })),
    top_resources: topResources ?? [],
  });
}
