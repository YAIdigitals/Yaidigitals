import { redirect } from 'next/navigation';

export async function POST(request: Request) {
  const formData = await request.formData();
  // Supabase auth cookie handling omitted for brevity; use server action form instead.
  redirect('/admin/login');
}
