import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Insights — Practical Writing on Software, Apps & AI',
  description:
    'Practical insights from the YAIdigitals team on building apps, websites, custom software and AI systems for growing businesses.',
  path: '/insights',
});

interface PostRecord {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  featured_image?: string | null;
  author?: string | null;
  published_at?: string | null;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return null;
  }
}

export default async function InsightsPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, featured_image, author, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  const all = (posts ?? []) as unknown as PostRecord[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Insights', path: '/insights' }])) }}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHeading
          as="h1"
          eyebrow="Insights"
          title="Thinking That Helps You Build Better"
          description="Practical writing on software, apps and AI for growing businesses — from the team that builds them."
        />

        {all.length === 0 ? (
          <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
            <h2 className="font-semibold text-textMain">No articles yet</h2>
            <p className="mt-2 text-sm text-textMuted">
              We publish when we have something genuinely useful to say — check back soon.
            </p>
          </div>
        ) : (
          <StaggerGroup className="mt-12 space-y-4">
            {all.map((post) => {
              const date = formatDate(post.published_at);
              return (
                <StaggerItem key={post.id}>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex items-start gap-5 rounded-xl border border-border bg-bgCard p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
                  >
                    {post.featured_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featured_image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="hidden h-20 w-28 shrink-0 rounded-lg border border-border object-cover sm:block"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex"
                      >
                        <Newspaper size={18} strokeWidth={1.75} />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <h2 className="font-semibold text-textMain">{post.title}</h2>
                        {date && (
                          <time dateTime={post.published_at ?? undefined} className="text-xs text-textMuted">
                            {date}
                          </time>
                        )}
                      </div>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">{post.excerpt}</p>
                      )}
                      {post.author && (
                        <p className="mt-2 text-xs text-textMuted">By {post.author}</p>
                      )}
                    </div>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-textMuted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                    />
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </section>
    </>
  );
}
