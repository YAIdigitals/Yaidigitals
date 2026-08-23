import { createServerAdminSupabase } from '@/lib/supabase/server';

export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  cover_image: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export async function getAdminProducts() {
  const supabase = createServerAdminSupabase();
  const { data } = await supabase.from('products').select('*').order('sort_order');
  return (data ?? []) as Product[];
}

export async function getAdminBundles() {
  const supabase = createServerAdminSupabase();
  const { data } = await supabase.from('bundles').select('*').order('sort_order');
  return data ?? [];
}

export async function getAdminPosts() {
  const supabase = createServerAdminSupabase();
  const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
  return data ?? [];
}
