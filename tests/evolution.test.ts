import test from 'node:test';
import assert from 'node:assert/strict';
import { EvolutionWhatsAppProvider } from '../src/lib/notifications/evolution';
import { WhatsAppProviderError } from '../src/lib/notifications/contracts';

const config = { baseUrl: 'https://evolution.example.com/', apiKey: 'server-secret', instance: 'yaidigitals' };

test('sends the exact v2.3.7 text payload with API-key authentication', async () => {
  let request: { url?: string; init?: RequestInit } = {};
  const fakeFetch = (async (url: string | URL | Request, init?: RequestInit) => {
    request = { url: String(url), init };
    return new Response(JSON.stringify({ key: { id: 'message-123' } }), { status: 201 });
  }) as typeof fetch;
  const provider = new EvolutionWhatsAppProvider(config, fakeFetch);
  const receipt = await provider.sendText({ to: '+91 60061 07923', text: 'Test', idempotencyKey: 'lead-1' });
  assert.equal(request.url, 'https://evolution.example.com/message/sendText/yaidigitals');
  assert.equal(new Headers(request.init?.headers).get('apikey'), 'server-secret');
  assert.deepEqual(JSON.parse(String(request.init?.body)), { number: '916006107923', text: 'Test', linkPreview: false });
  assert.equal(receipt.messageId, 'message-123');
});

test('marks authentication failures as permanent', async () => {
  const provider = new EvolutionWhatsAppProvider(config, (async () => new Response('{}', { status: 401 })) as typeof fetch);
  await assert.rejects(
    provider.sendText({ to: '916006107923', text: 'Test', idempotencyKey: 'lead-2' }),
    (error: unknown) => error instanceof WhatsAppProviderError && error.status === 401 && !error.retryable
  );
});

test('normalises timeouts as retryable provider failures', async () => {
  const timeoutFetch = (async () => {
    const error = new Error('aborted');
    error.name = 'AbortError';
    throw error;
  }) as typeof fetch;
  const provider = new EvolutionWhatsAppProvider(config, timeoutFetch);
  await assert.rejects(
    provider.sendText({ to: '916006107923', text: 'Test', idempotencyKey: 'lead-3' }),
    (error: unknown) => error instanceof WhatsAppProviderError && error.retryable && error.status === 408
  );
});

test('reports a disconnected instance without leaking configuration', async () => {
  const provider = new EvolutionWhatsAppProvider(config, (async () => new Response(JSON.stringify({ instance: { state: 'close' } }), { status: 200 })) as typeof fetch);
  const health = await provider.checkConnection();
  assert.deepEqual(health, { reachable: true, instanceExists: true, connected: false, state: 'close', status: 200 });
  assert.equal(JSON.stringify(health).includes('server-secret'), false);
});

test('rejects an invalid destination before calling the provider', async () => {
  let called = false;
  const provider = new EvolutionWhatsAppProvider(config, (async () => { called = true; return new Response('{}'); }) as typeof fetch);
  await assert.rejects(provider.sendText({ to: '123', text: 'Test', idempotencyKey: 'lead-4' }), WhatsAppProviderError);
  assert.equal(called, false);
});
