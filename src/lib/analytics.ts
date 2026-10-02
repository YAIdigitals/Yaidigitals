'use client';

export type AnalyticsEvent =
  | 'cta_project_click'
  | 'cta_whatsapp_click'
  | 'cta_audit_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'case_study_view'
  | 'service_view';

type SafeParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, parameters?: SafeParameters) => void;
    fbq?: (command: 'trackCustom', name: string, parameters?: SafeParameters) => void;
  }
}

/** Analytics payloads must only contain page/action context—never lead PII. */
export function trackEvent(name: AnalyticsEvent, parameters: SafeParameters = {}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, parameters);
  window.fbq?.('trackCustom', name, parameters);
}
