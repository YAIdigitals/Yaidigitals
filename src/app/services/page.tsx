import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function ServicesPage() {
  const supabase = createServerSupabase();
  const { data: services } = await supabase.from('services').select('*').order('title');

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Our Services</h1>
      <p className="mb-12 text-textMuted max-w-3xl mx-auto">
        We offer comprehensive technology solutions tailored to your business needs. Our services span the full lifecycle of digital product development.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(services ?? []).map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="group border-border rounded-lg p-6 hover:border-primary transition-shadow hover:shadow-lg"
          >
            {service.icon && (
              <div className="mb-4 h-12 w-12 flex items-center justify-center bg-bgCard rounded-full">
                {typeof service.icon === 'string' && service.icon.startsWith('http') ? (
                  <img src={service.icon} alt={service.title} className="h-8 w-8" />
                ) : (
                  <span className="text-2xl text-textMain">{service.icon.substring(0, 1).toUpperCase()}</span>
                )}
              </div>
            )}
            <h3 className="mb-2 font-semibold text-lg text-textMain">{service.title}</h3>
            <p className="mb-4 text-textMuted line-clamp-3">{service.short_description}</p>
            <span className="text-xs text-primary">Learn More →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}