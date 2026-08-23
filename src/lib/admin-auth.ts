import { createServerAdminSupabase } from '@/lib/supabase/server';

export type AdminVerification = {
  ok: boolean;
  reason?: 'invalid_token' | 'not_admin' | 'pending';
  userId?: string;
  email?: string;
  bootstrapped?: boolean;
  /** True when the admin_approvals table is missing (migration not applied yet). */
  migrationPending?: boolean;
};

/**
 * Validates that a JWT belongs to a user whose metadata role is 'admin'
 * AND who has been approved in admin_approvals.
 *
 * Bootstrap rule: if NO approved admin exists yet, the first role='admin'
 * account to sign in is auto-approved — this is the super admin the owner
 * creates directly in Supabase Auth. After that, every new admin must be
 * approved by them through the Access tab.
 */
export async function verifyAdminAccess(accessToken: string): Promise<AdminVerification> {
  let admin;
  try {
    admin = createServerAdminSupabase();
  } catch {
    return { ok: false, reason: 'invalid_token' };
  }

  const { data: userData, error } = await admin.auth.getUser(accessToken);
  if (error || !userData?.user) return { ok: false, reason: 'invalid_token' };

  const user = userData.user;
  if (user.user_metadata?.role !== 'admin') {
    return { ok: false, reason: 'not_admin', userId: user.id, email: user.email ?? undefined };
  }

  // Make sure a pending row exists for this admin
  const { error: upsertError } = await admin
    .from('admin_approvals')
    .upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });

  if (upsertError && upsertError.code === '42P01') {
    // admin_approvals table does not exist yet — migration not applied.
    // Degrade to legacy behavior (metadata-only) instead of locking everyone
    // out, and surface the state so the UI can prompt for the migration.
    console.warn('[admin-auth] admin_approvals table missing — run supabase/migrations/202608240001_admin_approval_gate.sql');
    return { ok: true, userId: user.id, email: user.email ?? undefined, migrationPending: true };
  }

  const { data: row } = await admin
    .from('admin_approvals')
    .select('approved')
    .eq('user_id', user.id)
    .maybeSingle();

  if (row?.approved) {
    return { ok: true, userId: user.id, email: user.email ?? undefined };
  }

  // Bootstrap: no approved admin exists yet → first login claims super admin
  const { count, error: countError } = await admin
    .from('admin_approvals')
    .select('user_id', { count: 'exact', head: true })
    .eq('approved', true);

  if (countError && countError.code === '42P01') {
    console.warn('[admin-auth] admin_approvals table missing — run supabase/migrations/202608240001_admin_approval_gate.sql');
    return { ok: true, userId: user.id, email: user.email ?? undefined, migrationPending: true };
  }

  if ((count ?? 0) === 0) {
    await admin
      .from('admin_approvals')
      .update({ approved: true, decided_at: new Date().toISOString() })
      .eq('user_id', user.id);
    return { ok: true, userId: user.id, email: user.email ?? undefined, bootstrapped: true };
  }

  return { ok: false, reason: 'pending', userId: user.id, email: user.email ?? undefined };
}

/** Extracts and verifies the caller of a management API request. */
export async function requireApprovedAdmin(request: Request): Promise<AdminVerification> {
  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return { ok: false, reason: 'invalid_token' };
  return verifyAdminAccess(token);
}
