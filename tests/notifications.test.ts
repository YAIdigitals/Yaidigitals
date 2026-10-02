import test from 'node:test';
import assert from 'node:assert/strict';
import type { SupabaseClient } from '@supabase/supabase-js';
import { deliverLeadNotification } from '../src/lib/leads/notifications';
import type { LeadRow } from '../src/lib/leads/schema';
import type { WhatsAppProvider } from '../src/lib/notifications/contracts';
import { WhatsAppProviderError } from '../src/lib/notifications/contracts';

const lead: LeadRow = {
  id: 7, created_at: '2026-10-02T10:00:00.000Z', name: 'Test Lead', email: 'test@example.com', phone: '',
  company: '', project_type: '', budget_range: '', required_service: 'website-development', existing_website: '',
  project_description: 'A genuine test project description.', preferred_contact_method: 'email', source_url: 'https://www.yaidigitals.co.in/contact',
  referrer: '', utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '',
  consent_at: '2026-10-02T10:00:00.000Z', notification_status: 'pending', notification_attempts: 0,
};

function database(claimed: boolean) {
  const updates: Record<string, unknown>[] = [];
  const supabase = {
    rpc: async () => ({ data: claimed, error: null }),
    from: () => ({ update: (value: Record<string, unknown>) => { updates.push(value); return { eq: async () => ({ error: null }) }; } }),
  } as unknown as SupabaseClient;
  return { supabase, updates };
}

test('does not call Evolution when the durable job was already claimed or sent', async () => {
  const db = database(false);
  let sends = 0;
  const provider: WhatsAppProvider = { name: 'mock', sendText: async () => { sends += 1; return { provider: 'mock' }; } };
  const result = await deliverLeadNotification(db.supabase, lead, provider);
  assert.equal(result.status, 'skipped');
  assert.equal(sends, 0);
});

test('persists the provider message ID after one successful claimed delivery', async () => {
  const db = database(true);
  const provider: WhatsAppProvider = { name: 'mock', sendText: async ({ to }) => {
    assert.equal(to, '916006107923');
    return { provider: 'mock', messageId: 'provider-1' };
  } };
  const result = await deliverLeadNotification(db.supabase, lead, provider);
  assert.equal(result.status, 'sent');
  assert.equal(db.updates[0].notification_provider_message_id, 'provider-1');
  assert.equal(db.updates[0].notification_status, 'sent');
});

test('lead remains pending when Evolution is not configured', async () => {
  const db = database(true);
  const result = await deliverLeadNotification(db.supabase, lead, null);
  assert.equal(result.status, 'pending');
  assert.equal(db.updates.length, 0);
});

test('provider failure is persisted without losing the lead', async () => {
  const db = database(true);
  const provider: WhatsAppProvider = { name: 'mock', sendText: async () => { throw new Error('temporary outage'); } };
  const result = await deliverLeadNotification(db.supabase, lead, provider);
  assert.equal(result.status, 'failed');
  assert.equal(db.updates[0].notification_status, 'failed');
  assert.equal(db.updates[0].notification_last_error, 'temporary outage');
  assert.ok(db.updates[0].notification_next_attempt_at);
});

test('permanent provider failures are not scheduled for retry', async () => {
  const db = database(true);
  const provider: WhatsAppProvider = { name: 'mock', sendText: async () => { throw new WhatsAppProviderError('authentication failed', false, 401); } };
  const result = await deliverLeadNotification(db.supabase, lead, provider);
  assert.equal(result.status, 'permanently_failed');
  assert.equal(db.updates[0].notification_status, 'permanently_failed');
  assert.equal(db.updates[0].notification_next_attempt_at, null);
});

test('a sent message is not retried when receipt persistence fails', async () => {
  let sends = 0;
  const supabase = {
    rpc: async () => ({ data: true, error: null }),
    from: () => ({ update: () => ({ eq: async () => ({ error: { message: 'database unavailable' } }) }) }),
  } as unknown as SupabaseClient;
  const provider: WhatsAppProvider = { name: 'mock', sendText: async () => { sends += 1; return { provider: 'mock', messageId: 'accepted-1' }; } };
  const result = await deliverLeadNotification(supabase, lead, provider);
  assert.equal(result.status, 'processing');
  assert.equal(sends, 1);
});
