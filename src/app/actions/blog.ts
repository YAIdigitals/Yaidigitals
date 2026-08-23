import { createServerAdminSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('blog_posts').insert({
    title: String(formData.get('title')),
    slug: String(formData.get('slug')),
    content: String(formData.get('content')),
    excerpt: String(formData.get('excerpt') || ''),
    published_at: new Date().toISOString(),
    active: true,
  });
  revalidatePath('/blog');
  revalidatePath('/admin');
}

export async function deletePost(id: number) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('blog_posts').delete().eq('id', id);
  revalidatePath('/blog');
  revalidatePath('/admin');
}
