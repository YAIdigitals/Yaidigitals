'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabase } from '@/lib/supabase/client';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClientSupabase();
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) {
        setAuthed(true);
      } else {
        router.replace('/admin/login');
      }
      setChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/admin/login');
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (!checked || !authed) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-textMuted">Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
