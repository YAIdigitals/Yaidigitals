import { Metadata } from 'next';
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Refund Policy',
  description: 'Refund and cancellation policy for YAIdigitals digital products.',
  path: '/refund-policy',
});

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: 'YAIdigitals Refund Policy',
            description: 'Refund and cancellation policy for YAIdigitals digital products.',
            path: '/refund-policy',
          }),
          breadcrumbJsonLd([{ name: 'Refund Policy', path: '/refund-policy' }]),
        ]}
      />
      <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">Refund Policy</h1>
      <div className="space-y-6 text-textMuted">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Digital Products</h2>
          <p>
            Because our products are instantly delivered digital assets, all sales are final once the
            product has been downloaded or accessed. If you have not yet accessed your purchase and
            believe there was a billing error, contact us within 7 days and we will review your case.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Duplicate or Failed Payments</h2>
          <p>
            If you were charged twice, or your payment succeeded but you did not receive the product,
            email info@yaidigitals.com with your payment reference. Verified cases are refunded in full
            within 5–7 business days.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textMain">Services</h2>
          <p>For custom project work, refunds follow the milestones agreed in your project proposal.</p>
        </div>
      </div>
      </section>
    </>
  );
}
