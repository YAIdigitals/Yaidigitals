import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatLeadNotification,
  leadSubmissionKey,
  nextRetryAt,
  normaliseWhatsAppNumber,
  parseLeadInput,
  type LeadRow,
} from '../src/lib/leads/schema';

const now = Date.parse('2026-10-02T10:00:00.000Z');

function validBody() {
  return {
    name: 'Aarav Sharma', email: 'aarav@example.com', phone: '', required_service: 'website-development',
    project_description: 'We need a faster website with qualified lead capture.', preferred_contact_method: 'email',
    consent: true, form_started_at: now - 5_000, source_url: 'https://www.yaidigitals.co.in/contact',
  };
}

test('validates and sanitises a genuine lead', () => {
  const result = parseLeadInput(validBody(), now);
  assert.deepEqual(result.errors, {});
  assert.equal(result.isSpam, false);
  assert.equal(result.input.email, 'aarav@example.com');
});

test('requires one contact channel, service, description and consent', () => {
  const result = parseLeadInput({ ...validBody(), email: '', phone: '', required_service: '', project_description: 'short', consent: false }, now);
  assert.ok(result.errors.email);
  assert.ok(result.errors.required_service);
  assert.ok(result.errors.project_description);
  assert.ok(result.errors.consent);
});

test('rejects honeypots and unrealistically fast submissions as spam', () => {
  assert.equal(parseLeadInput({ ...validBody(), website: 'spam.example' }, now).isSpam, true);
  assert.equal(parseLeadInput({ ...validBody(), form_started_at: now - 500 }, now).isSpam, true);
});

test('daily submission key is stable and changes with lead content', () => {
  const input = parseLeadInput(validBody(), now).input;
  const first = leadSubmissionKey(input, 'test-secret', new Date(now));
  const duplicate = leadSubmissionKey(input, 'test-secret', new Date(now));
  const changed = leadSubmissionKey({ ...input, project_description: 'A different project description.' }, 'test-secret', new Date(now));
  assert.equal(first, duplicate);
  assert.notEqual(first, changed);
});

test('normalises Indian phone numbers and rejects invalid destinations', () => {
  assert.equal(normaliseWhatsAppNumber('+91 60061 07923'), '916006107923');
  assert.equal(normaliseWhatsAppNumber('9876543210'), '919876543210');
  assert.equal(normaliseWhatsAppNumber('123'), '');
});

test('formats optional fields safely, caps descriptions and uses Asia/Kolkata time', () => {
  const lead: LeadRow = {
    ...parseLeadInput(validBody(), now).input,
    id: 42,
    created_at: '2026-10-02T10:00:00.000Z',
    consent_at: '2026-10-02T10:00:00.000Z',
    notification_status: 'pending',
    notification_attempts: 0,
    project_description: `*unsafe* ${'x'.repeat(2_000)}`,
  };
  const message = formatLeadNotification(lead);
  assert.match(message, /\*Lead ID:\* 42/);
  assert.match(message, /3:30 pm IST/i);
  assert.doesNotMatch(message, /Company:/);
  assert.doesNotMatch(message, /undefined|null/);
  assert.ok(message.length < 2_500);
  assert.match(message, /\\\*unsafe\\\*/);
});

test('uses controlled retry backoff and stops after the final attempt', () => {
  assert.equal(nextRetryAt(1, now), '2026-10-02T10:05:00.000Z');
  assert.equal(nextRetryAt(2, now), '2026-10-02T10:30:00.000Z');
  assert.equal(nextRetryAt(3, now), '2026-10-02T12:00:00.000Z');
  assert.equal(nextRetryAt(4, now), null);
});
