import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/whatsapp';

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      data-whatsapp-link
      data-floating-whatsapp
      data-analytics-event="cta_whatsapp_click"
      data-analytics-placement="floating"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with YAIdigitals on WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex min-h-12 items-center gap-2 rounded-full border border-primary/40 bg-[#101810] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_36px_rgba(0,0,0,.45)] transition hover:-translate-y-0.5 hover:border-primary hover:shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bgDark motion-reduce:transform-none sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={20} aria-hidden="true" className="text-primary" />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
