import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET — List categories */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const admin = createServerAdminSupabase();
  const { data, error } = await admin
    .from('resource_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** POST — Create or update a category */
export async function POST(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
  }

  const admin = createServerAdminSupabase();
  const id = body.id as number | undefined;
  const payload = {
    name: body.name as string,
    slug: body.slug as string,
    description: (body.description as string) || null,
    sort_order: (body.sort_order as number) ?? 0,
  };

  if (id) {
    const { data, error } = await admin
      .from('resource_categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    const { data, error } = await admin
      .from('resource_categories')
      .insert(payload)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
}

/** DELETE — Remove a category */
export async function DELETE(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const admin = createServerAdminSupabase();
  const { error } = await admin.from('resource_categories').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
