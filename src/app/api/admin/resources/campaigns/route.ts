import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET — List all campaigns */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const admin = createServerAdminSupabase();
  const { data, error } = await admin
    .from('resource_campaigns')
    .select('*, resource:resources(id, title, slug)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** POST — Create or update a campaign */
export async function POST(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!body.name || !body.resource_id) {
    return NextResponse.json({ error: 'Name and resource_id are required' }, { status: 400 });
  }

  const admin = createServerAdminSupabase();
  const id = body.id as number | undefined;
  const payload = {
    name: body.name as string,
    resource_id: body.resource_id as number,
    reel_id: (body.reel_id as string) || null,
    comment_keyword: (body.comment_keyword as string) || null,
    landing_url: (body.landing_url as string) || null,
    utm_source: (body.utm_source as string) || 'instagram',
    utm_medium: (body.utm_medium as string) || 'dm',
    utm_campaign: (body.utm_campaign as string) || null,
    automation_provider: (body.automation_provider as string) || 'manychat',
    automation_status: (body.automation_status as string) || 'manual',
    external_ref: (body.external_ref as string) || null,
    notes: (body.notes as string) || null,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { data, error } = await admin
      .from('resource_campaigns')
      .update(payload)
      .eq('id', id)
      .select('*, resource:resources(id, title, slug)')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    const { data, error } = await admin
      .from('resource_campaigns')
      .insert(payload)
      .select('*, resource:resources(id, title, slug)')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
}

/** DELETE — Remove a campaign */
export async function DELETE(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const admin = createServerAdminSupabase();
  const { error } = await admin.from('resource_campaigns').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
