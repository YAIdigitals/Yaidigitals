import { WhatsAppProviderError, type WhatsAppProvider } from './contracts';
import { normaliseWhatsAppNumber } from '@/lib/leads/schema';

type FetchLike = typeof fetch;

export class EvolutionWhatsAppProvider implements WhatsAppProvider {
  readonly name = 'evolution-api';

  constructor(
    private readonly config: { baseUrl: string; apiKey: string; instance: string },
    private readonly fetcher: FetchLike = fetch
  ) {}

  async sendText({ to, text, idempotencyKey }: { to: string; text: string; idempotencyKey: string }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    try {
      const normalisedTo = normaliseWhatsAppNumber(to);
      if (!normalisedTo) throw new WhatsAppProviderError('Invalid configured WhatsApp recipient.', false, 400);
      const response = await this.fetcher(
        `${this.config.baseUrl.replace(/\/$/, '')}/message/sendText/${encodeURIComponent(this.config.instance)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: this.config.apiKey,
            'Idempotency-Key': idempotencyKey,
          },
          body: JSON.stringify({ number: normalisedTo, text, linkPreview: false }),
          signal: controller.signal,
        }
      );
      const result = (await response.json().catch(() => ({}))) as { key?: { id?: string }; message?: string };
      if (!response.ok) {
        const retryable = response.status === 408 || response.status === 409 || response.status === 425 || response.status === 429 || response.status >= 500;
        throw new WhatsAppProviderError(`Evolution API returned HTTP ${response.status}`, retryable, response.status);
      }
      return { provider: this.name, messageId: result.key?.id };
    } catch (error) {
      if (error instanceof WhatsAppProviderError) throw error;
      if (error instanceof Error && error.name === 'AbortError') {
        throw new WhatsAppProviderError('Evolution API request timed out.', true, 408);
      }
      throw new WhatsAppProviderError('Evolution API network request failed.', true);
    } finally {
      clearTimeout(timeout);
    }
  }

  async checkConnection() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const response = await this.fetcher(
        `${this.config.baseUrl.replace(/\/$/, '')}/instance/connectionState/${encodeURIComponent(this.config.instance)}`,
        { headers: { apikey: this.config.apiKey }, signal: controller.signal }
      );
      if (!response.ok) return { reachable: true, instanceExists: response.status !== 404, connected: false, status: response.status };
      const result = (await response.json().catch(() => ({}))) as { instance?: { state?: string } };
      const state = result.instance?.state || 'unknown';
      return { reachable: true, instanceExists: true, connected: state === 'open' || state === 'connected', state, status: response.status };
    } catch {
      return { reachable: false, instanceExists: false, connected: false };
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function evolutionProviderFromEnv(): EvolutionWhatsAppProvider | null {
  const baseUrl = process.env.EVOLUTION_API_URL?.trim();
  const apiKey = process.env.EVOLUTION_API_KEY?.trim();
  const instance = process.env.EVOLUTION_INSTANCE_NAME?.trim();
  if (!baseUrl || !apiKey || !instance) return null;
  return new EvolutionWhatsAppProvider({ baseUrl, apiKey, instance });
}

export async function checkEvolutionConnection() {
  const provider = evolutionProviderFromEnv();
  if (!provider) return { configured: false, reachable: false, instanceExists: false, connected: false };
  return { configured: true, ...(await provider.checkConnection()) };
}
