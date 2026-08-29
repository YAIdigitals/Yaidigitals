import Link from 'next/link';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';

export interface WorkCardProject {
  slug: string;
  title: string;
  industry?: string | null;
  category?: string | null;
  short_description?: string | null;
  cover_image?: string | null;
  services_provided?: string[] | null;
  technologies?: string[] | null;
  website_url?: string | null;
}

/**
 * Large case-study card used for featured work — image-led, with industry,
 * summary, services and (verified) technology chips.
 */
export function WorkCard({ project, priority = false }: { project: WorkCardProject; priority?: boolean }) {
  const services = project.services_provided ?? [];
  const tech = project.technologies ?? [];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate focus-visible:border-primary outline-none motion-reduce:transition-none"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-bgDark bg-grid-faint bg-grid">
        {project.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image}
            alt={`${project.title} — ${project.industry || 'project'}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/25 bg-primary/8 text-primary">
              <FolderGit2 size={28} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
        )}
        {project.industry && (
          <span className="absolute left-4 top-4 rounded-md border border-border bg-bgGlass px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-textMuted backdrop-blur-sm">
            {project.industry}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold leading-snug text-textMain">{project.title}</h3>
        {project.short_description && (
          <p className="mt-2 text-sm leading-relaxed text-textMuted">{project.short_description}</p>
        )}

        {services.length > 0 && (
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-textMuted">
            {services.slice(0, 3).join(' · ')}
          </p>
        )}

        {tech.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technology used">
            {tech.slice(0, 5).map((t) => (
              <li
                key={t}
                className="rounded-md border border-border bg-bgDark px-2 py-0.5 text-[11px] text-textMuted"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary group-hover:text-primaryDark">
          View Case Study
          <ArrowUpRight
            size={15}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          />
        </span>
      </div>
    </Link>
  );
}
