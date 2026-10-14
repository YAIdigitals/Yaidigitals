import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/resources/events — Log a resource event (view or download_click).
 * Public endpoint — RLS allows anonymous inserts into resource_events.
 * No PII is collected. Only page-level context is stored.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const resourceId = Number(body.resource_id);
  const eventType = body.event_type as string;

  if (!resourceId || !['view', 'download_click'].includes(eventType)) {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  // Detect device type from User-Agent
  const ua = request.headers.get('user-agent') || '';
  let deviceType: string | null = null;
  if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';
  else if (/mobile|android|iphone/i.test(ua)) deviceType = 'mobile';
  else if (ua) deviceType = 'desktop';

  const supabase = createServerSupabase();
  const { error } = await supabase.from('resource_events').insert({
    resource_id: resourceId,
    event_type: eventType,
    referrer: (body.referrer as string) || null,
    utm_source: (body.utm_source as string) || null,
    utm_medium: (body.utm_medium as string) || null,
    utm_campaign: (body.utm_campaign as string) || null,
    device_type: deviceType,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
