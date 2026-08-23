import { createServerSupabase } from '@/lib/supabase/server';
import { generateProjectMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const revalidate = 0;

export async function generateMetadata() {
  // This will be overridden by individual project pages that have specific data
  return {
    title: 'Projects | YAIdigitals',
    description: 'Explore our portfolio of successful projects across website development, app development, AI automation, and more.',
  };
}

export default async function ProjectsPage() {
  const supabase = createServerSupabase();
  const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Our Work</h1>
      <p className="mb-8 text-textMuted max-w-2xl">
        We've helped businesses of all sizes achieve their digital goals through innovative technology solutions.
        Explore our portfolio of successful projects across various industries.
      </p>
      
      {/* Featured projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-textMain">Featured Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.slice(0, 6).map((project) => (
            <div key={project.id} className="border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-textMain">{project.title}</h3>
                <p className="mt-2 text-sm text-textMuted line-clamp-2">{project.client || 'Client'}</p>
                <p className="mt-1 text-sm text-textMuted">
                  {project.category} • {project.completion_date?.slice(0, 4) || '2024'}
                </p>
                <a href={`/projects/${project.slug}`} className="mt-3 inline-block bg-primary text-textMain px-4 py-2 rounded hover:bg-primaryDark/80">
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
        {projects && projects.length > 6 && (
          <a href="/projects" className="mt-4 inline-block bg-primary text-textMain px-4 py-2 rounded hover:bg-primaryDark/80">
            View All Projects
          </a>
        )}
      </div>
      
      {/* All projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-textMain">All Projects</h2>
        <div className="space-y-4">
          {projects?.map((project) => (
            <div key={project.id} className="border-border rounded-lg p-4 hover:bg-bgCard/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-textMain">{project.title}</h3>
                  <p className="mt-1 text-sm text-textMuted>{project.client || 'Client'}</p>
                  <p className="mt-1 text-sm text-textMuted>
                    {project.category} • {project.completion_date?.slice(0, 4) || '2024'}
                  </p>
                </div>
                <div className="text-right">
                  <a href={`/projects/${project.slug}`} className="inline-block bg-primary text-textMain px-3 py-1 rounded text-xs hover:bg-primaryDark/80">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}