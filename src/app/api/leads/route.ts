import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,18}$/;

const PROJECT_TYPES = ['website', 'app', 'ai-automation', 'custom-software', 'seo', 'maintenance', 'consulting', 'other'];
const BUDGET_RANGES = ['under-1000', '1000-5000', '5000-15000', '15000-50000', 'over-50000'];
const SERVICES = [
  'website-development',
  'app-development',
  'ai-calling-agents',
  'ai-automation',
  'custom-software',
  'seo',
  'maintenance',
  'consulting',
  'other',
];
const CONTACT_METHODS = ['email', 'phone', 'whatsapp', 'video-call'];

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  project_type?: unknown;
  budget_range?: unknown;
  required_service?: unknown;
  project_description?: unknown;
  preferred_contact_method?: unknown;
  website?: unknown;
};

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Server-side lead intake. Validates every field before touching the
 * database — client-side validation is only a convenience layer.
 */
export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Honeypot: pretend success, store nothing
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const fieldErrors: Record<string, string> = {};

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const company = str(body.company);
  const projectType = str(body.project_type);
  const budgetRange = str(body.budget_range);
  const requiredService = str(body.required_service);
  const description = str(body.project_description);
  const contactMethod = str(body.preferred_contact_method) || 'email';

  if (name.length < 2 || name.length > 100) fieldErrors.name = 'Name must be between 2 and 100 characters.';
  if (!EMAIL_RE.test(email) || email.length > 200) fieldErrors.email = 'A valid email address is required.';
  if (phone && (!PHONE_RE.test(phone) || phone.length > 25)) fieldErrors.phone = 'Phone number looks invalid.';
  if (company.length > 120) fieldErrors.company = 'Company name is too long.';
  if (projectType && !PROJECT_TYPES.includes(projectType)) fieldErrors.project_type = 'Unknown project type.';
  if (budgetRange && !BUDGET_RANGES.includes(budgetRange)) fieldErrors.budget_range = 'Unknown budget range.';
  if (requiredService && !SERVICES.includes(requiredService)) fieldErrors.required_service = 'Unknown service.';
  if (description.length > 2000) fieldErrors.project_description = 'Description must be under 2000 characters.';
  if (!CONTACT_METHODS.includes(contactMethod)) fieldErrors.preferred_contact_method = 'Unknown contact method.';

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: 'Validation failed.', fields: fieldErrors },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabase();
    const { error: insertError } = await supabase.from('leads').insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      project_type: projectType || null,
      budget_range: budgetRange || null,
      required_service: requiredService || null,
      project_description: description || null,
      preferred_contact_method: contactMethod,
    });

    if (insertError) throw insertError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/leads] insert failed:', err);
    return NextResponse.json(
      { error: 'Failed to submit your request. Please try again.' },
      { status: 500 }
    );
  }
}
