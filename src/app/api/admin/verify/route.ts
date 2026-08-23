import { NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/** Checks whether a Supabase access token belongs to an approved admin. */
export async function POST(request: Request) {
  let body: { access_token?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'invalid_token' }, { status: 400 });
  }

  const token = typeof body.access_token === 'string' ? body.access_token : '';
  if (!token) {
    return NextResponse.json({ ok: false, reason: 'invalid_token' }, { status: 400 });
  }

  const result = await verifyAdminAccess(token);
  return NextResponse.json(result, { status: result.ok ? 200 : 403 });
}
