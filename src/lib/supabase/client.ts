import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client — module-level singleton.
 *
 * Components call this during render; returning the same instance keeps
 * useCallback/useEffect dependency arrays stable (a fresh client per render
 * caused admin data-load effects to re-fire on every render — the
 * "data flashes then Loading…" loop).
 */
let browserClient: SupabaseClient | null = null;

export const createClientSupabase = (): SupabaseClient => {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  browserClient = createClient(url, key);
  return browserClient;
};
