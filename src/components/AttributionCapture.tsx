const CAPTURE_SCRIPT = String.raw`(() => {
  const pagePath = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  try {
    let previous = {};
    try { previous = JSON.parse(sessionStorage.getItem('yaidigitals_attribution') || '{}'); } catch {}
    const next = {
      source_url: previous.source_url || window.location.href,
      referrer: previous.referrer || document.referrer,
      utm_source: params.get('utm_source') || previous.utm_source || '',
      utm_medium: params.get('utm_medium') || previous.utm_medium || '',
      utm_campaign: params.get('utm_campaign') || previous.utm_campaign || '',
      utm_content: params.get('utm_content') || previous.utm_content || '',
      utm_term: params.get('utm_term') || previous.utm_term || ''
    };
    sessionStorage.setItem('yaidigitals_attribution', JSON.stringify(next));
  } catch {}

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-analytics-event]') : null;
    if (!target) return;
    const name = target.dataset.analyticsEvent;
    const values = {
      placement: target.dataset.analyticsPlacement,
      destination: target.dataset.analyticsDestination,
      page_path: pagePath
    };
    if (name && typeof window.gtag === 'function') window.gtag('event', name, values);
    if (name && typeof window.fbq === 'function') window.fbq('trackCustom', name, values);
  });

  const prepareLinks = () => {
    const message = 'Hi Yasser, I visited YAIdigitals on ' + pagePath + ' and would like to discuss a project.';
    const url = 'https://wa.me/916006107923?text=' + encodeURIComponent(message);
    document.querySelectorAll('[data-whatsapp-link]').forEach((link) => link.setAttribute('href', url));
    if (pagePath.startsWith('/admin')) {
      document.querySelectorAll('[data-floating-whatsapp]').forEach((item) => item.setAttribute('hidden', ''));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareLinks, { once: true });
  else prepareLinks();
})();`;

/** Small inline enhancement: first-touch attribution and privacy-safe CTA events. */
export function AttributionCapture() {
  return <script dangerouslySetInnerHTML={{ __html: CAPTURE_SCRIPT }} />;
}
