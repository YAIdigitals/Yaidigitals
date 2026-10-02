import { NextResponse } from 'next/server';
import { authorisedInternalRequest } from '@/lib/internal-auth';
import { checkEvolutionConnection } from '@/lib/notifications/evolution';
import { createServerAdminSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!authorisedInternalRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const [connection, lastDelivery] = await Promise.all([
    checkEvolutionConnection(),
    createServerAdminSupabase()
      .from('leads')
      .select('notification_sent_at')
      .eq('notification_status', 'sent')
      .order('notification_sent_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    provider: 'evolution-api',
    instance: process.env.EVOLUTION_INSTANCE_NAME || 'yaidigitals',
    ...connection,
    lastSuccessfulNotificationAt: lastDelivery.data?.notification_sent_at || null,
  });
}
