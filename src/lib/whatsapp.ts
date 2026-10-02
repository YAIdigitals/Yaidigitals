export const WHATSAPP_NUMBER = '916006107923';
export const WHATSAPP_DISPLAY_NUMBER = '+91 6006107923';

export function whatsappUrl(context?: string) {
  const pageContext = context?.trim() ? ` on ${context.trim()}` : '';
  const message = `Hi Yasser, I visited YAIdigitals${pageContext} and would like to discuss a project.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
