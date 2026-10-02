import { NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { deliverLeadNotification } from '@/lib/leads/notifications';
import { ipRateLimitKey, leadSubmissionKey, parseLeadInput, type LeadRow } from '@/lib/leads/schema';

export const dynamic = 'force-dynamic';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const localRateMap = new Map<string, { count: number; resetAt: number }>();

function localRateLimited(key: string) {
  const now = Date.now();
  const entry = localRateMap.get(key);
  if (!entry || entry.resetAt <= now) {
    localRateMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

function requestIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function allowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  if (origin === 'https://www.yaidigitals.co.in') return true;
  if (process.env.NODE_ENV !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });

  const declaredLength = Number(request.headers.get('content-length') || '0');
  if (declaredLength > 25_000) return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });

  // Dedicated values are preferred. A domain-separated key derived from the
  // existing server-only service role keeps lead intake safe during rollout.
  const baseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY || (process.env.NODE_ENV !== 'production' ? 'local-development-only' : '');
  const derive = (purpose: string) => baseSecret ? createHmac('sha256', baseSecret).update(`yaidigitals:${purpose}`).digest('hex') : '';
  const rateSecret = process.env.RATE_LIMIT_SECRET || derive('rate-limit');
  const dedupeSecret = process.env.LEAD_DEDUPE_SECRET || derive('lead-dedupe');
  if (!rateSecret || !dedupeSecret) {
    console.error('[api/leads] required security configuration is missing');
    return NextResponse.json({ error: 'Enquiries are temporarily unavailable. Please contact us on WhatsApp.' }, { status: 503 });
  }

  const ipKey = ipRateLimitKey(requestIp(request), rateSecret);
  if (localRateLimited(ipKey)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { input, errors, isSpam } = parseLeadInput(body);
  if (isSpam) return NextResponse.json({ ok: true }, { status: 202 });
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: 'Please review the highlighted fields.', fields: errors }, { status: 400 });
  }

  try {
    const supabase = createServerAdminSupabase();
    const { data: rateAllowed, error: rateError } = await supabase.rpc('check_lead_rate_limit', {
      p_key_hash: ipKey,
      p_limit: RATE_MAX,
      p_window_seconds: RATE_WINDOW_MS / 1000,
    });
    if (rateError) throw new Error('Persistent rate limit check failed.');
    if (!rateAllowed) return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });

    const submissionKey = leadSubmissionKey(input, dedupeSecret);
    const { website: _honeypot, consent: _consent, form_started_at: _formStartedAt, ...leadData } = input;
    void _honeypot;
    void _consent;
    void _formStartedAt;

    const { data, error: insertError } = await supabase
      .from('leads')
      .insert({
        ...leadData,
        email: leadData.email || null,
        phone: leadData.phone || null,
        company: leadData.company || null,
        project_type: leadData.project_type || null,
        budget_range: leadData.budget_range || null,
        existing_website: leadData.existing_website || null,
        referrer: leadData.referrer || null,
        utm_source: leadData.utm_source || null,
        utm_medium: leadData.utm_medium || null,
        utm_campaign: leadData.utm_campaign || null,
        utm_content: leadData.utm_content || null,
        utm_term: leadData.utm_term || null,
        consent_at: new Date().toISOString(),
        submission_key: submissionKey,
        notification_status: 'pending',
        notification_next_attempt_at: new Date().toISOString(),
      })
      .select('id, created_at, name, email, phone, company, project_type, budget_range, required_service, existing_website, project_description, preferred_contact_method, source_url, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, consent_at, notification_status, notification_attempts')
      .single();

    if (insertError?.code === '23505') {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    if (insertError || !data) throw new Error('Lead persistence failed.');

    const lead = data as unknown as LeadRow;
    await deliverLeadNotification(supabase, lead);
    return NextResponse.json({ ok: true, lead_id: lead.id }, { status: 201 });
  } catch (error) {
    console.error('[api/leads] request failed', { message: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json({ error: 'We could not save your enquiry. Please try again or contact us on WhatsApp.' }, { status: 500 });
  }
}
