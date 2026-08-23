import { createServerSupabase } from '@/lib/supabase/server';
import ContactForm from '@/components/ContactForm';

export const revalidate = 0;

export const metadata = {
  title: 'Contact YAIdigitals | YAIdigitals',
  description: 'Get in touch with YAIdigitals to discuss your technology project needs. We specialize in website development, app development, AI automation, and digital products.',
};

export default async function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Contact YAIdigitals</h1>
      <p className="mb-6 text-textMuted">
        Have a project in mind? Let's discuss how we can help bring your vision to life.
        Fill out the form below and we'll get back to you shortly.
      </p>
      
      {/* Client-side form component */}
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}