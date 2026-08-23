import { createServerSupabase } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function BlogPage() {
  const supabase = createServerSupabase();
  const { data: posts } = await supabase.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false });
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Blog</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {(posts ?? []).map((p: any) => (
          <a key={p.id} href={`/blog/${p.slug}`} className="group border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg">
            <h3 className="font-semibold text-lg text-textMain">{p.title}</h3>
            <p className="text-sm text-textMuted mt-2">{p.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  );
}