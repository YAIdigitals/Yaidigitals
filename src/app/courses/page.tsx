import { createServerSupabase } from '@/lib/supabase/server';
import { generateCourseMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const revalidate = 0;

export async function generateMetadata() {
  // This will be overridden by individual course pages that have specific data
  return {
    title: 'Courses | YAIdigitals',
    description: 'Learn in-demand skills with our expert-led courses. From beginner to advanced levels, we provide comprehensive training to help you succeed in the digital world.',
  };
}

export default async function CoursesPage() {
  const supabase = createServerSupabase();
  const { data: courses } = await supabase.from('courses').select('*').eq('published', true).order('created_at', { ascending: false });
   
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Our Courses</h1>
      <p className="mb-8 text-textMuted max-w-2xl">
        Learn in-demand skills with our expert-led courses. From beginner to advanced levels,
        we provide comprehensive training to help you succeed in the digital world.
      </p>
      
      {/* Featured courses */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-textMain">Featured Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.slice(0, 6).map((course) => (
            <div key={course.id} className="border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-textMain">{course.title}</h3>
                <p className="mt-2 text-sm text-textMuted line-clamp-2">{course.instructor}</p>
                <p className="mt-1 text-sm text-textMuted">
                  {course.difficulty_level} • {course.duration} • {course.num_lessons} lessons
                </p>
                <a href={`/courses/${course.slug}`} className="mt-3 inline-block bg-primary text-textMain px-4 py-2 rounded hover:bg-primaryDark/80">
                  View Course
                </a>
              </div>
            </div>
          ))}
        </div>
        {courses && courses.length > 6 && (
          <a href="/courses" className="mt-4 inline-block bg-primary text-textMain px-4 py-2 rounded hover:bg-primaryDark/80">
            View All Courses
          </a>
        )}
      </div>
      
      {/* All courses */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-textMain">All Courses</h2>
        <div className="space-y-4">
          {courses?.map((course) => (
            <div key={course.id} className="border-border rounded-lg p-4 hover:bg-bgCard/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-textMain">{course.title}</h3>
                  <p className="mt-1 text-sm text-textMuted">{course.instructor}</p>
                  <p className="mt-1 text-sm text-textMuted">
                    {course.difficulty_level} • {course.duration} • {course.num_lessons} lessons
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-primary text-textMain text-xs rounded">
                    {course.enrollment_status === 'open' ? 'Enroll Open' : 
                     course.enrollment_status === 'coming_soon' ? 'Coming Soon' : 
                     'Closed'}
                  </span>
                  <a href={`/courses/${course.slug}`} className="mt-2 inline-block bg-primary text-textMain px-3 py-1 rounded text-xs hover:bg-primaryDark/80">
                    Details
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