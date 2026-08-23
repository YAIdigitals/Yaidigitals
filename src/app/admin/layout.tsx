export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</section>;
}
