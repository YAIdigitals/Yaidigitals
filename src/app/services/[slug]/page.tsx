import { createServerSupabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { generateServiceMetadata } from '@/lib/seo';
import { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createServerSupabase();
  const { data: service } = await supabase.from('services').select('*').eq('slug', params.slug).maybeSingle();
   
  if (!service) {
    // Return fallback metadata if service not found
    return {
      title: 'Service Not Found | YAIdigitals',
      description: 'The requested service could not be found.',
    };
  }
  
  return generateServiceMetadata(service);
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabase();
  const { data } = await supabase.from('services').select('*').eq('slug', params.slug).maybeSingle();
   
  if (!data) notFound();
  
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        {data.icon && (
          <div className="mb-4">
            {typeof data.icon === 'string' && data.icon.startsWith('http') ? (
              <img src={data.icon} alt={data.title} className="h-12 w-12" />
            ) : (
              <div className="h-12 w-12 flex items-center justify-center bg-bgCard rounded-full">
                <span className="text-2xl text-textMain">{data.icon.substring(0, 1).toUpperCase()}</span>
              </div>
            )}
          </div>
        )}
        <h1 className="text-3xl font-bold text-textMain">{data.title}</h1>
        {data.short_description && (
          <p className="mt-2 text-textMuted">{data.short_description}</p>
        )}
      </div>
      
      {data.full_content && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Service Details</h2>
          <div className="prose prose-sm max-w-none">{data.full_content}</div>
        </div>
      )}
      
      {data.features && data.features.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            {(data.features as string[]).map((feature, index) => (
              <li key={index} className="text-textMuted">{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {data.pricing_info && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-textMain">Pricing</h2>
          <div className="bg-bgCard rounded-lg p-6">
            {/* This would display pricing info based on the JSON structure */}
            <p className="text-textMuted">
              Pricing for this service is tailored to your specific project requirements.
              Please contact us for a detailed quote.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <a href="/contact" className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 transition">
          Start a Project
        </a>
      </div>
    </section>
  );
}