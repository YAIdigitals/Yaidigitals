import { NextResponse } from 'next/server';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { requireApprovedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

interface AdminUserRow {
  id: string;
  email: string;
  role: string | null;
  created_at: string;
  approved: boolean;
  requested_at: string | null;
}

/** GET: list all accounts with the 'admin' role and their approval status. */
export async function GET(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: auth.reason === 'pending' ? 403 : 401 });
  }

  try {
    const admin = createServerAdminSupabase();
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw error;

    const { data: approvals, error: approvalsError } = await admin
      .from('admin_approvals')
      .select('user_id, approved, requested_at');

    // Table missing → migration not applied yet; report it instead of failing
    const migrationPending = approvalsError?.code === '42P01';
    const approvalMap = new Map((approvals ?? []).map((a) => [a.user_id, a]));

    const users: AdminUserRow[] = (data.users ?? [])
      .filter((u) => u.user_metadata?.role === 'admin')
      .map((u) => ({
        id: u.id,
        email: u.email ?? '(no email)',
        role: u.user_metadata?.role ?? null,
        created_at: u.created_at,
        approved: approvalMap.get(u.id)?.approved ?? false,
        requested_at: approvalMap.get(u.id)?.requested_at ?? u.created_at,
      }))
      .sort((a, b) => Number(a.approved) - Number(b.approved)); // pending first

    return NextResponse.json({ users, migrationPending });
  } catch (err) {
    console.error('[api/admin/users] list failed:', err);
    return NextResponse.json({ error: 'Failed to load admin accounts.' }, { status: 500 });
  }
}

/**
 * POST: manage an admin account.
 * Body: { action: 'approve' | 'revoke' | 'delete', userId }
 * Self-revoke/self-delete is blocked to prevent lockout.
 */
export async function POST(request: Request) {
  const auth = await requireApprovedAdmin(request);
  if (!auth.ok || !auth.userId) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: auth.reason === 'pending' ? 403 : 401 });
  }

  let body: { action?: unknown; userId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : '';
  const userId = typeof body.userId === 'string' ? body.userId : '';

  if (!['approve', 'revoke', 'delete'].includes(action)) {
    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
  }
  if (action !== 'approve' && userId === auth.userId) {
    return NextResponse.json(
      { error: 'You cannot revoke or delete your own account.' },
      { status: 400 }
    );
  }

  try {
    const admin = createServerAdminSupabase();

    if (action === 'approve') {
      // Ensure a row exists, then approve it
      await admin
        .from('admin_approvals')
        .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true });
      const { error } = await admin
        .from('admin_approvals')
        .update({ approved: true, decided_at: new Date().toISOString(), decided_by: auth.userId })
        .eq('user_id', userId);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (action === 'revoke') {
      const { error } = await admin
        .from('admin_approvals')
        .update({ approved: false, decided_at: new Date().toISOString(), decided_by: auth.userId })
        .eq('user_id', userId);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    // delete — cascades to admin_approvals via FK on delete cascade
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/admin/users] action failed:', err);
    return NextResponse.json({ error: 'Action failed. Please try again.' }, { status: 500 });
  }
}
