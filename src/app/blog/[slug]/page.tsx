import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', params.slug).maybeSingle();
  if (!data) notFound();
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-textMain">{data.title}</h1>
      <p className="mt-6 text-textMuted whitespace-pre-line">{data.content}</p>
    </article>
  );
}