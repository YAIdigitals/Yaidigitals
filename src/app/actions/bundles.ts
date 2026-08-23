import { createServerAdminSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBundle(formData: FormData) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('bundles').insert({
    name: String(formData.get('name')),
    slug: String(formData.get('slug')),
    price: Number(formData.get('price')),
    description: String(formData.get('description') || ''),
    active: true,
    sort_order: 0,
  });
  revalidatePath('/admin');
}

export async function deleteBundle(id: number) {
  'use server';
  const supabase = createServerAdminSupabase();
  await supabase.from('bundles').delete().eq('id', id);
  revalidatePath('/admin');
}
