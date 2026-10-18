import { Metadata } from 'next';
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'RecallBox Privacy Policy | YAIdigitals',
  description: 'Official privacy policy for RecallBox personal offline memory vault by YAIdigitals.',
  path: '/recallbox/privacy-policy',
});

export default function RecallBoxPrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'RecallBox Privacy Policy',
            description: 'Official privacy policy for RecallBox personal offline memory vault.',
            path: '/recallbox/privacy-policy',
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'RecallBox Privacy Policy', path: '/recallbox/privacy-policy' },
          ]),
        ]}
      />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 border-b border-borderSubtle pb-6">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
            RecallBox Official Legal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-textMain sm:text-5xl">
            Privacy Policy for RecallBox
          </h1>
          <p className="mt-2 text-sm text-textMuted">
            <strong>Last Updated:</strong> October 2026 &bull; <strong>Application:</strong> RecallBox (<code>com.yaidigitals.recallbox</code>)
          </p>
        </div>

        <div className="space-y-8 text-textMuted leading-relaxed">
          <p className="text-lg text-textMain">
            RecallBox (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the app&rdquo;) is developed by <strong>YAIdigitals</strong> and is engineered from the ground up as a <strong>privacy-first, offline-first personal memory vault</strong>. Your trust is our primary asset. This Privacy Policy discloses our data practices, permissions, and architectural privacy boundaries.
          </p>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">1. Core Architecture: 100% On-Device by Default</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Local Storage:</strong> All saved links, handwritten notes, images, documents, collections, tags, and full-text search indices are stored exclusively within your device&apos;s private application sandbox.</li>
              <li><strong>Zero Remote Tracking:</strong> RecallBox does not operate remote user tracking servers, does not log your browsing habits, and does not record or analyze the contents of your memories.</li>
              <li><strong>No Mandatory Accounts:</strong> You are never required to create an account, log in with social providers, or provide personal identity information (such as name, email, or phone number) to use RecallBox.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">2. On-Device Machine Learning & Optical Character Recognition (OCR)</h2>
            <p className="mb-3">
              RecallBox uses Google ML Kit&apos;s on-device text recognition library to detect words inside saved images and screenshots.
            </p>
            <p>
              <strong>Processing Boundary:</strong> All OCR processing runs strictly on your device processor. Images, screenshots, and extracted text are <strong>never uploaded to cloud servers or third-party AI APIs</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">3. Data Collection and Sharing</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Data Collected:</strong> None. We do not collect personal information, usage metrics, device identifiers, or biometric profiles.</li>
              <li><strong>Data Shared:</strong> None. We do not sell, rent, monetize, or transmit your memories to data brokers, advertisers, or third parties.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-4 text-textMain">4. Permissions Disclosures</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-borderSubtle text-textMain">
                    <th className="py-2 pr-4 font-semibold">Permission</th>
                    <th className="py-2 pr-4 font-semibold">Technical Name</th>
                    <th className="py-2 font-semibold">Usage Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderSubtle/50">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-textMain">Internet Access</td>
                    <td className="py-3 pr-4 font-mono text-xs">android.permission.INTERNET</td>
                    <td className="py-3">Optional: Used solely to fetch web page titles and OpenGraph metadata when saving web URLs.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-textMain">Network State</td>
                    <td className="py-3 pr-4 font-mono text-xs">android.permission.ACCESS_NETWORK_STATE</td>
                    <td className="py-3">Used solely to detect offline status and prevent unnecessary network calls when Offline Vault Mode is active.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-textMain">Biometric Sensor</td>
                    <td className="py-3 pr-4 font-mono text-xs">androidx.biometric</td>
                    <td className="py-3">Used strictly on-device via the Android KeyStore / BiometricPrompt API to unlock your private vault. Biometric data never leaves the secure hardware enclave.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">5. Monetization & Play Billing Disclosures</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Ads:</strong> In the standard production release, advertising is disabled by default. If non-personalized ads are enabled in future updates, no tracking cookies or cross-app advertising identifiers will be shared.</li>
              <li><strong>Subscriptions:</strong> Optional digital upgrades are processed securely through the official <strong>Google Play In-App Billing API</strong>. RecallBox does not collect, handle, or store credit card numbers or financial account details.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">6. Backups, Export, and Data Deletion</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Data Ownership:</strong> You own 100% of your memories. You can export your entire database and attachments as an unencrypted or encrypted ZIP archive at any time.</li>
              <li><strong>Data Deletion:</strong> You can delete individual memories, collections, or erase your entire vault directly in the app via <strong>Settings &gt; Clear All Data</strong>. Uninstalling RecallBox completely purges the local database and private files from your device.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">7. Children&apos;s Privacy</h2>
            <p>
              RecallBox is rated for Everyone and does not knowingly collect or solicit personal information from children under the age of 13.
            </p>
          </div>

          <div className="rounded-xl border border-borderSubtle bg-surface/50 p-6">
            <h2 className="text-2xl font-bold mb-3 text-textMain">8. Contact & Legal Inquiries</h2>
            <p>
              If you have questions or feedback regarding this Privacy Policy, please reach out to:
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
