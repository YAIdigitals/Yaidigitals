export default async function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-textMain">About YAIdigitals</h1>
      <p className="mb-6 text-textMuted">
        YAIdigitals is a technology solutions company dedicated to building digital products that move businesses forward.
        We specialize in website development, mobile app development, AI automation, custom software development, and digital products that solve real business problems.
      </p>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-textMain">Our Mission</h2>
        <p className="mb-4 text-textMuted">
          To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-textMain">Our Approach</h2>
        <p className="mb-4 text-textMuted">
          We combine technical expertise with business acumen to deliver solutions that not only work but also deliver measurable results.
          Our process focuses on understanding your unique challenges and crafting tailored solutions that address your specific needs.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-textMain">What We Build</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2 text-textMain">Website Development</h3>
            <p className="text-textMuted">
              Business websites, corporate websites, e-commerce platforms, and custom web applications.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-textMain">Mobile App Development</h3>
            <p className="text-textMuted">
              Android and iOS apps, cross-platform mobile applications, customer-facing apps, and admin panels.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-textMain">AI Automation</h3>
            <p className="text-textMuted">
              Workflow automation, AI agents, chatbots, WhatsApp automation, CRM automation, and custom AI-powered solutions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-textMain">Custom Software</h3>
            <p className="text-textMuted">
              Tailored business tools, internal systems, and specialized software solutions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-textMain">Why Choose YAIdigitals</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-textMain">Technical Excellence</h3>
              <p className="text-sm text-textMuted">
                Our team consists of experienced developers who stay current with the latest technologies and best practices.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-textMain">Business-Focused Solutions</h3>
              <p className="text-sm text-textMuted">
                We don't just build technology – we build solutions that address real business challenges and deliver ROI.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-textMain">Quality & Reliability</h3>
              <p className="text-sm text-textMuted">
                We follow rigorous testing and quality assurance processes to ensure our solutions are reliable and performant.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-textMain">Ongoing Support</h3>
              <p className="text-sm text-textMuted">
                Our relationship doesn't end at launch. We provide ongoing support and maintenance to ensure long-term success.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <a href="/contact" className="bg-primary text-textMain px-6 py-3 rounded-lg hover:bg-primaryDark/80 transition">
          Start a Project
        </a>
      </div>
    </section>
  );
}

// Metadata for About page
export const metadata = {
  title: 'About YAIdigitals | YAIdigitals',
  description: 'Learn about who we are, our mission, our approach, and what we build as a technology solutions company.',
};