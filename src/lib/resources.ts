/**
 * Resource Hub library — types, data access, and utility functions.
 * Server-side only (uses createServerSupabase).
 */
import { createServerSupabase } from '@/lib/supabase/server';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ResourceStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface Resource {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  summary: string | null;
  article: string | null;
  category_id: number | null;
  tags: string[];
  cover_image: string | null;
  file_type: string | null;
  file_name: string | null;
  file_size: number | null;
  google_drive_url: string | null;
  storage_path: string | null;
  external_download_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  featured: boolean;
  ads_enabled: boolean;
  status: ResourceStatus;
  published_at: string | null;
  scheduled_at: string | null;
  view_count: number;
  download_count: number;
  // Joined
  category?: ResourceCategory;
}

export interface ResourceCampaign {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  resource_id: number;
  reel_id: string | null;
  comment_keyword: string | null;
  landing_url: string | null;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string | null;
  automation_provider: string;
  automation_status: string;
  external_ref: string | null;
  notes: string | null;
  // Joined
  resource?: { title: string; slug: string };
}

export interface ResourceEvent {
  id: number;
  created_at: string;
  resource_id: number;
  event_type: 'view' | 'download_click';
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country_code: string | null;
  device_type: string | null;
}

export interface AdvertisingSettings {
  id: number;
  updated_at: string;
  provider: string;
  global_enabled: boolean;
  native_enabled: boolean;
  banner_300x250_enabled: boolean;
  banner_320x50_enabled: boolean;
  banner_728x90_enabled: boolean;
  website_id: string | null;
  config: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Data access — Public (uses anon key, RLS-filtered)                  */
/* ------------------------------------------------------------------ */

export async function getPublishedResources(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = createServerSupabase();
  let query = supabase
    .from('resources')
    .select('*, category:resource_categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (options?.category) {
    // Join filter via category slug
    const { data: cat } = await supabase
      .from('resource_categories')
      .select('id')
      .eq('slug', options.category)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    } else {
      return { data: [], count: 0 };
    }
  }

  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options?.limit ?? 12) - 1);

  const { data, count, error } = await query;
  if (error) throw error;
  return { data: (data ?? []) as Resource[], count: count ?? 0 };
}

export async function getPublishedResourceBySlug(slug: string): Promise<Resource | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:resource_categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as Resource | null;
}

export async function getRelatedResources(resourceId: number, categoryId: number | null, limit = 3) {
  const supabase = createServerSupabase();
  let query = supabase
    .from('resources')
    .select('id, title, slug, summary, cover_image, category:resource_categories(name, slug)')
    .eq('status', 'published')
    .neq('id', resourceId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data } = await query;
  return (data ?? []) as unknown as Array<Pick<Resource, 'id' | 'title' | 'slug' | 'summary' | 'cover_image'> & { category: { name: string; slug: string } | null }>;
}

export async function getResourceCategories(): Promise<ResourceCategory[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('resource_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data ?? []) as ResourceCategory[];
}

export async function getAdvertisingSettings(): Promise<AdvertisingSettings | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('advertising_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data as AdvertisingSettings | null;
}

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateTrackingUrl(
  baseUrl: string,
  resource: { slug: string },
  campaign?: { utm_source?: string; utm_medium?: string; utm_campaign?: string }
): string {
  const url = new URL(`/resources/${resource.slug}`, baseUrl);
  if (campaign?.utm_source) url.searchParams.set('utm_source', campaign.utm_source);
  if (campaign?.utm_medium) url.searchParams.set('utm_medium', campaign.utm_medium);
  if (campaign?.utm_campaign) url.searchParams.set('utm_campaign', campaign.utm_campaign);
  return url.toString();
}

export function generateDMMessage(resource: { title: string }, trackingUrl: string): string {
  return `Hey! 👋 Here's your free resource: "${resource.title}"\n\n📄 Download it here:\n${trackingUrl}\n\nEnjoy! 🎉`;
}

export function validateGoogleDriveUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'drive.google.com' || parsed.hostname === 'docs.google.com') &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}

export function getDownloadUrl(resource: Resource): string | null {
  if (resource.google_drive_url) return resource.google_drive_url;
  if (resource.external_download_url) return resource.external_download_url;
  if (resource.storage_path) return resource.storage_path; // Supabase signed URL
  return null;
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
