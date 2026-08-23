export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto max-w-6xl px-6 py-10">{children}</section>;
}
