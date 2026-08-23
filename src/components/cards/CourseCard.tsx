import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, GraduationCap } from 'lucide-react';
import type { CourseRecord } from '@/lib/types';

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  open: { label: 'Enrollment open', className: 'border-primary/40 bg-primary/10 text-primary' },
  coming_soon: { label: 'Coming soon', className: 'border-border bg-bgDark text-textMuted' },
  closed: { label: 'Enrollment closed', className: 'border-border bg-bgDark text-textMuted' },
};

function formatINR(value?: number | null) {
  return `₹${(value ?? 0).toLocaleString('en-IN')}`;
}

/**
 * Course card — shows only factual metadata (level, duration, lesson count).
 * No invented ratings or student counts.
 */
export function CourseCard({ course }: { course: CourseRecord }) {
  const price = course.discounted_price ?? course.regular_price ?? null;
  const hasDiscount =
    price !== null &&
    typeof course.discounted_price === 'number' &&
    typeof course.regular_price === 'number' &&
    course.discounted_price < course.regular_price;
  const status = course.enrollment_status ? STATUS_BADGES[course.enrollment_status] : undefined;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate hover:-translate-y-1 focus-visible:border-primary outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-bgDark bg-grid-faint bg-grid">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/8 text-primary">
              <GraduationCap size={24} strokeWidth={1.5} />
            </span>
          </div>
        )}
        {course.difficulty_level && (
          <span className="absolute left-3 top-3 rounded-md border border-border bg-bgGlass px-2 py-0.5 text-[11px] font-medium text-textMuted backdrop-blur-sm">
            {LEVEL_LABELS[course.difficulty_level] ?? course.difficulty_level}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {course.instructor && (
          <p className="mb-2 text-xs text-textMuted">Taught by {course.instructor}</p>
        )}
        <h3 className="font-semibold leading-snug text-textMain">{course.title}</h3>
        {course.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">{course.short_description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-textMuted">
          {typeof course.num_lessons === 'number' && course.num_lessons > 0 && (
            <span className="inline-flex items-center gap-1">
              <BookOpen size={12} strokeWidth={2} aria-hidden="true" />
              {course.num_lessons} lessons
            </span>
          )}
          {course.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock size={12} strokeWidth={2} aria-hidden="true" />
              {course.duration}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="flex items-baseline gap-2">
            {price !== null && (
              <span className="text-lg font-semibold text-textMain">{formatINR(price)}</span>
            )}
            {hasDiscount && (
              <span className="text-sm line-through text-textMuted">{formatINR(course.regular_price)}</span>
            )}
          </span>
          {status && (
            <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.className}`}>
              {status.label}
            </span>
          )}
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary group-hover:text-primaryDark">
          Course details
          <ArrowRight
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          />
        </span>
      </div>
    </Link>
  );
}
