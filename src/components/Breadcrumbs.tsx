import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const trail: BreadcrumbItem[] = [{ name: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-textMuted">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((item, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {current || !item.href ? (
                <span aria-current={current ? 'page' : undefined} className="truncate text-textMain">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-primary">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
