import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How YAIdigitals collects, uses, and protects your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Privacy Policy</h1>
      <div className="space-y-6 text-textMuted">
        <p>
          YAIdigitals (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
          information we collect when you use yaidigitals.co.in and how we handle it.
        </p>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Contact details you submit through our contact form (name, email, phone, company, project description).</li>
            <li>Account credentials if you register for an admin account (handled by our authentication provider).</li>
            <li>Basic usage data such as pages visited, collected anonymously.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">How We Use Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To respond to your inquiries and project requests.</li>
            <li>To provide and improve our services and digital products.</li>
            <li>To process orders and deliver purchased products.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Data Sharing</h2>
          <p>We do not sell your personal information. Data is stored securely with our infrastructure providers and shared only as necessary to operate the service or when required by law.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Contact</h2>
          <p>For privacy questions, email us at info@yaidigitals.com.</p>
        </div>
      </div>
    </section>
  );
}
