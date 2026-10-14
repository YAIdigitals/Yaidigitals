import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** GET /api/admin/resources — List all resources (admin) */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const admin = createServerAdminSupabase();
  const { data, error } = await admin
    .from('resources')
    .select('*, category:resource_categories(id, name, slug)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** POST /api/admin/resources — Create or update a resource */
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
  const id = body.id as number | undefined;

  // Validate required fields
  if (!body.title || !body.slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  // Google Drive URL validation
  if (body.google_drive_url && typeof body.google_drive_url === 'string') {
    try {
      const url = new URL(body.google_drive_url as string);
      if (url.protocol !== 'https:' || (url.hostname !== 'drive.google.com' && url.hostname !== 'docs.google.com')) {
        return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid Google Drive URL format' }, { status: 400 });
    }
  }

  // External URL validation
  if (body.external_download_url && typeof body.external_download_url === 'string') {
    try {
      const url = new URL(body.external_download_url as string);
      if (url.protocol !== 'https:') {
        return NextResponse.json({ error: 'External download URL must use HTTPS' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid external download URL' }, { status: 400 });
    }
  }

  const payload: Record<string, unknown> = {
    title: body.title,
    slug: body.slug,
    summary: body.summary || null,
    article: body.article || null,
    category_id: body.category_id || null,
    tags: body.tags || [],
    cover_image: body.cover_image || null,
    file_type: body.file_type || null,
    file_name: body.file_name || null,
    file_size: body.file_size || null,
    google_drive_url: body.google_drive_url || null,
    storage_path: body.storage_path || null,
    external_download_url: body.external_download_url || null,
    seo_title: body.seo_title || null,
    meta_description: body.meta_description || null,
    og_image: body.og_image || null,
    featured: body.featured ?? false,
    ads_enabled: body.ads_enabled ?? true,
    status: body.status || 'draft',
    scheduled_at: body.scheduled_at || null,
    updated_at: new Date().toISOString(),
  };

  // Set published_at when publishing for the first time
  if (payload.status === 'published' && !body.published_at) {
    payload.published_at = new Date().toISOString();
  } else if (body.published_at) {
    payload.published_at = body.published_at;
  }

  if (id) {
    // Update
    const { data, error } = await admin
      .from('resources')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } else {
    // Insert
    const { data, error } = await admin
      .from('resources')
      .insert(payload)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  }
}

/** DELETE /api/admin/resources?id=<id> — Delete a resource */
export async function DELETE(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) return NextResponse.json(auth, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const admin = createServerAdminSupabase();
  const { error } = await admin.from('resources').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
