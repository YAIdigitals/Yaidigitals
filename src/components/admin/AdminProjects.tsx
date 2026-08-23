'use client';

import { createClientSupabase } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';

type Project = {
  id: number;
  title: string;
  slug: string;
  client_business: string | null;
  category: string | null;
  technologies: string[] | null;
  description: string | null;
  problem: string | null;
  solution: string | null;
  screenshots: string[] | null;
  website_url: string | null;
  app_urls: string[] | null;
  featured: boolean;
  completion_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export default function AdminProjects() {
  const supabase = createClientSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [projectForm, setProjectForm] = useState({
    id: null as number | null,
    title: '',
    slug: '',
    client_business: '',
    category: '',
    technologies: '[]',
    description: '',
    problem: '',
    solution: '',
    screenshots: '[]',
    website_url: '',
    app_urls: '[]',
    featured: false,
    completion_date: '',
    seo_title: '',
    seo_description: '',
    loading: false
  });

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data ?? []);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectForm(prev => ({ ...prev, loading: true }));
    
    try {
      const projectData = {
        title: projectForm.title,
        slug: projectForm.slug,
        client_business: projectForm.client_business,
        category: projectForm.category,
        technologies: JSON.parse(projectForm.technologies),
        description: projectForm.description,
        problem: projectForm.problem,
        solution: projectForm.solution,
        screenshots: JSON.parse(projectForm.screenshots),
        website_url: projectForm.website_url,
        app_urls: JSON.parse(projectForm.app_urls),
        featured: projectForm.featured,
        completion_date: projectForm.completion_date || null,
        seo_title: projectForm.seo_title,
        seo_description: projectForm.seo_description
      };

      if (projectForm.id) {
        await supabase.from('projects').update(projectData).eq('id', projectForm.id);
      } else {
        await supabase.from('projects').insert(projectData);
      }
      
      // Reset form
      setProjectForm(prev => ({
        ...prev,
        id: null,
        title: '',
        slug: '',
        client_business: '',
        category: '',
        technologies: '[]',
        description: '',
        problem: '',
        solution: '',
        screenshots: '[]',
        website_url: '',
        app_urls: '[]',
        featured: false,
        completion_date: '',
        seo_title: '',
        seo_description: '',
        loading: false
      }));
      
      await loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please check the console for details.');
      setProjectForm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleProjectDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      await loadProjects();
    }
  };

  const handleProjectEdit = (project: Project) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      slug: project.slug,
      client_business: project.client_business || '',
      category: project.category || '',
      technologies: JSON.stringify(project.technologies || []),
      description: project.description || '',
      problem: project.problem || '',
      solution: project.solution || '',
      screenshots: JSON.stringify(project.screenshots || []),
      website_url: project.website_url || '',
      app_urls: JSON.stringify(project.app_urls || []),
      featured: project.featured,
      completion_date: project.completion_date || '',
      seo_title: project.seo_title || '',
      seo_description: project.seo_description || '',
      loading: false
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-border bg-bgCard rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add/Edit Project</h2>
        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                value={projectForm.slug}
                onChange={(e) => setProjectForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client/Business</label>
              <input
                type="text"
                value={projectForm.client_business}
                onChange={(e) => setProjectForm(prev => ({ ...prev, client_business: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={projectForm.category}
                onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Technologies (JSON array)</label>
            <textarea
              value={projectForm.technologies}
              onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
              className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              rows={3}
              placeholder='["React", "Node.js", "PostgreSQL"]'
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Problem</label>
              <textarea
                value={projectForm.problem}
                onChange={(e) => setProjectForm(prev => ({ ...prev, problem: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Solution</label>
              <textarea
                value={projectForm.solution}
                onChange={(e) => setProjectForm(prev => ({ ...prev, solution: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Screenshots (JSON array of URLs)</label>
              <textarea
                value={projectForm.screenshots}
                onChange={(e) => setProjectForm(prev => ({ ...prev, screenshots: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
                placeholder='["https://example.com/screen1.jpg", "https://example.com/screen2.jpg"]'
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input
                type="text"
                value={projectForm.website_url}
                onChange={(e) => setProjectForm(prev => ({ ...prev, website_url: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">App URLs (JSON array)</label>
              <textarea
                value={projectForm.app_urls}
                onChange={(e) => setProjectForm(prev => ({ ...prev, app_urls: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
                rows={3}
                placeholder='["https://apps.apple.com/app/id123", "https://play.google.com/store/apps/details?id=com.example"]'
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Completion Date</label>
              <input
                type="date"
                value={projectForm.completion_date}
                onChange={(e) => setProjectForm(prev => ({ ...prev, completion_date: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input
                type="text"
                value={projectForm.seo_title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, seo_title: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Description</label>
              <input
                type="text"
                value={projectForm.seo_description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, seo_description: e.target.value }))}
                className="w-full border-border bg-bgCard text-textMain rounded px-3 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <label className="block text-sm font-medium mb-1 mr-4">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4"
              />
              Featured Project
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={projectForm.loading}
              className={`bg-primary text-textMain px-4 py-2 rounded ${
                projectForm.loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primaryDark/80'
              }`}
            >
              {projectForm.loading ? 'Saving...' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={() => {
                setProjectForm(prev => ({
                  ...prev,
                  id: null,
                  title: '',
                  slug: '',
                  client_business: '',
                  category: '',
                  technologies: '[]',
                  description: '',
                  problem: '',
                  solution: '',
                  screenshots: '[]',
                  website_url: '',
                  app_urls: '[]',
                  featured: false,
                  completion_date: '',
                  seo_title: '',
                  seo_description: '',
                  loading: false
                }));
              }}
              className="ml-4 border border-border bg-bgCard text-textMuted px-4 py-2 rounded hover:border-primary hover:text-textMain"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
      
      <div className="border-border bg-bgCard rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Projects List</h2>
        {projects.length === 0 ? (
          <p className="text-center py-8 text-textMuted">No projects found. Add a project above.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border-border bg-bgCard rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-textMuted">{project.slug}</p>
                  {project.client_business && (
                    <p className="text-sm text-textMuted mt-1">{project.client_business}</p>
                  )}
                  {project.category && (
                    <p className="text-sm text-textMuted mt-1">{project.category}</p>
                  )}
                  {project.completion_date && (
                    <p className="text-sm text-textMuted mt-1">Completed: {project.completion_date}</p>
                  )}
                  {project.description && (
                    <p className="text-sm text-textMuted mt-1">{project.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleProjectEdit(project)}
                    className="bg-primary text-textMain px-3 py-1 rounded text-sm hover:bg-primaryDark/80"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleProjectDelete(project.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}