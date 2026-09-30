import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { articleJsonLd, buildMetadata, breadcrumbJsonLd, metaDescription, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const dynamicParams = true;
export const revalidate = 300;

interface PostRecord {
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author: string | null;
  author_role: string | null;
  published_at: string | null;
  updated_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

async function getPost(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, featured_image, author, author_role, published_at, updated_at, seo_title, seo_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as PostRecord | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Article Not Found' };

  return buildMetadata({
    title: post.seo_title || post.title,
    description: metaDescription(post.seo_description, post.excerpt, post.content),
    absoluteTitle: Boolean(post.seo_title?.includes('YAIdigitals')),
    path: `/insights/${slug}`,
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

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const published = formatDate(post.published_at);
  const updated = formatDate(post.updated_at);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: post.title,
            description: post.excerpt || undefined,
            path: `/insights/${slug}`,
          }),
          breadcrumbJsonLd([
            { name: 'Insights', path: '/insights' },
            { name: post.title, path: `/insights/${slug}` },
          ]),
          articleJsonLd({
            title: post.title,
            description: post.excerpt || '',
            slug,
            publishedTime: post.published_at ?? undefined,
            modifiedTime: post.updated_at ?? undefined,
            authorName: post.author || undefined,
            image: post.featured_image || undefined,
          }),
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Breadcrumbs
          items={[
            { name: 'Insights', href: '/insights' },
            { name: post.title },
          ]}
        />

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
            className="mt-8 aspect-[16/9] w-full rounded-xl border border-border object-cover"
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
          <Link
            href="/services"
            className="w-full text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Explore our website, app, software and AI services
          </Link>
        </div>
      </article>
    </>
  );
}
