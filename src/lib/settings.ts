/**
 * Server-side reader for admin-managed site settings.
 * All keys live in the public `settings` table as JSON blobs and are safe to
 * expose (no secrets — verification codes and analytics IDs are public anyway).
 * Every read falls back to safe defaults so the site renders even before the
 * seed script has run or when the database is unreachable.
 */
import { createServerSupabase } from '@/lib/supabase/server';

export type SiteSettings = {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  address: string;
  business_hours: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  footer_description: string;
  default_cta_text: string;
  default_cta_url: string;
};

export type HomepageSettings = {
  hero: {
    badge: string;
    heading: string;
    highlighted: string;
    description: string;
    primary_cta_text: string;
    primary_cta_url: string;
    secondary_cta_text: string;
    secondary_cta_url: string;
    below_cta: string;
  };
  sections: {
    key: string;
    enabled: boolean;
    sort_order: number;
    eyebrow: string;
    title: string;
    description: string;
  }[];
};

export type IntegrationSettings = {
  google_analytics_id: string;
  tag_manager_id: string;
  meta_pixel_id: string;
};

export type SeoSettings = {
  site_name: string;
  title_template: string;
  default_title: string;
  default_description: string;
  canonical_domain: string;
  og_image: string;
  twitter_handle: string;
  google_site_verification: string;
  organization: {
    name: string;
    email: string;
  };
};

export const DEFAULT_SITE: SiteSettings = {
  company_name: 'YAIdigitals',
  contact_email: 'info@yaidigitals.com',
  contact_phone: '',
  whatsapp: '',
  address: '',
  business_hours: '',
  social: {
    instagram: 'https://instagram.com/yaidigitals_',
    facebook: 'https://facebook.com/yaidigitals',
    twitter: 'https://twitter.com/yaidigitals',
    linkedin: '',
  },
  footer_description: 'Technology built around your business.',
  default_cta_text: 'Start a Project',
  default_cta_url: '/contact',
};

export const DEFAULT_HOMEPAGE: HomepageSettings = {
  hero: {
    badge: 'Technology • Software • AI',
    heading: 'We Build Digital Products That Move Businesses Forward.',
    highlighted: 'Apps. Software. Websites. AI. Built Around Your Business.',
    description:
      'YAIdigitals designs and develops powerful digital products for ambitious businesses—from high-performance websites and custom applications to scalable platforms and AI-powered automation.',
    primary_cta_text: 'Start Your Project',
    primary_cta_url: '/contact',
    secondary_cta_text: 'Explore Our Work',
    secondary_cta_url: '/work',
    below_cta: 'Strategy • Design • Development • Deployment • Support',
  },
  sections: [
    { key: 'work', enabled: true, sort_order: 1, eyebrow: 'SELECTED WORK', title: 'Real Products. Real Businesses. Real Engineering.', description: "We don't just design screens. We build digital systems designed to solve real business problems." },
    { key: 'services', enabled: true, sort_order: 2, eyebrow: 'WHAT WE BUILD', title: 'Technology Built Around Your Business', description: 'From an initial idea to production deployment, YAIdigitals helps businesses design, build and scale digital products.' },
    { key: 'industries', enabled: true, sort_order: 3, eyebrow: 'INDUSTRIES', title: 'Technology for Businesses That Want to Grow', description: 'Every industry has different workflows, customers and challenges. We build technology around those differences.' },
    { key: 'ai-calling', enabled: true, sort_order: 4, eyebrow: 'AI CALLING AGENTS', title: 'AI That Can Actually Talk to Your Customers.', description: 'YAIdigitals builds AI voice agents that can handle common business conversations, respond to enquiries, qualify leads, support bookings and route customers when human assistance is required.' },
    { key: 'technology', enabled: true, sort_order: 5, eyebrow: 'TECHNOLOGY', title: 'Modern Technology. Practical Engineering.', description: "We select technology based on the product's requirements—not simply because a framework is popular." },
    { key: 'process', enabled: true, sort_order: 6, eyebrow: 'HOW WE WORK', title: 'From Idea to Production', description: 'A structured development process keeps technology aligned with real business requirements.' },
    { key: 'why', enabled: true, sort_order: 7, eyebrow: 'WHY YAIDIGITALS', title: 'More Than a Development Vendor', description: '' },
    { key: 'testimonials', enabled: true, sort_order: 8, eyebrow: 'TESTIMONIALS', title: 'What Clients Say', description: '' },
    { key: 'insights', enabled: true, sort_order: 9, eyebrow: 'INSIGHTS', title: 'Thinking That Helps You Build Better', description: 'Practical writing on software, apps and AI for growing businesses.' },
    { key: 'faq', enabled: true, sort_order: 10, eyebrow: 'FAQ', title: 'Frequently Asked Questions', description: '' },
  ],
};

export const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  google_analytics_id: '',
  tag_manager_id: '',
  meta_pixel_id: '',
};

export const DEFAULT_SEO: SeoSettings = {
  site_name: 'YAIdigitals',
  title_template: '%s | YAIdigitals',
  default_title: 'YAIdigitals | Apps, Software, Websites & AI Solutions',
  default_description:
    'YAIdigitals designs and develops mobile apps, web applications, business websites, custom software and AI-powered solutions for growing businesses.',
  canonical_domain: 'https://www.yaidigitals.co.in',
  og_image: '',
  twitter_handle: '',
  google_site_verification: '',
  organization: {
    name: 'YAIdigitals',
    email: 'info@yaidigitals.com',
  },
};

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed } as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/** Fetch site + seo + homepage + integrations settings in a single request. */
export async function getSettingsBundle(): Promise<{
  site: SiteSettings;
  seo: SeoSettings;
  homepage: HomepageSettings;
  integrations: IntegrationSettings;
}> {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['site', 'seo', 'homepage', 'integrations']);
    const rows = new Map((data ?? []).map((r) => [r.key as string, r.value as string]));
    return {
      site: parseJSON(rows.get('site'), DEFAULT_SITE),
      seo: parseJSON(rows.get('seo'), DEFAULT_SEO),
      homepage: parseJSON(rows.get('homepage'), DEFAULT_HOMEPAGE),
      integrations: parseJSON(rows.get('integrations'), DEFAULT_INTEGRATIONS),
    };
  } catch {
    return {
      site: DEFAULT_SITE,
      seo: DEFAULT_SEO,
      homepage: DEFAULT_HOMEPAGE,
      integrations: DEFAULT_INTEGRATIONS,
    };
  }
}
