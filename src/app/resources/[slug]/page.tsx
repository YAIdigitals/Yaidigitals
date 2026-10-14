import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getPublishedResourceBySlug,
  getRelatedResources,
  getAdvertisingSettings,
  getDownloadUrl,
  formatFileSize,
} from '@/lib/resources';
import { buildMetadata, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { AdBlock } from '@/components/resources/AdsterraAd';
import { ResourceViewTracker, DownloadButton } from '@/components/resources/ResourceTrackers';
import { ResourceCard } from '@/components/resources/ResourceCard';
import {
  FileText, Download, CheckCircle2, ChevronRight,
  Instagram, ExternalLink, HelpCircle
} from 'lucide-react';

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ utm_source?: string; utm_medium?: string; utm_campaign?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublishedResourceBySlug(slug).catch(() => null);
  if (!resource) return {};

  const title = resource.seo_title || resource.title;
  const description = resource.meta_description || resource.summary || '';
  const image = resource.og_image || resource.cover_image || '';

  return buildMetadata({
    title,
    description,
    path: `/resources/${slug}`,
    image,
    type: 'article',
    publishedTime: resource.published_at || undefined,
    modifiedTime: resource.updated_at,
  });
}

export default async function ResourceDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const utmSource = sp.utm_source || null;
  const utmMedium = sp.utm_medium || null;
  const utmCampaign = sp.utm_campaign || null;

  const [resource, adSettings] = await Promise.all([
    getPublishedResourceBySlug(slug).catch(() => null),
    getAdvertisingSettings().catch(() => null),
  ]);

  if (!resource) notFound();

  const downloadUrl = getDownloadUrl(resource);
  const related = await getRelatedResources(resource.id, resource.category_id, 3).catch(() => []);

  const hasDownload = Boolean(downloadUrl);
  const adsEnabled = (adSettings?.global_enabled ?? false) && resource.ads_enabled;

  // JSON-LD: DigitalDocument schema
  const documentLd = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: resource.title,
    description: resource.summary || resource.meta_description || '',
    url: absoluteUrl(`/resources/${slug}`),
    ...(resource.published_at ? { datePublished: resource.published_at } : {}),
    ...(resource.updated_at ? { dateModified: resource.updated_at } : {}),
    ...(resource.cover_image ? { image: absoluteUrl(resource.cover_image) } : {}),
    publisher: { '@id': 'https://www.yaidigitals.co.in/#organization' },
    isPartOf: { '@id': 'https://www.yaidigitals.co.in/#website' },
  };

  const tags: string[] = Array.isArray(resource.tags) ? resource.tags : [];

  return (
    <>
      <JsonLd data={[
        documentLd,
        breadcrumbJsonLd([
          { name: 'Resources', path: '/resources' },
          ...(resource.category ? [{ name: resource.category.name, path: `/resources/category/${resource.category.slug}` }] : []),
          { name: resource.title, path: `/resources/${slug}` },
        ]),
      ]} />

      {/* Client-side view tracker */}
      <ResourceViewTracker
        resourceId={resource.id}
        utmSource={utmSource}
        utmMedium={utmMedium}
        utmCampaign={utmCampaign}
      />

      <article>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border bg-bgDark">
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

          <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-10">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-textMuted">
              <Link href="/resources" className="hover:text-primary">Resources</Link>
              {resource.category && (
                <>
                  <ChevronRight size={14} aria-hidden />
                  <Link href={`/resources/category/${resource.category.slug}`} className="hover:text-primary">
                    {resource.category.name}
                  </Link>
                </>
              )}
              <ChevronRight size={14} aria-hidden />
              <span className="truncate text-textMain">{resource.title}</span>
            </nav>

            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
              {/* Left: content */}
              <div>
                {resource.category && (
                  <span className="eyebrow">{resource.category.name}</span>
                )}
                <h1 className="mt-3 text-3xl font-bold leading-tight text-textMain sm:text-4xl lg:text-5xl">
                  {resource.title}
                </h1>
                {resource.summary && (
                  <p className="mt-5 text-lg leading-relaxed text-textMuted">
                    {resource.summary}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="rounded-full border border-border bg-bgCard px-3 py-1 text-xs text-textMuted">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick download CTA in hero */}
                {hasDownload && (
                  <div className="mt-8">
                    <DownloadButton
                      resourceId={resource.id}
                      downloadUrl={downloadUrl!}
                      fileName={resource.file_name || undefined}
                      utmSource={utmSource || undefined}
                      utmMedium={utmMedium || undefined}
                      utmCampaign={utmCampaign || undefined}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-base font-semibold text-bgDark transition-all hover:bg-primaryDark hover:shadow-glow"
                    >
                      <Download size={18} />
                      Free Download
                      {resource.file_name && resource.file_size && (
                        <span className="ml-1 text-sm opacity-75">({resource.file_type?.toUpperCase()} · {formatFileSize(resource.file_size)})</span>
                      )}
                    </DownloadButton>
                    <p className="mt-2 text-xs text-textMuted">No signup required · Completely free</p>
                  </div>
                )}
              </div>

              {/* Right: cover image */}
              {resource.cover_image ? (
                <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resource.cover_image}
                    alt={resource.title}
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-border bg-bgCard p-12">
                  <FileText size={64} className="text-primary/30" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Ad: 728×90 / 300×250 after hero ─────────────────── */}
        {adsEnabled && (
          <div className="mx-auto max-w-6xl px-6 py-8">
            <AdBlock
              globalEnabled={adSettings?.global_enabled ?? false}
              resourceAdsEnabled={resource.ads_enabled}
              nativeEnabled={adSettings?.native_enabled}
              banner300x250Enabled={adSettings?.banner_300x250_enabled}
              banner320x50Enabled={adSettings?.banner_320x50_enabled}
              banner728x90Enabled={adSettings?.banner_728x90_enabled}
              placement="content"
            />
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            {/* Article */}
            <div className="space-y-12">
              {/* Article body */}
              {resource.article && (
                <section>
                  <h2 className="text-2xl font-bold text-textMain">About This Resource</h2>
                  <div className="prose-resource mt-6 space-y-4 text-base leading-relaxed text-textMuted">
                    {resource.article.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Mid-content ad */}
              {adsEnabled && (
                <AdBlock
                  globalEnabled={adSettings?.global_enabled ?? false}
                  resourceAdsEnabled={resource.ads_enabled}
                  banner300x250Enabled={adSettings?.banner_300x250_enabled}
                  banner728x90Enabled={adSettings?.banner_728x90_enabled}
                  placement="content"
                />
              )}

              {/* Download section */}
              <section id="download" className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-bgCard to-bgDark p-8">
                <h2 className="text-2xl font-bold text-textMain">
                  {hasDownload ? '📄 Download This Resource' : '📄 This Resource'}
                </h2>
                <p className="mt-3 text-textMuted">
                  {hasDownload
                    ? 'Get your free copy instantly — no email, no signup, no catch.'
                    : 'This resource is being prepared. Follow us on Instagram for updates.'}
                </p>

                {hasDownload ? (
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <DownloadButton
                      resourceId={resource.id}
                      downloadUrl={downloadUrl!}
                      fileName={resource.file_name || undefined}
                      utmSource={utmSource || undefined}
                      utmMedium={utmMedium || undefined}
                      utmCampaign={utmCampaign || undefined}
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-bgDark transition-all hover:bg-primaryDark hover:shadow-glow active:scale-[0.98]"
                    >
                      <Download size={20} />
                      Download Free
                    </DownloadButton>

                    {resource.file_name && (
                      <div className="text-sm text-textMuted">
                        <p className="font-medium text-textMain">{resource.file_name}</p>
                        {resource.file_type && (
                          <p>{resource.file_type.toUpperCase()}{resource.file_size ? ` · ${formatFileSize(resource.file_size)}` : ''}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 flex gap-4">
                    <a
                      href="https://instagram.com/yaidigitals_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-textMuted transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Instagram size={16} /> Follow on Instagram
                    </a>
                  </div>
                )}

                {resource.google_drive_url && (
                  <div className="mt-4">
                    <a
                      href={resource.google_drive_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-textMuted hover:text-primary"
                    >
                      <ExternalLink size={13} /> Also available on Google Drive
                    </a>
                    <p className="mt-1 text-xs text-textMuted/60">
                      Ensure you have the required access permissions for the Drive link.
                    </p>
                  </div>
                )}
              </section>

              {/* FAQ section */}
              {hasDownload && (
                <section>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-textMain">
                    <HelpCircle size={22} className="text-primary" />
                    Frequently Asked Questions
                  </h2>
                  <div className="mt-6 space-y-4">
                    {[
                      {
                        q: `Is "${resource.title}" really free?`,
                        a: 'Yes, completely free. No email required, no signup, no hidden costs. Click the download button and get the file immediately.',
                      },
                      {
                        q: 'What format is this resource in?',
                        a: `This resource is available as a ${resource.file_type?.toUpperCase() || 'downloadable file'}. ${resource.file_name ? `The file is named "${resource.file_name}".` : ''} You can open it on any device.`,
                      },
                      {
                        q: 'Can I share this resource?',
                        a: 'Yes, feel free to share the link to this page. Please link back to YAIdigitals when sharing.',
                      },
                      {
                        q: 'Who created this resource?',
                        a: 'This resource was created by the YAIdigitals team — a technology company specializing in websites, apps, and AI systems for businesses.',
                      },
                    ].map((faq, i) => (
                      <details
                        key={i}
                        className="group rounded-xl border border-border bg-bgCard"
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-textMain [&::-webkit-details-marker]:hidden">
                          {faq.q}
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-textMuted transition-transform group-open:rotate-90"
                          />
                        </summary>
                        <div className="border-t border-border px-5 pb-4 pt-3 text-sm leading-relaxed text-textMuted">
                          {faq.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Quick info */}
              <div className="rounded-2xl border border-border bg-bgCard p-5">
                <h3 className="font-semibold text-textMain">Resource Details</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {resource.category && (
                    <div className="flex justify-between">
                      <dt className="text-textMuted">Category</dt>
                      <dd className="font-medium text-textMain">{resource.category.name}</dd>
                    </div>
                  )}
                  {resource.file_type && (
                    <div className="flex justify-between">
                      <dt className="text-textMuted">Format</dt>
                      <dd className="font-medium text-textMain">{resource.file_type.toUpperCase()}</dd>
                    </div>
                  )}
                  {resource.file_size && (
                    <div className="flex justify-between">
                      <dt className="text-textMuted">Size</dt>
                      <dd className="font-medium text-textMain">{formatFileSize(resource.file_size)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-textMuted">Price</dt>
                    <dd className="font-bold text-primary">Free</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-textMuted">Downloads</dt>
                    <dd className="font-medium text-textMain">{resource.download_count}</dd>
                  </div>
                </dl>

                {hasDownload && (
                  <DownloadButton
                    resourceId={resource.id}
                    downloadUrl={downloadUrl!}
                    fileName={resource.file_name || undefined}
                    utmSource={utmSource || undefined}
                    utmMedium={utmMedium || undefined}
                    utmCampaign={utmCampaign || undefined}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-bgDark transition-colors hover:bg-primaryDark hover:shadow-glow-sm"
                  >
                    <Download size={15} /> Download Free
                  </DownloadButton>
                )}
              </div>

              {/* What's included */}
              {tags.length > 0 && (
                <div className="rounded-2xl border border-border bg-bgCard p-5">
                  <h3 className="font-semibold text-textMain">Topics Covered</h3>
                  <ul className="mt-4 space-y-2">
                    {tags.map(tag => (
                      <li key={tag} className="flex items-start gap-2 text-sm text-textMuted">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sidebar ad */}
              {adsEnabled && (
                <AdBlock
                  globalEnabled={adSettings?.global_enabled ?? false}
                  resourceAdsEnabled={resource.ads_enabled}
                  banner300x250Enabled={adSettings?.banner_300x250_enabled}
                  placement="sidebar"
                />
              )}

              {/* About YAIdigitals */}
              <div className="rounded-2xl border border-border bg-bgCard p-5 text-sm">
                <p className="font-semibold text-textMain">About YAIdigitals</p>
                <p className="mt-2 leading-relaxed text-textMuted">
                  We build websites, mobile apps, custom software and AI systems for businesses.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 flex items-center gap-1.5 font-medium text-primary hover:text-primaryDark"
                >
                  Start a project <ChevronRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Native ad ────────────────────────────────────────── */}
        {adsEnabled && (
          <div className="border-t border-border bg-bgCard">
            <div className="mx-auto max-w-6xl px-6 py-8">
              <AdBlock
                globalEnabled={adSettings?.global_enabled ?? false}
                resourceAdsEnabled={resource.ads_enabled}
                nativeEnabled={adSettings?.native_enabled}
                placement="footer"
              />
            </div>
          </div>
        )}

        {/* ── Related resources ─────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl font-bold text-textMain">More Free Resources</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(r => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
              >
                View all resources <ChevronRight size={14} />
              </Link>
            </div>
          </section>
        )}
      </article>

      {/* Mobile sticky banner */}
      {adsEnabled && (
        <AdBlock
          globalEnabled={adSettings?.global_enabled ?? false}
          resourceAdsEnabled={resource.ads_enabled}
          banner320x50Enabled={adSettings?.banner_320x50_enabled}
          placement="mobile-sticky"
        />
      )}
    </>
  );
}
