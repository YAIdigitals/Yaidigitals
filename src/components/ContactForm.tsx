'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/whatsapp';

type FormData = {
  name: string;
  email: string;
  phone: string;
  required_service: string;
  short_description: string;
  company: string;
  project_type: string;
  budget_range: string;
  existing_website: string;
  preferred_contact_method: 'email' | 'phone' | 'whatsapp' | 'video-call';
  additional_details: string;
  consent: boolean;
};

const EMPTY_FORM: FormData = {
  name: '', email: '', phone: '', required_service: '', short_description: '', company: '',
  project_type: '', budget_range: '', existing_website: '', preferred_contact_method: 'email',
  additional_details: '', consent: false,
};

const SERVICE_OPTIONS = [
  ['website-development', 'Website Development'],
  ['web-application-development', 'Web Application Development'],
  ['mobile-app-development', 'Mobile App Development'],
  ['ecommerce', 'E-commerce Development'],
  ['ai-calling-agents', 'AI Calling Agents'],
  ['ai-automation', 'AI Automation'],
  ['custom-software', 'Custom Software Development'],
  ['startup-mvp-development', 'Startup MVP Development'],
  ['maintenance-support', 'Maintenance & Technical Support'],
  ['other', 'Other / Not sure'],
] as const;

const BUDGET_OPTIONS = [
  ['under-25k', 'Under ₹25,000'], ['25-50k', '₹25,000–₹50,000'], ['50k-1l', '₹50,000–₹1 Lakh'],
  ['1-3l', '₹1 Lakh–₹3 Lakh'], ['3-10l', '₹3 Lakh–₹10 Lakh'], ['10-25l', '₹10 Lakh–₹25 Lakh'],
  ['over-25l', 'Over ₹25 Lakh'], ['not-sure', 'Not sure yet'],
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,20}$/;

const inputClasses = (error = false) =>
  `w-full min-h-11 rounded-lg border bg-bgDark px-3.5 py-2.5 text-sm text-textMain placeholder:text-textMuted/55 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500/70 focus:border-red-500' : 'border-border hover:border-white/20 focus:border-primary'}`;

function validateStepOne(data: FormData) {
  const errors: Record<string, string> = {};
  if (data.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!data.email.trim() && !data.phone.trim()) errors.email = 'Enter an email address or phone number.';
  if (data.email && !EMAIL_RE.test(data.email.trim())) errors.email = 'Enter a valid email address.';
  if (data.phone && !PHONE_RE.test(data.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!data.required_service) errors.required_service = 'Choose the service you need.';
  if (data.short_description.trim().length < 10) errors.short_description = 'Share at least 10 characters about the project.';
  return errors;
}

function validateStepTwo(data: FormData) {
  const errors: Record<string, string> = {};
  if (data.existing_website) {
    try {
      const url = new URL(data.existing_website);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      errors.existing_website = 'Enter a full URL beginning with http:// or https://.';
    }
  }
  if (!data.consent) errors.consent = 'Please confirm that we may contact you about this enquiry.';
  return errors;
}

export default function ContactForm({ contactEmail = 'info@yaidigitals.com' }: { contactEmail?: string }) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const trackedStart = useRef(false);

  useEffect(() => {
    if (!startedAt.current) startedAt.current = Date.now();
    const params = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem('yaidigitals_attribution');
    let previous: Record<string, string> = {};
    try { previous = stored ? (JSON.parse(stored) as Record<string, string>) : {}; } catch { previous = {}; }
    const current = {
      source_url: previous.source_url || window.location.href,
      referrer: previous.referrer || document.referrer,
      utm_source: params.get('utm_source') || previous.utm_source || '',
      utm_medium: params.get('utm_medium') || previous.utm_medium || '',
      utm_campaign: params.get('utm_campaign') || previous.utm_campaign || '',
      utm_content: params.get('utm_content') || previous.utm_content || '',
      utm_term: params.get('utm_term') || previous.utm_term || '',
    };
    setAttribution(current);
    const service = params.get('service');
    if (service && SERVICE_OPTIONS.some(([value]) => value === service)) {
      setFormData((value) => ({ ...value, required_service: service }));
    }
  }, []);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: '' }));
    if (!trackedStart.current) {
      trackedStart.current = true;
      trackEvent('contact_form_start', { page_path: '/contact' });
    }
  }

  function focusFirstError(nextErrors: Record<string, string>) {
    const first = Object.keys(nextErrors)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  function continueToDetails() {
    const nextErrors = validateStepOne(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return focusFirstError(nextErrors);
    setStep(2);
    requestAnimationFrame(() => document.getElementById('company')?.focus());
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = { ...validateStepOne(formData), ...validateStepTwo(formData) };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      if (Object.keys(validateStepOne(formData)).length) setStep(1);
      focusFirstError(nextErrors);
      trackEvent('contact_form_error', { reason: 'validation' });
      return;
    }

    setLoading(true);
    setServerError('');
    trackEvent('contact_form_submit', { service: formData.required_service });
    try {
      const projectDescription = [formData.short_description.trim(), formData.additional_details.trim()].filter(Boolean).join('\n\nAdditional details: ');
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          project_description: projectDescription,
          source_url: window.location.href,
          referrer: document.referrer,
          ...attribution,
          form_started_at: startedAt.current,
          website: honeypot,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
      if (!response.ok) {
        if (result.fields) setErrors(result.fields);
        throw new Error(result.error || 'Request failed');
      }
      setSuccess(true);
      trackEvent('contact_form_success', { service: formData.required_service });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : `We could not submit your enquiry. Email ${contactEmail} or contact us on WhatsApp.`);
      trackEvent('contact_form_error', { reason: 'server' });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-primary/25 bg-primary/8 p-6" role="status">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
          <CheckCircle2 size={20} aria-hidden="true" /> Project details received
        </h2>
        <p className="mt-3 leading-relaxed text-textMuted">
          Thank you. Your project details have been received. The YAIdigitals team will contact you within one business day.
        </p>
        {formData.preferred_contact_method === 'whatsapp' && (
          <a
            href={whatsappUrl('the contact form')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_whatsapp_click', { placement: 'form_success' })}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-bgDark"
          >
            <MessageCircle size={18} aria-hidden="true" /> Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-7" aria-label={`Step ${step} of 2`}>
        <div className="flex items-center justify-between text-xs font-medium text-textMuted">
          <span>{step === 1 ? 'Project essentials' : 'Helpful details'}</span><span>Step {step} of 2</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bgDark">
          <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
      </div>

      {serverError && (
        <div role="alert" className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-textMuted">
          <p className="flex items-center gap-2 font-semibold text-red-400"><AlertCircle size={17} aria-hidden="true" /> We couldn&apos;t submit the enquiry</p>
          <p className="mt-1.5">{serverError}</p>
        </div>
      )}

      {step === 1 ? (
        <fieldset className="space-y-5">
          <legend className="sr-only">Project essentials</legend>
          <Field label="Name" id="name" error={errors.name} required>
            <input id="name" autoComplete="name" value={formData.name} onChange={(e) => update('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} className={inputClasses(!!errors.name)} placeholder="Your full name" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" id="email" error={errors.email} hint="Email or phone is required">
              <input id="email" type="email" inputMode="email" autoComplete="email" value={formData.email} onChange={(e) => update('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} className={inputClasses(!!errors.email)} placeholder="you@company.com" />
            </Field>
            <Field label="Phone / WhatsApp" id="phone" error={errors.phone} hint="Email or phone is required">
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} className={inputClasses(!!errors.phone)} placeholder="+91 ..." />
            </Field>
          </div>
          <Field label="Required service" id="required_service" error={errors.required_service} required>
            <select id="required_service" value={formData.required_service} onChange={(e) => update('required_service', e.target.value)} aria-invalid={!!errors.required_service} aria-describedby={errors.required_service ? 'required_service-error' : undefined} className={inputClasses(!!errors.required_service)}>
              <option value="">Select a service</option>
              {SERVICE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
          <Field label="Short project description" id="short_description" error={errors.short_description} required hint="A few sentences is enough">
            <textarea id="short_description" rows={5} value={formData.short_description} onChange={(e) => update('short_description', e.target.value)} aria-invalid={!!errors.short_description} aria-describedby={errors.short_description ? 'short_description-error' : undefined} className={inputClasses(!!errors.short_description)} placeholder="What would you like to build or improve?" />
          </Field>
          <button type="button" onClick={continueToDetails} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-bgDark transition-colors hover:bg-primaryDark sm:w-auto">
            Continue <ArrowRight size={18} aria-hidden="true" />
          </button>
        </fieldset>
      ) : (
        <fieldset className="space-y-5">
          <legend className="sr-only">Helpful project details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company" id="company" hint="Optional"><input id="company" autoComplete="organization" value={formData.company} onChange={(e) => update('company', e.target.value)} className={inputClasses()} placeholder="Company or brand" /></Field>
            <Field label="Project type" id="project_type" hint="Optional">
              <select id="project_type" value={formData.project_type} onChange={(e) => update('project_type', e.target.value)} className={inputClasses()}>
                <option value="">Select type</option><option value="website">Website</option><option value="mobile-app">Mobile app</option><option value="web-app">Web application</option><option value="ecommerce">E-commerce</option><option value="ai">AI system</option><option value="custom-software">Custom software</option><option value="startup-mvp">Startup MVP</option><option value="maintenance">Maintenance</option><option value="other">Other</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Budget range" id="budget_range" hint="Optional">
              <select id="budget_range" value={formData.budget_range} onChange={(e) => update('budget_range', e.target.value)} className={inputClasses()}><option value="">Select budget</option>{BUDGET_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            </Field>
            <Field label="Preferred contact" id="preferred_contact_method">
              <select id="preferred_contact_method" value={formData.preferred_contact_method} onChange={(e) => update('preferred_contact_method', e.target.value as FormData['preferred_contact_method'])} className={inputClasses()}><option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option><option value="video-call">Video call</option></select>
            </Field>
          </div>
          <Field label="Existing website" id="existing_website" hint="Optional" error={errors.existing_website}>
            <input id="existing_website" type="url" inputMode="url" value={formData.existing_website} onChange={(e) => update('existing_website', e.target.value)} aria-invalid={!!errors.existing_website} aria-describedby={errors.existing_website ? 'existing_website-error' : undefined} className={inputClasses(!!errors.existing_website)} placeholder="https://example.com" />
          </Field>
          <Field label="Additional details" id="additional_details" hint="Optional"><textarea id="additional_details" rows={4} value={formData.additional_details} onChange={(e) => update('additional_details', e.target.value)} className={inputClasses()} placeholder="Timeline, integrations, references, or other context" /></Field>

          <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-textMuted">
              <input id="consent" type="checkbox" checked={formData.consent} onChange={(e) => update('consent', e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined} className="mt-1 h-4 w-4 rounded border-border accent-primary" />
              <span>I agree that YAIdigitals may contact me about this enquiry. My details will be used only to respond to this request.</span>
            </label>
            {errors.consent && <p id="consent-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.consent}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={() => setStep(1)} disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-textMuted hover:border-primary/50 hover:text-textMain"><ArrowLeft size={17} aria-hidden="true" /> Back</button>
            <button type="submit" disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-bgDark transition-colors hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> Sending…</> : <>Send project details <ArrowRight size={18} aria-hidden="true" /></>}
            </button>
          </div>
        </fieldset>
      )}
    </form>
  );
}

function Field({ label, id, error, hint, required, children }: { label: string; id: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-textMain">{label}{required && <span className="ml-1 text-primary" aria-hidden="true">*</span>}</label>
        {hint && <span className="text-xs text-textMuted">{hint}</span>}
      </div>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  );
}
