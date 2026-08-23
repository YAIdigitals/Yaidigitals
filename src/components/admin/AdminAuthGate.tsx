'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabase } from '@/lib/supabase/client';

type GateState = 'checking' | 'ok' | 'pending';

/**
 * Client-side access gate for every protected admin route.
 * A valid Supabase session is NOT enough — the session's token is verified
 * server-side against the approvals table. Unapproved admins are signed out
 * immediately.
 */
export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GateState>('checking');

  useEffect(() => {
    let cancelled = false;
    const supabase = createClientSupabase();

    async function check() {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        router.replace('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        });
        const result = await res.json();

        if (cancelled) return;

        if (result.ok) {
          setState('ok');
          return;
        }

        // Not an approved admin — kill the session
        await supabase.auth.signOut();
        const reason = result.reason === 'pending' ? 'pending' : 'denied';
        router.replace(`/admin/login?status=${reason}`);
      } catch {
        if (!cancelled) {
          await supabase.auth.signOut();
          router.replace('/admin/login?status=error');
        }
      }
    }

    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/admin/login');
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (state !== 'ok') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-6">
        <div className="flex items-center gap-3 text-textMuted" role="status" aria-live="polite">
          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent motion-reduce:animate-none" />
          Verifying access…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
