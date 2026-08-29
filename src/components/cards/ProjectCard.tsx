import Link from 'next/link';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import type { ProjectRecord } from '@/lib/types';

/**
 * Case-study card. Fixed aspect media box prevents layout shift;
 * imagery lazy-loads.
 */
export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate hover:-translate-y-1 focus-visible:border-primary outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-bgDark bg-grid-faint bg-grid">
        {project.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/8 text-primary">
              <FolderGit2 size={24} strokeWidth={1.5} />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {(project.tags ?? []).length > 0 && (
          <p className="eyebrow mb-2 text-[10px]">{(project.tags as string[])[0]}</p>
        )}
        <h3 className="font-semibold leading-snug text-textMain">{project.title}</h3>
        {project.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">{project.short_description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm text-primary group-hover:text-primaryDark">
          View case study
          <ArrowUpRight
            size={14}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
