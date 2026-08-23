import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerSupabase();
  const { data: services } = await supabase.from('services').select('*').eq('active', true).eq('featured', true).limit(3);
  const { data: courses } = await supabase.from('courses').select('*').eq('published', true).eq('featured', true).limit(3);
  const { data: projects } = await supabase.from('projects').select('*').eq('featured', true).limit(3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-textMain">
          We Build Digital Products That Move Businesses Forward
        </h1>
        <p className="mt-4 text-textMuted max-w-2xl mx-auto">
          Technology solutions for the modern business landscape
        </p>
      </div>
      
      {/* Services Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-textMain">Our Services</h2>
        <p className="text-textMuted max-w-xl mx-auto mb-8">
          Comprehensive technology solutions tailored to your business needs
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg"
            >
              {service.icon && (
                <div className="mb-4 h-12 w-12 flex items-center justify-center bg-bgCard rounded-full">
                  {typeof service.icon === 'string' && service.icon.startsWith('http') ? (
                    <img src={service.icon} alt={service.title} className="h-8 w-8" />
                  ) : (
                    <span className="text-2xl text-textMain">{service.icon.substring(0, 1).toUpperCase()}</span>
                  )}
                </div>
              )}
              <h3 className="mb-2 font-semibold text-lg text-textMain">{service.title}</h3>
              <p className="mb-4 text-textMuted line-clamp-3">{service.short_description}</p>
              <span className="text-xs text-primary">Learn More →</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Courses Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-textMain">Featured Courses</h2>
        <p className="text-textMuted max-w-xl mx-auto mb-8">
          Learn in-demand skills with our expert-led training programs
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(courses ?? []).map((course) => {
            const difficultyClass = course.difficulty_level === 'beginner' ? 'bg-primary/20 text-primary' :
                                course.difficulty_level === 'intermediate' ? 'bg-accentYellow/20 text-accentYellow' :
                                'bg-primary/20 text-primary';
            return (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="group border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg"
              >
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="aspect-w-16 aspect-h-9 rounded-lg mb-4 object-cover w-full"
                  />
                )}
                <h3 className="mb-2 font-semibold text-lg text-textMain">{course.title}</h3>
                <p className="mb-2 text-textMuted line-clamp-2">{course.short_description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {course.difficulty_level && (
                    <span className={`px-2 py-0.5 rounded text-xs ${difficultyClass}`}>
                      {course.difficulty_level}
                    </span>
                  )}
                  {course.duration && (
                    <span className="px-2 py-0.5 rounded text-xs bg-bgCard/20 text-textMuted">
                      {course.duration}
                    </span>
                  )}
                </div>
                {course.enrollment_status === 'open' && (
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded text-xs">
                      Enrollment Open
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-baseline">
                  <span className="text-xl font-semibold text-textMain">
                    ₹{course.discounted_price || course.regular_price}
                  </span>
                  {course.regular_price && course.discounted_price && course.regular_price > course.discounted_price && (
                    <span className="ml-3 text-sm line-through text-textMuted">
                      ₹{course.regular_price}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Projects Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-textMain">Our Work</h2>
        <p className="text-textMuted max-w-xl mx-auto mb-8">
          Successful projects we've delivered for clients across industries
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(projects ?? []).map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg"
            >
              {project.screenshots && project.screenshots.length > 0 && (
                <img
                  src={project.screenshots[0]}
                  alt={project.title}
                  className="aspect-w-16 aspect-h-9 rounded-lg mb-4 object-cover w-full"
                />
              )}
              <h3 className="mb-2 font-semibold text-lg text-textMain">{project.title}</h3>
              {project.client_business && (
                <p className="mb-2 text-sm text-textMuted">{project.client_business}</p>
              )}
              {project.category && (
                <span className="px-2 py-0.5 rounded text-xs bg-bgCard/20 text-textMuted">
                  {project.category}
                </span>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {project.technologies && (
                  (project.technologies as string[]).slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                      {tech}
                    </span>
                  ))
                )}
              </div>
              {project.completion_date && (
                <p className="mt-2 text-sm text-textMuted">Completed: {project.completion_date}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="text-center py-12 bg-bgCard rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-textMain">Ready to Start Your Project?</h2>
        <p className="text-textMuted mb-8 max-w-2xl mx-auto">
          Let's discuss how we can help you achieve your digital goals.
        </p>
        <Link
          href="/contact"
          className="bg-primary text-textMain px-8 py-4 rounded-lg hover:bg-primaryDark/80 transition inline-block"
        >
          Start a Project
        </Link>
      </div>
    </section>
  );
}