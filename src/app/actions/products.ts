import { revalidatePath } from 'next/cache';
import { createServerAdminSupabase } from '@/lib/supabase/server';

export async function createProduct(formData: FormData) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('products').insert({
    title: String(formData.get('title')),
    slug: String(formData.get('slug')),
    price: Number(formData.get('price')),
    description: String(formData.get('description') || ''),
    active: true,
    sort_order: 0,
  });
  revalidatePath('/store');
  revalidatePath('/');
}

export async function updateProduct(id: number, formData: FormData) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('products').update({
    title: String(formData.get('title')),
    slug: String(formData.get('slug')),
    price: Number(formData.get('price')),
    description: String(formData.get('description') || ''),
  }).eq('id', id);
  revalidatePath('/store');
}

export async function deleteProduct(id: number) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/store');
}
