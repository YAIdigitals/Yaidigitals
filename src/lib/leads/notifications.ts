import type { SupabaseClient } from '@supabase/supabase-js';
import { formatLeadNotification, nextRetryAt, type LeadRow } from './schema';
import { evolutionProviderFromEnv } from '@/lib/notifications/evolution';
import type { WhatsAppProvider } from '@/lib/notifications/contracts';
import { WhatsAppProviderError } from '@/lib/notifications/contracts';

export async function deliverLeadNotification(
  supabase: SupabaseClient,
  lead: LeadRow,
  provider: WhatsAppProvider | null = evolutionProviderFromEnv()
) {
  if (!provider) return { status: 'pending' as const, reason: 'provider_not_configured' };

  const { data: claimed, error: claimError } = await supabase.rpc('claim_lead_notification', { p_lead_id: lead.id });
  if (claimError) throw new Error('Unable to claim notification job.');
  if (!claimed) return { status: 'skipped' as const, reason: 'already_claimed_or_sent' };

  const attempt = (lead.notification_attempts ?? 0) + 1;
  let receipt: Awaited<ReturnType<WhatsAppProvider['sendText']>>;
  try {
    receipt = await provider.sendText({
      to: process.env.YAIDIGITALS_NOTIFICATION_WHATSAPP || '916006107923',
      text: formatLeadNotification(lead),
      idempotencyKey: `yaidigitals-lead-${lead.id}`,
    });
  } catch (error) {
    const permanent = error instanceof WhatsAppProviderError && !error.retryable;
    const retryAt = permanent ? null : nextRetryAt(attempt);
    const safeError = error instanceof Error ? error.message.slice(0, 240) : 'Unknown provider error';
    await supabase.from('leads').update({
      notification_status: permanent ? 'permanently_failed' : 'failed',
      notification_provider: provider.name,
      notification_last_error: safeError,
      notification_next_attempt_at: retryAt,
      notification_locked_at: null,
      updated_at: new Date().toISOString(),
    }).eq('id', lead.id);
    console.error('[lead-notification] delivery failed', { leadId: lead.id, attempt });
    return { status: permanent ? 'permanently_failed' as const : 'failed' as const, retryAt };
  }

  const { error: receiptError } = await supabase.from('leads').update({
    notification_status: 'sent',
    notification_provider: receipt.provider,
    notification_provider_message_id: receipt.messageId || null,
    notification_sent_at: new Date().toISOString(),
    notification_last_error: null,
    notification_next_attempt_at: null,
    notification_locked_at: null,
    updated_at: new Date().toISOString(),
  }).eq('id', lead.id);
  if (receiptError) {
    // Deliberately leave the durable job in `processing`. Retrying a provider
    // success with no stored receipt could send a duplicate message.
    console.error('[lead-notification] receipt persistence failed', { leadId: lead.id, attempt });
    return { status: 'processing' as const, reason: 'receipt_persistence_failed' };
  }
  return { status: 'sent' as const, messageId: receipt.messageId };
}
