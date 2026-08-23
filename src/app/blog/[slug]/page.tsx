import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

async function getPost(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, content, published_at')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  return data as {
    title: string;
    excerpt: string | null;
    content: string | null;
    published_at: string | null;
  } | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
    },
  };
}

function formatDate(value?: string | null) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(value));
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const date = formatDate(post.published_at);
  // Content is stored as plain text; blank-line-separated blocks. Lines
  // starting with "## " render as subheadings.
  const blocks = (post.content ?? '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
      >
        <ArrowLeft
          size={15}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
        All articles
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-textMain sm:text-4xl">
          {post.title}
        </h1>
        {date && (
          <time dateTime={post.published_at ?? undefined} className="mt-3 block text-sm text-textMuted">
            Published {date}
          </time>
        )}
      </header>

      <div className="mt-10 space-y-5 text-base leading-relaxed text-textMuted">
        {blocks.map((block, i) =>
          block.startsWith('## ') ? (
            <h2 key={i} className="mt-10 text-xl font-semibold text-textMain">
              {block.slice(3)}
            </h2>
          ) : (
            <p key={i}>{block}</p>
          )
        )}
      </div>
    </article>
  );
}
