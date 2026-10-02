import { NextResponse } from 'next/server';
import { authorisedInternalRequest } from '@/lib/internal-auth';
import { createServerAdminSupabase } from '@/lib/supabase/server';
import { deliverLeadNotification } from '@/lib/leads/notifications';
import type { LeadRow } from '@/lib/leads/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!authorisedInternalRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerAdminSupabase();
  const { data, error } = await supabase
    .from('leads')
    .select('id, created_at, name, email, phone, company, project_type, budget_range, required_service, existing_website, project_description, preferred_contact_method, source_url, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, consent_at, notification_status, notification_attempts')
    .in('notification_status', ['pending', 'failed'])
    .lt('notification_attempts', 4)
    .not('notification_next_attempt_at', 'is', null)
    .lte('notification_next_attempt_at', new Date().toISOString())
    .order('notification_next_attempt_at', { ascending: true })
    .limit(10);

  if (error) return NextResponse.json({ error: 'Unable to load notification jobs.' }, { status: 500 });
  const results = await Promise.all((data ?? []).map((lead) => deliverLeadNotification(supabase, lead as unknown as LeadRow)));
  return NextResponse.json({ processed: results.length, sent: results.filter((r) => r.status === 'sent').length, failed: results.filter((r) => r.status === 'failed' || r.status === 'permanently_failed').length });
}

export const POST = GET;
