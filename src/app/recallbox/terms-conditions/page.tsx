import { Metadata } from 'next';
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'RecallBox Terms and Conditions | YAIdigitals',
  description: 'Official Terms of Service and Conditions for RecallBox by YAIdigitals.',
  path: '/recallbox/terms-conditions',
});

export default function RecallBoxTermsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'RecallBox Terms and Conditions',
            description: 'Official terms of service for RecallBox by YAIdigitals.',
            path: '/recallbox/terms-conditions',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'RecallBox Terms', path: '/recallbox/terms-conditions' },
          ]),
        ]}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 border-b border-borderSubtle pb-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            RecallBox Official Legal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-textMain sm:text-5xl">
            Terms and Conditions for RecallBox
          </h1>
          <p className="mt-2 text-sm text-textMuted">
            <strong>Last Updated:</strong> October 2026 &bull; <strong>Application:</strong> RecallBox (<code>com.yaidigitals.recallbox</code>)
          </p>
        </div>

        <div className="space-y-8 text-textMuted leading-relaxed">
          <p className="text-lg text-textMain">
            Please read these Terms and Conditions (&ldquo;Terms&rdquo;) carefully before using the <strong>RecallBox</strong> mobile application developed by <strong>YAIdigitals</strong>.
          </p>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">1. Acceptance of Terms</h2>
            <p>
              By installing, accessing, or using RecallBox, you agree to be bound by these Terms. If you do not agree, do not download, install, or use the application.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">2. License Grant</h2>
            <p>
              YAIdigitals grants you a personal, worldwide, royalty-free, non-assignable, and non-exclusive license to use the RecallBox application on your compatible Android devices in accordance with Google Play Store Terms of Service.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">3. User Responsibilities & Content Ownership</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Your Content:</strong> You retain full ownership and intellectual property rights to all notes, images, documents, URLs, and screenshots you save in RecallBox.</li>
              <li><strong>Lawful Use:</strong> You agree not to use RecallBox for any unlawful purpose or to store content that infringes upon the rights of others.</li>
              <li><strong>Local Storage Responsibility:</strong> Because RecallBox is an offline-first application that does not sync to a central company cloud server, <strong>you are solely responsible for creating regular backups</strong> of your memories using the in-app Portable ZIP Backup feature.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">4. In-App Purchases & Subscriptions</h2>
            <p>
              Optional digital subscriptions and purchases are billed through Google Play in accordance with Google Play&apos;s Terms of Service. Subscriptions automatically renew unless cancelled through your Google Play Store account subscriptions page at least 24 hours prior to the end of the billing period.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">5. Disclaimer of Warranties & Limitation of Liability</h2>
            <p className="mb-3">
              RecallBox is provided on an <strong>&ldquo;AS IS&rdquo;</strong> and <strong>&ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, either express or implied.
            </p>
            <p>
              To the maximum extent permitted by applicable law, YAIdigitals shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data or memories, resulting from your use of or inability to use the application.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">6. Contact & Inquiries</h2>
            <p>
              For legal questions regarding RecallBox Terms and Conditions, please contact:
            </p>
            <p className="mt-2 text-textMain font-medium">
              <strong>YAIdigitals</strong><br />
              Email: <a href="mailto:yaidigitals22@gmail.com" className="text-primary underline">yaidigitals22@gmail.com</a><br />
              Website: <a href="https://yaidigitals.co.in" className="text-primary underline">https://yaidigitals.co.in</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
