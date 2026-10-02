import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight, Clapperboard } from 'lucide-react';
import { createServerSupabase } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/SectionHeading';
import { JsonLd } from '@/components/JsonLd';
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from '@/lib/seo';

export const revalidate = 300;
export const metadata: Metadata = buildMetadata({
  title: 'Creator Resources',
  description: 'Practical YAIdigitals guides for creators building short-form video channels and digital content products.',
  path: '/creator-resources',
});

export default async function CreatorResourcesPage() {
  const { data } = await createServerSupabase()
    .from('blog_posts')
    .select('id, slug, title, excerpt')
    .eq('status', 'published')
    .in('slug', ['go-viral-short-videos', 'start-faceless-reels-channel'])
    .order('created_at', { ascending: false });

  return (
    <>
      <JsonLd data={[
        webPageJsonLd({ name: 'Creator Resources', description: 'Content and short-form video guides from YAIdigitals.', path: '/creator-resources', type: 'CollectionPage' }),
        breadcrumbJsonLd([{ name: 'Creator Resources', path: '/creator-resources' }]),
      ]} />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionHeading as="h1" eyebrow="Creator Resources" title="Practical Guides for Digital Creators" description="Creator-focused writing lives here, separate from our software engineering insights." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {(data ?? []).map((post) => (
            <Link key={post.id} href={`/insights/${post.slug}`} className="group rounded-xl border border-border bg-bgCard p-6 transition hover:border-primary/40">
              <Clapperboard size={22} className="text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-textMain">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-sm leading-relaxed text-textMuted">{post.excerpt}</p>}
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">Read guide <ArrowUpRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
