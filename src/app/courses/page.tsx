import { createServerSupabase } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { CourseCard } from '@/components/cards/CourseCard';
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup';
import { SectionHeading } from '@/components/SectionHeading';
import type { CourseRecord } from '@/lib/types';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Courses — Practical Tech & Content Skills',
  description:
    'Learn in-demand skills with YAIdigitals courses — short-form content, editing and AI automation training for beginners through advanced levels.',
  alternates: { canonical: '/courses' },
};

export default async function CoursesPage() {
  const supabase = createServerSupabase();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  const all = (courses ?? []) as unknown as CourseRecord[];
  const featured = all.filter((c) => c.featured);
  const rest = all.filter((c) => !c.featured);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        as="h1"
        eyebrow="Courses"
        title="Practical courses, taught by practitioners"
        description="Short-form content, editing and AI automation skills from the team that builds and ships this work every day."
      />

      {all.length === 0 ? (
        <div className="mt-16 rounded-xl border border-border bg-bgCard p-10 text-center">
          <h2 className="font-semibold text-textMain">No courses published yet</h2>
          <p className="mt-2 text-sm text-textMuted">
            We&apos;re preparing new material. Check back soon or subscribe via our blog for updates.
          </p>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-5 text-xl font-bold text-textMain">Featured courses</h2>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((course) => (
                  <StaggerItem key={course.id} className="h-full">
                    <CourseCard course={course} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}

          {rest.length > 0 && (
            <div className={featured.length > 0 ? 'mt-14 border-t border-border pt-12' : 'mt-12'}>
              <h2 className={`mb-5 text-xl font-bold text-textMain ${featured.length > 0 ? '' : 'sr-only'}`}>
                All courses
              </h2>
              <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((course) => (
                  <StaggerItem key={course.id} className="h-full">
                    <CourseCard course={course} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          )}
        </>
      )}
    </section>
  );
}
