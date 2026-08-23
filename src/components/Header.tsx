'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bgDark/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primaryDark transition-colors">
              YAIdigitals
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className="flex items-center text-textMuted hover:text-textMain transition-colors font-medium"
              >
                Services
                {isServicesMenuOpen ? (
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {isServicesMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-bgCard rounded-lg shadow-lg border-border z-20">
                  <div className="py-2">
                    <Link href="/services/website-development" className="block px-4 py-2 text-sm text-textMuted hover:bg-primary/10 hover:text-textMain">
                      Website Development
                    </Link>
                    <Link href="/services/mobile-app-development" className="block px-4 py-2 text-sm text-textMuted hover:bg-primary/10 hover:text-textMain">
                      Mobile App Development
                    </Link>
                    <Link href="/services/ai-automation" className="block px-4 py-2 text-sm text-textMuted hover:bg-primary/10 hover:text-textMain">
                      AI Automation
                    </Link>
                    <Link href="/services/custom-software" className="block px-4 py-2 text-sm text-textMuted hover:bg-primary/10 hover:text-textMain">
                      Custom Software
                    </Link>
                    <Link href="/services/ecommerce" className="block px-4 py-2 text-sm text-textMuted hover:bg-primary/10 hover:text-textMain">
                      E-commerce Development
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/courses" className="ml-8 text-textMuted hover:text-textMain transition-colors font-medium">Courses</Link>
            <Link href="/projects" className="ml-8 text-textMuted hover:text-textMain transition-colors font-medium">Our Work</Link>
            <Link href="/store" className="ml-8 text-textMuted hover:text-textMain transition-colors font-medium">Digital Products</Link>
            <Link href="/about" className="ml-8 text-textMuted hover:text-textMain transition-colors font-medium">About</Link>
            <Link href="/contact" className="ml-8 text-textMuted hover:text-textMain transition-colors font-medium">Contact</Link>
            {/* Admin link removed from header as requested - accessible only via direct URL */}
          </div>
        </div>
      </div>
    </header>
  );
}