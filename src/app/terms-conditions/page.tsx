import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using YAIdigitals products and services.',
};

export default function TermsConditionsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Terms &amp; Conditions</h1>
      <div className="space-y-6 text-textMuted">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">1. Acceptance</h2>
          <p>By accessing YAIdigitals or purchasing our products, you agree to these terms.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">2. Digital Products License</h2>
          <p>
            Upon purchase you receive a non-exclusive, non-transferable license to use the digital
            assets in your own personal or commercial projects. Reselling, redistributing, or bundling
            the raw files is prohibited.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">3. Services</h2>
          <p>
            Project work is governed by the scope, timeline, and payment milestones agreed in writing
            before commencement.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">4. Limitation of Liability</h2>
          <p>YAIdigitals is not liable for indirect or consequential damages arising from the use of our products or services.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">5. Contact</h2>
          <p>Questions about these terms can be sent to info@yaidigitals.com.</p>
        </div>
      </div>
    </section>
  );
}
