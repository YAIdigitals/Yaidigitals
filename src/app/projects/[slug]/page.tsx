import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { generateProjectMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data: project } = await supabase.from('projects').select('*').eq('slug', params.slug).maybeSingle();
  
  if (!project) {
    return {
      title: 'Project Not Found | YAIdigitals',
      description: 'The requested project could not be found.',
    };
  }
  
  return generateProjectMetadata(project);
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data: project } = await supabase.from('projects').select('*').eq('slug', params.slug).maybeSingle();
  
  if (!project) notFound();
  
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      {/* Project content */}
    </section>
  );
}
