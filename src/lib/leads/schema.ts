import { createHmac } from 'node:crypto';

export const PROJECT_TYPES = ['website', 'mobile-app', 'web-app', 'ecommerce', 'ai', 'custom-software', 'startup-mvp', 'maintenance', 'other'] as const;
export const BUDGET_RANGES = ['under-25k', '25-50k', '50k-1l', '1-3l', '3-10l', '10-25l', 'over-25l', 'not-sure'] as const;
export const SERVICES = ['website-development', 'web-application-development', 'mobile-app-development', 'ecommerce', 'ai-calling-agents', 'ai-automation', 'custom-software', 'startup-mvp-development', 'maintenance-support', 'other'] as const;
export const CONTACT_METHODS = ['email', 'phone', 'whatsapp', 'video-call'] as const;

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget_range: string;
  required_service: string;
  existing_website: string;
  project_description: string;
  preferred_contact_method: string;
  source_url: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  consent: boolean;
  form_started_at: number;
  website: string;
};

export type LeadRow = Omit<LeadInput, 'consent' | 'form_started_at' | 'website'> & {
  id: number;
  created_at: string;
  consent_at: string | null;
  notification_status: 'pending' | 'processing' | 'sent' | 'failed' | 'permanently_failed';
  notification_attempts: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,20}$/;

function clean(value: unknown, max: number) {
  return (typeof value === 'string' ? value : '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function isHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && Boolean(url.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function parseLeadInput(body: Record<string, unknown>, now = Date.now()) {
  const input: LeadInput = {
    name: clean(body.name, 100),
    email: clean(body.email, 200).toLowerCase(),
    phone: clean(body.phone, 25),
    company: clean(body.company, 120),
    project_type: clean(body.project_type, 50),
    budget_range: clean(body.budget_range, 30),
    required_service: clean(body.required_service, 60),
    existing_website: clean(body.existing_website, 240),
    project_description: clean(body.project_description, 2500),
    preferred_contact_method: clean(body.preferred_contact_method, 20) || 'email',
    source_url: clean(body.source_url, 500),
    referrer: clean(body.referrer, 500),
    utm_source: clean(body.utm_source, 100),
    utm_medium: clean(body.utm_medium, 100),
    utm_campaign: clean(body.utm_campaign, 150),
    utm_content: clean(body.utm_content, 150),
    utm_term: clean(body.utm_term, 150),
    consent: body.consent === true,
    form_started_at: typeof body.form_started_at === 'number' ? body.form_started_at : 0,
    website: clean(body.website, 200),
  };

  const errors: Record<string, string> = {};
  if (input.name.length < 2) errors.name = 'Please enter a name with at least 2 characters.';
  if (!input.email && !input.phone) errors.email = 'Enter an email address or phone number.';
  if (input.email && !EMAIL_RE.test(input.email)) errors.email = 'Please enter a valid email address.';
  if (input.phone && !PHONE_RE.test(input.phone)) errors.phone = 'Please enter a valid phone number.';
  if (!SERVICES.includes(input.required_service as (typeof SERVICES)[number])) errors.required_service = 'Please choose a service.';
  if (input.project_type && !PROJECT_TYPES.includes(input.project_type as (typeof PROJECT_TYPES)[number])) errors.project_type = 'Please choose a valid project type.';
  if (input.budget_range && !BUDGET_RANGES.includes(input.budget_range as (typeof BUDGET_RANGES)[number])) errors.budget_range = 'Please choose a valid budget range.';
  if (!CONTACT_METHODS.includes(input.preferred_contact_method as (typeof CONTACT_METHODS)[number])) errors.preferred_contact_method = 'Please choose a valid contact method.';
  if (input.project_description.length < 10) errors.project_description = 'Please add at least 10 characters about your project.';
  if (!isHttpUrl(input.existing_website)) errors.existing_website = 'Enter a full URL beginning with http:// or https://.';
  if (!isHttpUrl(input.source_url)) errors.source_url = 'Invalid source URL.';
  if (!isHttpUrl(input.referrer)) errors.referrer = 'Invalid referrer URL.';
  if (!input.consent) errors.consent = 'Please confirm that we may contact you about this enquiry.';

  const elapsed = now - input.form_started_at;
  const suspiciousTiming = !input.form_started_at || elapsed < 2500 || elapsed > 24 * 60 * 60 * 1000;

  return { input, errors, isSpam: Boolean(input.website) || suspiciousTiming };
}

export function leadSubmissionKey(input: Pick<LeadInput, 'name' | 'email' | 'phone' | 'required_service' | 'project_description'>, secret: string, date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  const material = [day, input.name.toLowerCase(), input.email, input.phone.replace(/\D/g, ''), input.required_service, input.project_description.toLowerCase()].join('|');
  return createHmac('sha256', secret).update(material).digest('hex');
}

export function ipRateLimitKey(ip: string, secret: string) {
  return createHmac('sha256', secret).update(ip).digest('hex');
}

export function formatLeadNotification(lead: LeadRow) {
  const safe = (text: string | null | undefined, max = 500) =>
    (text?.trim() || '').slice(0, max).replace(/([*_~`])/g, '\\$1');
  const phoneDigits = normaliseWhatsAppNumber(lead.phone);
  const submitted = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(lead.created_at));

  const lines = [
    '🚀 *New YAIdigitals Lead*',
    '',
    `*Lead ID:* ${lead.id}`,
    `*Name:* ${safe(lead.name)}`,
  ];
  const optional: Array<[string, string, number?]> = [
    ['Phone', lead.phone, 25],
    ['Email', lead.email, 200],
    ['Company', lead.company, 120],
    ['Service', lead.required_service, 60],
    ['Project Type', lead.project_type, 50],
    ['Budget', lead.budget_range, 30],
    ['Preferred Contact', lead.preferred_contact_method, 20],
    ['Existing Website', lead.existing_website, 240],
  ];
  for (const [label, raw, max] of optional) {
    const cleaned = safe(raw, max);
    if (cleaned) lines.push(`*${label}:* ${cleaned}`);
  }
  if (lead.project_description) lines.push('', '*Project Details:*', safe(lead.project_description, 1500));
  const attribution: Array<[string, string]> = [
    ['Source Page', lead.source_url],
    ['UTM Source', lead.utm_source],
    ['UTM Medium', lead.utm_medium],
    ['UTM Campaign', lead.utm_campaign],
  ];
  lines.push('');
  for (const [label, raw] of attribution) {
    const cleaned = safe(raw);
    if (cleaned) lines.push(`*${label}:* ${cleaned}`);
  }
  lines.push('', `*Submitted:* ${submitted} IST`);
  if (phoneDigits) lines.push(`*Reply/call:* https://wa.me/${phoneDigits}`);
  return lines.join('\n');
}

export function normaliseWhatsAppNumber(value: string, defaultCountryCode = '91') {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && /^[6-9]/.test(digits)) digits = `${defaultCountryCode}${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? digits : '';
}

export function nextRetryAt(attempt: number, now = Date.now()) {
  const delayMinutes = [5, 30, 120][Math.max(0, attempt - 1)];
  return delayMinutes ? new Date(now + delayMinutes * 60_000).toISOString() : null;
}
