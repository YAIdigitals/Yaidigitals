import { createServerAdminSupabase } from '@/lib/supabase/server';

export async function seed() {
  const supabase = createServerAdminSupabase();
  await supabase.from('products').upsert([
    { title: 'Stickman Bundle', slug: 'stickman-bundle', price: 99, active: true, sort_order: 1, cover_image: '', description: 'Viral stickman short edits.' },
    { title: 'Hulk Bundle', slug: 'hulk-bundle', price: 149, active: true, sort_order: 2, cover_image: '', description: 'Hulk cinematic edits.' },
    { title: '3D Shorts Pack', slug: '3d-shorts', price: 199, active: true, sort_order: 3, cover_image: '', description: 'Satisfying 3D looping shorts.' },
    { title: 'Movie Explains', slug: 'movie-explains', price: 129, active: true, sort_order: 4, cover_image: '', description: 'Hook-style movie explain reels.' },
  ]);
  console.log('Done');
}
