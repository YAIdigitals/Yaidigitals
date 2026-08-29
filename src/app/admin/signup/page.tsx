'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createClientSupabase } from '@/lib/supabase/client';

export default function Signup() {
  const supabase = createClientSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // role:'admin' marks the account for the approval queue — it does NOT
      // grant access. A super admin must approve it in the Access tab.
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'admin' } },
      });
      if (signUpError) throw signUpError;
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-bold text-textMain">Request admin access</h1>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 p-4"
        >
          <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-textMain">Request submitted</p>
            <p className="mt-1 text-sm leading-relaxed text-textMuted">
              Your account is awaiting super-admin approval. Once approved, you can sign in at{' '}
              <Link href="/admin/login" className="text-primary underline-offset-4 hover:underline">
                the login page
              </Link>
              .
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-textMuted">
            New accounts are created without access — a super admin must approve you before you can
            sign in to the panel.
          </p>

          {error && (
            <div role="alert" className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle size={18} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm leading-relaxed text-textMuted">{error}</p>
            </div>
          )}

          <form onSubmit={signup} className="mt-6 space-y-3">
            <label htmlFor="signup-email" className="sr-only">Email</label>
            <input
              id="signup-email"
              className="w-full rounded-lg border border-border bg-bgCard px-3.5 py-2.5 text-sm text-textMain transition-colors placeholder:text-textMuted/50 hover:border-white/15 focus:border-primary focus:outline-none"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="signup-password" className="sr-only">Password</label>
            <input
              id="signup-password"
              className="w-full rounded-lg border border-border bg-bgCard px-3.5 py-2.5 text-sm text-textMain transition-colors placeholder:text-textMuted/50 hover:border-white/15 focus:border-primary focus:outline-none"
              type="password"
              autoComplete="new-password"
              minLength={8}
              placeholder="Password (min 8 characters)"
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
              {submitting ? 'Submitting…' : 'Request access'}
            </button>
          </form>
          <p className="mt-4 text-sm text-textMuted">
            Already approved?{' '}
            <Link href="/admin/login" className="text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
