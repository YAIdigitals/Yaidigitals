'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, ShieldX, Trash2, UserRoundCheck } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase/client';

interface AdminUserRow {
  id: string;
  email: string;
  role: string | null;
  created_at: string;
  approved: boolean;
  requested_at: string | null;
}

const MIGRATION_NOTICE =
  'Approval enforcement is inactive: the database migration has not been applied yet. Run supabase/migrations/202608240001_admin_approval_gate.sql in the Supabase SQL editor to activate it.';

/**
 * Super-admin controls: approve or revoke panel access for admin accounts.
 * All actions go through /api/admin/users which re-verifies the caller
 * server-side and blocks self-revoke/self-delete.
 */
export default function AdminUsers() {
  const supabase = createClientSupabase();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [migrationPending, setMigrationPending] = useState(false);

  const authedFetch = useCallback(
    async (init?: RequestInit) => {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) throw new Error('Not signed in.');
      return fetch('/api/admin/users', {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(init?.headers ?? {}),
        },
      });
    },
    [supabase]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authedFetch();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load accounts.');
      setUsers((data.users ?? []) as AdminUserRow[]);
      setMigrationPending(!!data.migrationPending);

      const { data: sessionData } = await supabase.auth.getSession();
      setCurrentUserId(sessionData?.session?.user.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts.');
    } finally {
      setLoading(false);
    }
  }, [authedFetch, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(action: 'approve' | 'revoke' | 'delete', userId: string) {
    if (action === 'delete' && !window.confirm('Delete this account permanently?')) return;

    setBusyId(userId);
    setError('');
    try {
      const res = await authedFetch({
        method: 'POST',
        body: JSON.stringify({ action, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Action failed.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  }

  const pending = users.filter((u) => !u.approved && u.id !== currentUserId);
  const approved = users.filter((u) => u.approved);
  const self = users.find((u) => u.id === currentUserId);

  return (
    <div className="space-y-6">
      {migrationPending && (
        <div role="status" className="flex items-start gap-2.5 rounded-lg border border-accentYellow/40 bg-accentYellow/10 p-3.5 text-sm text-textMuted">
          <AlertCircle size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-accentYellow" />
          {MIGRATION_NOTICE}
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-textMuted">
          <AlertCircle size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-red-400" />
          {error}
        </div>
      )}

      {/* Pending requests */}
      <section aria-labelledby="pending-admins">
        <h2 id="pending-admins" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-textMuted">
          <ShieldX size={15} strokeWidth={2} aria-hidden="true" className="text-primary" />
          Awaiting approval {pending.length > 0 && `(${pending.length})`}
        </h2>
        <div className="mt-3 space-y-2.5">
          {loading ? (
            <p className="flex items-center gap-2 py-4 text-sm text-textMuted">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Loading…
            </p>
          ) : pending.length === 0 ? (
            <p className="rounded-xl border border-border bg-bgCard p-4 text-sm text-textMuted">
              No pending requests.
            </p>
          ) : (
            pending.map((u) => (
              <UserRow key={u.id} user={u}>
                <ActionButton label={`Approve ${u.email}`} onClick={() => act('approve', u.id)} busy={busyId === u.id} primary icon={<UserRoundCheck size={14} strokeWidth={2} />}>
                  Approve
                </ActionButton>
                <ActionButton label={`Delete request from ${u.email}`} onClick={() => act('delete', u.id)} busy={busyId === u.id} danger icon={<Trash2 size={14} strokeWidth={2} />}>
                  Delete
                </ActionButton>
              </UserRow>
            ))
          )}
        </div>
      </section>

      {/* Approved admins */}
      <section aria-labelledby="approved-admins">
        <h2 id="approved-admins" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-textMuted">
          <ShieldCheck size={15} strokeWidth={2} aria-hidden="true" className="text-primary" />
          Approved admins
        </h2>
        <div className="mt-3 space-y-2.5">
          {!loading && approved.length === 0 && (
            <p className="rounded-xl border border-border bg-bgCard p-4 text-sm text-textMuted">None.</p>
          )}
          {approved.map((u) => (
            <UserRow key={u.id} user={u} isSelf={u.id === currentUserId}>
              {u.id !== currentUserId && (
                <ActionButton label={`Revoke access for ${u.email}`} onClick={() => act('revoke', u.id)} busy={busyId === u.id} danger icon={<ShieldX size={14} strokeWidth={2} />}>
                  Revoke
                </ActionButton>
              )}
            </UserRow>
          ))}
        </div>
      </section>

      {self && (
        <p className="flex items-start gap-2 rounded-lg border border-border bg-bgCard p-3.5 text-xs leading-relaxed text-textMuted">
          <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
          You are signed in as {self.email}. Your own account cannot be revoked or deleted from here — this prevents locking everyone out of the panel.
        </p>
      )}
    </div>
  );
}

function UserRow({
  user,
  isSelf = false,
  children,
}: {
  user: AdminUserRow;
  isSelf?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-bgCard p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-medium text-textMain">
          {user.email}
          {isSelf && <span className="ml-2 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">you</span>}
        </p>
        <p className="mt-0.5 text-xs text-textMuted">
          Requested {formatDate(user.requested_at ?? user.created_at)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  busy,
  primary,
  danger,
  icon,
  children,
}: {
  label: string;
  onClick: () => void;
  busy: boolean;
  primary?: boolean;
  danger?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={busy}
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50',
        primary
          ? 'bg-primary text-textMain hover:bg-primaryDark'
          : danger
            ? 'border border-red-500/40 text-red-400 hover:bg-red-500/10'
            : 'border border-border text-textMuted hover:text-textMain',
      ].join(' ')}
    >
      {busy ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}
