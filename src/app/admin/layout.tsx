import { createServerSupabase } from '@/lib/supabase/server';
import AdminAuthGate from '@/components/admin/AdminAuthGate';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // Fail fast if Supabase is misconfigured, but do real auth gating on the
  // client where the session actually lives (vanilla supabase-js in localStorage).
  try {
    createServerSupabase();
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-textMuted">
        Server configuration error: missing Supabase environment variables.
      </div>
    );
  }
  return <AdminAuthGate>{children}</AdminAuthGate>;
}
