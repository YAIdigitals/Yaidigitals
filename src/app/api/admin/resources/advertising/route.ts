import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET — Read advertising settings */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const admin = createServerAdminSupabase();
  const { data, error } = await admin
    .from('advertising_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** POST — Update advertising settings */
export async function POST(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const admin = createServerAdminSupabase();
  const payload = {
    global_enabled: body.global_enabled ?? false,
    native_enabled: body.native_enabled ?? true,
    banner_300x250_enabled: body.banner_300x250_enabled ?? true,
    banner_320x50_enabled: body.banner_320x50_enabled ?? true,
    banner_728x90_enabled: body.banner_728x90_enabled ?? true,
    website_id: (body.website_id as string) || '6121931',
    config: body.config || {},
    updated_at: new Date().toISOString(),
  };

  // Upsert — there's only ever one row
  const { data: existing } = await admin
    .from('advertising_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await admin
      .from('advertising_settings')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    const { data, error } = await admin
      .from('advertising_settings')
      .insert({ ...payload, provider: 'adsterra' })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
}
