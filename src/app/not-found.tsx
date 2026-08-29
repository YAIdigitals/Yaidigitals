import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  path: '',
  noindex: true,
});

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-28 text-center">
      <p className="eyebrow">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
        404 — Page not found
      </p>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-textMain sm:text-4xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-textMuted">
        The link may be outdated or the page may have moved. Here are a few useful places to go
        instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-textMain transition-colors hover:bg-primaryDark"
        >
          Back to homepage
        </Link>
        <Link
          href="/work"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
        >
          Explore our work
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-textMuted transition-colors hover:border-primary/40 hover:text-textMain"
        >
          Contact us
        </Link>
      </div>
    </section>
  );
}
