import Link from 'next/link';
import { FileText, Eye, Download, ArrowRight } from 'lucide-react';

type ResourceCardData = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  cover_image?: string | null;
  featured?: boolean;
  view_count?: number;
  download_count?: number;
  category?: { id?: number; name: string; slug: string } | null;
};

interface ResourceCardProps {
  resource: ResourceCardData;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-bgCard transition-all duration-300 hover:border-primary/40 hover:shadow-elevate"
    >
      {/* Cover image */}
      {resource.cover_image ? (
        <div className="relative aspect-video overflow-hidden bg-bgDark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.cover_image}
            alt={resource.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {resource.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-accentYellow px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bgDark">
              Featured
            </span>
          )}
        </div>
      ) : (
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-bgDark to-bgCard">
          <FileText size={40} className="text-primary/30" />
          {resource.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-accentYellow px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-bgDark">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {resource.category && (
          <span className="eyebrow mb-2 text-[11px]">{resource.category.name}</span>
        )}

        <h3 className="font-semibold leading-snug text-textMain transition-colors group-hover:text-primary">
          {resource.title}
        </h3>

        {resource.summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-textMuted">
            {resource.summary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3 text-xs text-textMuted">
            {resource.view_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye size={11} /> {resource.view_count}
              </span>
            )}
            {resource.download_count > 0 && (
              <span className="flex items-center gap-1">
                <Download size={11} /> {resource.download_count}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
