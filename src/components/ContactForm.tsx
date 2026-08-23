'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  project_type: string;
  budget_range: string;
  required_service: string;
  project_description: string;
  preferred_contact_method: 'email' | 'phone' | 'whatsapp' | 'video-call';
};

const EMPTY_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  project_type: '',
  budget_range: '',
  required_service: '',
  project_description: '',
  preferred_contact_method: 'email',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(field: keyof FormData, value: string): string | null {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name looks too short.';
      return null;
    case 'email':
      if (!value.trim()) return 'Please enter your email address.';
      if (!EMAIL_RE.test(value.trim())) return 'Please enter a valid email address.';
      return null;
    case 'phone':
      if (value.trim() && !/^[+\d][\d\s\-()]{5,18}$/.test(value.trim())) {
        return 'Please enter a valid phone number.';
      }
      return null;
    default:
      return null;
  }
}

const inputClasses = (hasError: boolean) =>
  [
    'w-full rounded-lg border bg-bgDark px-3.5 py-2.5 text-sm text-textMain placeholder:text-textMuted/50',
    'transition-colors duration-150 focus:outline-none focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError
      ? 'border-red-500/60 focus:border-red-500'
      : 'border-border hover:border-white/15 focus:border-primary',
  ].join(' ');

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const setField =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear an existing error as soon as the field becomes valid
      if (errors[field]) {
        const message = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
      }
    };

  const handleBlur = (field: keyof FormData) => () => {
    if (!formData[field]) return; // don't scold empty untouched fields on blur
    const message = validateField(field, formData[field] as string);
    setErrors((prev) => ({ ...prev, [field]: message ?? undefined }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) {
      setSuccess(true); // silently drop bots
      return;
    }

    // Validate all fields on submit
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    (['name', 'email', 'phone'] as const).forEach((field) => {
      const message = validateField(field, formData[field]);
      if (message) nextErrors[field] = message;
    });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById('name')?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const fieldErrors = (data?.fields ?? {}) as Record<string, string>;
        if (fieldErrors.name || fieldErrors.email || fieldErrors.phone) {
          setErrors({
            name: fieldErrors.name,
            email: fieldErrors.email,
            phone: fieldErrors.phone,
          });
        }
        throw new Error(data?.error ?? 'Request failed');
      }

      setSuccess(true);
      setFormData(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError(
        'Something went wrong while sending your message. Please try again, or email us directly at info@yaidigitals.com.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Success state */}
      <div aria-live="polite">
        {success && (
          <div className="mb-8 animate-fade-up rounded-xl border border-primary/25 bg-primary/8 p-5 motion-reduce:animate-none">
            <h3 className="flex items-center gap-2 font-semibold text-primary">
              <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />
              Message received
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">
              Thank you — we&apos;ll review your brief and get back to you shortly.
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div role="alert" className="mb-8 animate-fade-up rounded-xl border border-red-500/30 bg-red-500/10 p-5 motion-reduce:animate-none">
            <h3 className="flex items-center gap-2 font-semibold text-red-400">
              <AlertCircle size={18} strokeWidth={2} aria-hidden="true" />
              Something went wrong
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">{error}</p>
          </div>
        )}
      </div>

      {!success && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Name" htmlFor="name" required error={errors.name}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={setField('name')}
                onBlur={handleBlur('name')}
                disabled={loading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                placeholder="Your full name"
                className={inputClasses(!!errors.name)}
              />
            </Field>

            <Field label="Email" htmlFor="email" required error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={formData.email}
                onChange={setField('email')}
                onBlur={handleBlur('email')}
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="you@company.com"
                className={inputClasses(!!errors.email)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Phone" htmlFor="phone" error={errors.phone} hint="Optional">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={setField('phone')}
                onBlur={handleBlur('phone')}
                disabled={loading}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                placeholder="+91 ..."
                className={inputClasses(!!errors.phone)}
              />
            </Field>

            <Field label="Company" htmlFor="company" hint="Optional">
              <input
                id="company"
                type="text"
                autoComplete="organization"
                value={formData.company}
                onChange={setField('company')}
                disabled={loading}
                placeholder="Company or brand name"
                className={inputClasses(false)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Project Type" htmlFor="project_type">
              <select id="project_type" value={formData.project_type} onChange={setField('project_type')} disabled={loading} className={inputClasses(false)}>
                <option value="">Select project type</option>
                <option value="website">Website</option>
                <option value="app">Mobile Application</option>
                <option value="ai-automation">AI Automation</option>
                <option value="custom-software">Custom Software</option>
                <option value="seo">SEO Optimization</option>
                <option value="maintenance">Maintenance &amp; Support</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Budget Range" htmlFor="budget_range">
              <select id="budget_range" value={formData.budget_range} onChange={setField('budget_range')} disabled={loading} className={inputClasses(false)}>
                <option value="">Select budget range</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-15000">$5,000 - $15,000</option>
                <option value="15000-50000">$15,000 - $50,000</option>
                <option value="over-50000">Over $50,000</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Required Service" htmlFor="required_service">
              <select id="required_service" value={formData.required_service} onChange={setField('required_service')} disabled={loading} className={inputClasses(false)}>
                <option value="">Select required service</option>
                <option value="website-development">Website Development</option>
                <option value="app-development">App Development</option>
                <option value="ai-calling-agents">AI Calling Agents</option>
                <option value="ai-automation">AI Automation</option>
                <option value="custom-software">Custom Software Development</option>
                <option value="seo">SEO Optimization</option>
                <option value="maintenance">Maintenance &amp; Support</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Preferred Contact Method" htmlFor="preferred_contact_method">
              <select id="preferred_contact_method" value={formData.preferred_contact_method} onChange={setField('preferred_contact_method')} disabled={loading} className={inputClasses(false)}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="video-call">Video Call</option>
              </select>
            </Field>
          </div>

          {/* Honeypot — hidden from users and assistive tech */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <Field
            label="Project Description"
            htmlFor="project_description"
            hint={`${formData.project_description.length}/2000`}
          >
            <textarea
              id="project_description"
              rows={6}
              maxLength={2000}
              value={formData.project_description}
              onChange={setField('project_description')}
              disabled={loading}
              placeholder="Describe your project, goals, timeline and any specific requirements…"
              className={`${inputClasses(false)} resize-y`}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-medium text-textMain transition-all duration-200 hover:bg-primaryDark hover:shadow-glow-sm active:translate-y-px disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} strokeWidth={2.5} aria-hidden="true" className="animate-spin" />
                Sending…
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-textMuted">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-primary">
              *
            </span>
          )}
        </label>
        {hint && !error && <span className="text-[11px] text-textMuted/70">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} strokeWidth={2} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
