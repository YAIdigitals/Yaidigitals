'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase/client';

const NOTICES: Record<string, { title: string; body: string }> = {
  pending: {
    title: 'Awaiting approval',
    body: 'Your account has been created, but a super admin has not approved it yet. You will be able to sign in once access is granted.',
  },
  denied: {
    title: 'Access denied',
    body: 'This account does not have admin access.',
  },
  error: {
    title: 'Verification failed',
    body: 'We could not verify your access. Please try signing in again.',
  },
};

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClientSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [noticeKey, setNoticeKey] = useState('');

  // Read redirect reason (set by the auth gate) without useSearchParams
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('status');
    if (status && NOTICES[status]) setNoticeKey(status);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNoticeKey('');
    setSubmitting(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error(signInError.message);

      // Server-side approval check before entering the panel
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: data.session?.access_token }),
      });
      const result = await res.json();

      if (!result.ok) {
        await supabase.auth.signOut();
        if (result.reason === 'pending') {
          setNoticeKey('pending');
        } else if (result.reason === 'not_admin') {
          setError('This account does not have admin access.');
        } else {
          setError('Could not verify your account. Please try again.');
        }
        return;
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const notice = noticeKey ? NOTICES[noticeKey] : null;

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-bold text-textMain">
        <span className="text-primary">YAI</span>digitals admin
      </h1>

      {notice && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 p-4">
          <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-textMain">{notice.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-textMuted">{notice.body}</p>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-red-400" />
          <p className="text-sm leading-relaxed text-textMuted">{error}</p>
        </div>
      )}

      <form onSubmit={login} className="mt-6 space-y-3">
        <label htmlFor="admin-email" className="sr-only">Email</label>
        <input
          id="admin-email"
          className="w-full rounded-lg border border-border bg-bgCard px-3.5 py-2.5 text-sm text-textMain transition-colors placeholder:text-textMuted/50 hover:border-white/15 focus:border-primary focus:outline-none"
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="admin-password" className="sr-only">Password</label>
        <input
          id="admin-password"
          className="w-full rounded-lg border border-border bg-bgCard px-3.5 py-2.5 text-sm text-textMain transition-colors placeholder:text-textMuted/50 hover:border-white/15 focus:border-primary focus:outline-none"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-textMain transition-colors hover:bg-primaryDark disabled:pointer-events-none disabled:opacity-55"
        >
          {submitting && <Loader2 size={15} strokeWidth={2.5} aria-hidden="true" className="animate-spin" />}
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-textMuted">
        Need an account?{' '}
        <Link href="/admin/signup" className="text-primary underline-offset-4 hover:underline">
          Request access
        </Link>
      </p>
    </div>
  );
}
