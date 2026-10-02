export type DeliveryReceipt = { provider: string; messageId?: string };

export class WhatsAppProviderError extends Error {
  constructor(message: string, public readonly retryable: boolean, public readonly status?: number) {
    super(message);
    this.name = 'WhatsAppProviderError';
  }
}

export interface WhatsAppProvider {
  readonly name: string;
  sendText(input: { to: string; text: string; idempotencyKey: string }): Promise<DeliveryReceipt>;
}
