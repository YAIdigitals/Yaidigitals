import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { articleJsonLd, buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const dynamicParams = true;

interface PostRecord {
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author: string | null;
  author_role: string | null;
  published_at: string | null;
  updated_at: string | null;
}

async function getPost(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, featured_image, author, author_role, published_at, updated_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as PostRecord | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Article Not Found', robots: { index: false, follow: false } };

  return buildMetadata({
    title: post.title,
    description: post.excerpt || undefined,
    path: `/insights/${params.slug}`,
    image: post.featured_image || '',
    type: 'article',
    publishedTime: post.published_at ?? undefined,
    modifiedTime: post.updated_at ?? undefined,
  });
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(value));
  } catch {
    return null;
  }
}

export default async function InsightPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const published = formatDate(post.published_at);
  const updated = formatDate(post.updated_at);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: 'Insights', path: '/insights' },
              { name: post.title, path: `/insights/${params.slug}` },
            ]),
            articleJsonLd({
              title: post.title,
              description: post.excerpt || '',
              slug: params.slug,
              publishedTime: post.published_at ?? undefined,
              modifiedTime: post.updated_at ?? undefined,
              authorName: post.author || undefined,
              image: post.featured_image || undefined,
            }),
          ]),
        }}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/insights"
          className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
        >
          <ArrowLeft
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
          All insights
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-textMain sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-textMuted">
            {post.author && (
              <span>
                By {post.author}
                {post.author_role ? `, ${post.author_role}` : ''}
              </span>
            )}
            {published && (
              <time dateTime={post.published_at ?? undefined}>Published {published}</time>
            )}
            {updated && updated !== published && (
              <time dateTime={post.updated_at ?? undefined}>Updated {updated}</time>
            )}
          </div>
        </header>

        {post.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featured_image}
            alt={post.title}
            loading="eager"
            decoding="async"
            className="mt-8 w-full rounded-xl border border-border object-cover"
          />
        )}

        <div className="mt-10 space-y-5 text-base leading-relaxed text-textMuted">
          {(post.content ?? '')
            .split(/\n{2,}/)
            .map((b) => b.trim())
            .filter(Boolean)
            .map((block, i) =>
              block.startsWith('## ') ? (
                <h2 key={i} className="mt-10 text-xl font-semibold text-textMain">
                  {block.slice(3)}
                </h2>
              ) : (
                <p key={i}>{block}</p>
              )
            )}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-bgCard p-8 shadow-card">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-textMain">Discuss Your Project</h2>
            <p className="mt-1 text-sm text-textMuted">
              Working on something related to this article? We&apos;re happy to help.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-textMain shadow-glow-sm transition-all duration-200 hover:bg-primaryDark hover:shadow-glow active:translate-y-px motion-reduce:transition-none"
          >
            Start a Project
          </Link>
        </div>
      </article>
    </>
  );
}
