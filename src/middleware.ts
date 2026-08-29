import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Edge middleware:
 *  1. Serves admin-managed redirects from the `redirects` table (cached in
 *     memory for 5 minutes) — used for ad-hoc 301s created in Admin → Redirects.
 *  2. Marks /admin and /api routes as noindex via X-Robots-Tag.
 */

interface RedirectRow {
  old_path: string;
  new_path: string;
  status: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache: { rows: RedirectRow[]; fetchedAt: number } = { rows: [], fetchedAt: 0 };

async function getRedirects(): Promise<RedirectRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  if (Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.rows;

  try {
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('redirects')
      .select('old_path, new_path, status')
      .eq('active', true);
    cache = { rows: (data ?? []) as RedirectRow[], fetchedAt: Date.now() };
  } catch {
    // On failure keep serving the previous cache (or nothing) — never block traffic
  }
  return cache.rows;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin-managed redirects (exact match)
  if (pathname !== '/' && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const redirects = await getRedirects();
    const match = redirects.find((r) => r.old_path === pathname);
    if (match) {
      return NextResponse.redirect(new URL(match.new_path, request.url), match.status || 301);
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
