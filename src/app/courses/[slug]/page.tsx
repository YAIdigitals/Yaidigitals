import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { generateCourseMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data: course } = await supabase.from('courses').select('*').eq('slug', params.slug).maybeSingle();
   
  if (!course) {
    // Return fallback metadata if course not found
    return {
      title: 'Course Not Found | YAIdigitals',
      description: 'The requested course could not be found.',
    };
  }
  
  return generateCourseMetadata(course);
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data: course } = await supabase.from('courses').select('*').eq('slug', params.slug).maybeSingle();
   
  if (!course) notFound();
  
  const { 
    id, 
    title, 
    thumbnail, 
    short_description, 
    full_content, 
    instructor, 
    difficulty_level, 
    duration, 
    num_lessons, 
    regular_price, 
    discounted_price, 
    enrollment_status, 
    features, 
    curriculum 
  } = course;
  
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        {thumbnail && (
          <div className="mb-4">
            <img
              src={thumbnail}
              alt={title}
              className="aspect-w-16 aspect-h-9 rounded-lg mb-4 object-cover w-full"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-textMain">{title}</h1>
        {short_description && (
          <p className="mt-2 text-textMuted">{short_description}</p>
        )}
      </div>
      
      {full_content && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Course Overview</h2>
          <div className="prose prose-sm max-w-none">{full_content}</div>
        </div>
      )}
      
      {features && features.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-textMuted">
            {(features as string[]).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {curriculum && curriculum.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Curriculum</h2>
          <div className="space-y-4">
            {curriculum.map((module: { title: string; description?: string; lessons?: { title: string; description?: string }[] }, moduleIndex: number) => (
              <div key={moduleIndex} className="mb-6">
                <h3 className="text-xl font-semibold text-textMain mb-2">{module.title}</h3>
                {module.description && (
                  <p className="mb-2 text-textMuted">{module.description}</p>
                )}
                {module.lessons && module.lessons.length > 0 && (
                  <ol className="list-decimal list-inside space-y-1 pl-5 text-textMuted">
                    {module.lessons.map((lesson: { title: string; description?: string }, lessonIndex: number) => (
                      <li key={`${moduleIndex}-${lessonIndex}`}>
                        {lesson.title}
                        {lesson.description && (
                          <p className="mt-1 text-textMuted text-sm">{lesson.description}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-textMain">Course Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-textMain">Instructor</h3>
            <p className="text-textMuted">{instructor}</p>
          </div>
          <div>
            <h3 className="font-semibold text-textMain">Difficulty Level</h3>
            <p className="text-textMuted">{difficulty_level}</p>
          </div>
          <div>
            <h3 className="font-semibold text-textMain">Duration</h3>
            <p className="text-textMuted">{duration}</p>
          </div>
          <div>
            <h3 className="font-semibold text-textMain">Lessons</h3>
            <p className="text-textMuted">{num_lessons}</p>
          </div>
          <div className="flex items-baseline">
            <div>
              <h3 className="font-semibold text-textMain">Price</h3>
            </div>
            <div className="ml-4">
              {discounted_price && regular_price && discounted_price < regular_price ? (
                <>
                  <span className="text-xl font-bold text-textMain">
                    ₹{discounted_price}
                  </span>
                  <span className="ml-3 text-sm line-through text-textMuted">
                    ₹{regular_price}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-textMain">
                  ₹{regular_price}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {enrollment_status === 'open' && (
        <div className="mb-6">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded text-xs">
            Enrollment Open
          </span>
        </div>
      )}
      
      {enrollment_status === 'closed' && (
        <div className="mb-6">
          <span className="px-3 py-1 bg-textMuted/20 text-textMuted rounded text-xs">
            Enrollment Closed
          </span>
        </div>
      )}
      
      {enrollment_status === 'coming_soon' && (
        <div className="mb-6">
          <span className="px-3 py-1 bg-accentYellow/20 text-accentYellow rounded text-xs">
            Coming Soon
          </span>
        </div>
      )}
      
      <div className="mt-8">
        {enrollment_status === 'open' && (
          <a href={`/enroll/${id}`} className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 transition w-full">
            Enroll Now
          </a>
        )}
        {enrollment_status !== 'open' && (
          <a href="/contact" className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 transition w-full">
            Start a Project
          </a>
        )}
      </div>
    </section>
  );
}