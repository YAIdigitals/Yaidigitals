import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { Reveal } from '@/components/motion/Reveal';

export const dynamicParams = true;

interface DbCourse {
  id: number;
  slug: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  instructor?: string | null;
  thumbnail?: string | null;
  banner?: string | null;
  regular_price?: number | null;
  discounted_price?: number | null;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
  duration?: string | null;
  num_lessons?: number | null;
  features?: unknown;
  requirements?: unknown;
  what_youll_learn?: unknown;
  published?: boolean;
  enrollment_status?: 'open' | 'closed' | 'coming_soon' | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

interface DbModule {
  id: number;
  title: string;
  description?: string | null;
  sort_order?: number | null;
}

async function getCourse(slug: string) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('courses').select('*').eq('slug', slug).maybeSingle();
  return (data ?? null) as DbCourse | null;
}

async function getModules(courseId: number) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('course_modules')
    .select('id, title, description, sort_order')
    .eq('course_id', courseId)
    .order('sort_order');
  return (data ?? []) as DbModule[];
}

function formatINR(value?: number | null) {
  return `₹${(value ?? 0).toLocaleString('en-IN')}`;
}

function list(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]).filter((v) => typeof v === 'string') : [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) {
    return { title: 'Course Not Found', robots: { index: false, follow: false } };
  }
  return buildMetadata({
    title: course.seo_title || course.title,
    absoluteTitle: Boolean(course.seo_title?.includes('YAIdigitals')),
    description: course.seo_description || course.short_description || undefined,
    path: `/courses/${course.slug}`,
    image: course.thumbnail || course.banner || '',
  });
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const modules = course.published && course.id ? await getModules(course.id) : [];

  const features = list(course.features);
  const requirements = list(course.requirements);
  const learn = list(course.what_youll_learn);
  const price =
    course.discounted_price && course.regular_price && course.discounted_price < course.regular_price
      ? course.discounted_price
      : course.regular_price;
  const hasDiscount = Boolean(
    course.discounted_price && course.regular_price && course.discounted_price < course.regular_price
  );

  const detail = [
    { label: 'Instructor', value: course.instructor },
    { label: 'Difficulty Level', value: course.difficulty_level },
    { label: 'Duration', value: course.duration },
    { label: 'Lessons', value: course.num_lessons != null ? String(course.num_lessons) : null },
  ].filter((d) => d.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Courses', path: '/courses' },
              { name: course.title, path: `/courses/${course.slug}` },
            ])
          ),
        }}
      />
      <section className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/courses"
          className="group inline-flex items-center gap-1.5 text-sm text-textMuted transition-colors hover:text-primary"
        >
          <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
          All courses
        </Link>

        <div className="mt-8">
          {course.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnail}
              alt={course.title}
              loading="eager"
              decoding="async"
              className="mb-6 aspect-video w-full rounded-xl border border-border object-cover"
            />
          )}
          <h1 className="text-3xl font-bold text-textMain">{course.title}</h1>
          {course.short_description && (
            <p className="mt-3 max-w-2xl leading-relaxed text-textMuted">{course.short_description}</p>
          )}
        </div>

        {course.full_description && (
          <Reveal>
            <div className="mt-10 space-y-4 leading-relaxed text-textMuted">
              {String(course.full_description)
                .split(/\n{2,}/)
                .map((block, i) =>
                  block.startsWith('## ') ? (
                    <h2 key={i} className="mt-8 text-xl font-semibold text-textMain">
                      {block.slice(3)}
                    </h2>
                  ) : (
                    <p key={i}>{block}</p>
                  )
                )}
            </div>
          </Reveal>
        )}

        {learn.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-textMain">What you&apos;ll learn</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {learn.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-bgCard p-4 text-sm text-textMuted"
                >
                  <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {modules.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-textMain">Curriculum</h2>
            <ol className="mt-4 space-y-3">
              {modules.map((m, i) => (
                <li key={m.id} className="rounded-xl border border-border bg-bgCard p-5">
                  <h3 className="font-semibold text-textMain">
                    {String(i + 1).padStart(2, '0')} — {m.title}
                  </h3>
                  {m.description && <p className="mt-1.5 text-sm leading-relaxed text-textMuted">{m.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}

        {features.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-textMain">Features</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-textMuted">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {requirements.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-textMain">Requirements</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-textMuted">
              {requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold text-textMain">Course details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {detail.map((d) => (
              <div key={d.label}>
                <h3 className="font-semibold text-textMain">{d.label}</h3>
                <p className="mt-1 text-sm capitalize text-textMuted">{d.value}</p>
              </div>
            ))}
            <div>
              <h3 className="font-semibold text-textMain">Price</h3>
              <p className="mt-1">
                {price != null ? (
                  <>
                    <span className="text-xl font-bold text-textMain">{formatINR(price)}</span>
                    {hasDiscount && (
                      <span className="ml-3 text-sm line-through text-textMuted">
                        {formatINR(course.regular_price)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-textMuted">Contact for pricing</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-textMain transition-colors hover:bg-primaryDark sm:w-auto"
          >
            {course.enrollment_status === 'open' ? 'Enroll Now' : 'Ask About This Course'}
          </Link>
          {course.enrollment_status === 'coming_soon' && (
            <p className="mt-3 text-sm text-accentYellow">Coming soon — contact us for early access.</p>
          )}
        </div>
      </section>
    </>
  );
}
