export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-bgDark">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-textMain">YAIdigitals</h3>
            <p className="text-textMuted">
              Building digital products that move businesses forward.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-textMain">Services</h3>
            <nav className="space-y-2">
              <a href="/services/website-development" className="text-textMuted hover:text-primary transition">
                Website Development
              </a>
              <a href="/services/mobile-app-development" className="text-textMuted hover:text-primary transition">
                Mobile App Development
              </a>
              <a href="/services/ai-automation" className="text-textMuted hover:text-primary transition">
                AI Automation
              </a>
              <a href="/services/custom-software" className="text-textMuted hover:text-primary transition">
                Custom Software
              </a>
              <a href="/services/ecommerce" className="text-textMuted hover:text-primary transition">
                E-commerce Development
              </a>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-textMain">Company</h3>
            <nav className="space-y-2">
              <a href="/about" className="text-textMuted hover:text-primary transition">
                About
              </a>
              <a href="/projects" className="text-textMuted hover:text-primary transition">
                Our Work
              </a>
              <a href="/contact" className="text-textMuted hover:text-primary transition">
                Contact
              </a>
              <a href="/courses" className="text-textMuted hover:text-primary transition">
                Courses
              </a>
              <a href="/store" className="text-textMuted hover:text-primary transition">
                Digital Products
              </a>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-textMain">Resources</h3>
            <nav className="space-y-2">
              <a href="/privacy-policy" className="text-textMuted hover:text-primary transition">
                Privacy Policy
              </a>
              <a href="/terms-conditions" className="text-textMuted hover:text-primary transition">
                Terms & Conditions
              </a>
              <a href="/refund-policy" className="text-textMuted hover:text-primary transition">
                Refund Policy
              </a>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold mb-2 text-textMain">Contact</h3>
            <p className="text-textMuted">
              Email: info@yaidigitals.com
            </p>
            <p className="text-textMuted">
              Phone: +1 (555) 123-4567
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/yaidigitals_" className="text-textMuted hover:text-primary">
                Instagram
              </a>
              <a href="https://facebook.com/yaidigitals" className="text-textMuted hover:text-primary">
                Facebook
              </a>
              <a href="https://twitter.com/yaidigitals" className="text-textMuted hover:text-primary">
                Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-textMuted">
            © {new Date().getFullYear()} YAIdigitals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
