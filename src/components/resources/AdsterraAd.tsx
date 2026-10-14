'use client';

import { useEffect, useRef } from 'react';

/**
 * AdsterraBanner — renders a standard Adsterra iframe-based banner ad.
 *
 * Each instance creates an isolated container and injects the ad script
 * only into that container's scope, preventing atOptions global conflicts
 * when multiple ad units are on the same page.
 *
 * The atOptions variable is set on the container's contentWindow, not on
 * the parent window, ensuring scripts cannot interfere with each other.
 */
export type AdsterraFormat = '300x250' | '320x50' | '728x90';

interface BannerProps {
  adKey: string;
  width: number;
  height: number;
  format: AdsterraFormat;
  className?: string;
}

export function AdsterraBanner({ adKey, width, height, format, className }: BannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Write the ad into an isolated iframe to prevent atOptions global conflicts
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: transparent; }
  </style>
</head>
<body>
  <script>
    var atOptions = {
      'key': '${adKey}',
      'format': 'iframe',
      'height': ${height},
      'width': ${width},
      'params': {}
    };
  </script>
  <script src="https://bicea.org/22/${adKey}"></script>
</body>
</html>`;

    doc.open();
    doc.write(html);
    doc.close();
  }, [adKey, width, height]);

  return (
    <iframe
      ref={iframeRef}
      title={`Advertisement ${format}`}
      aria-label="Advertisement"
      width={width}
      height={height}
      frameBorder="0"
      scrolling="no"
      className={className}
      style={{ display: 'block', maxWidth: '100%' }}
    />
  );
}

/**
 * AdsterraNative — renders the native banner ad unit.
 * Uses a container div with a script injected; no atOptions conflict
 * since native banners use a different API.
 */
export function AdsterraNative({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Only inject once
    if (container.querySelector('script')) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bicea.org/21/b7d59b98fc7292bd424fc2f3ccf8d86c';

    const targetDiv = document.createElement('div');
    targetDiv.id = 'container-b7d59b98fc7292bd424fc2f3ccf8d86c';

    container.appendChild(targetDiv);
    container.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-label="Sponsored content"
      className={className}
    />
  );
}

/**
 * AdBlock — the main public-facing ad wrapper.
 * Renders appropriate ad units based on screen size and settings.
 * Never renders if ads are globally disabled or resource-level disabled.
 */
interface AdBlockProps {
  globalEnabled: boolean;
  resourceAdsEnabled: boolean;
  nativeEnabled?: boolean;
  banner300x250Enabled?: boolean;
  banner320x50Enabled?: boolean;
  banner728x90Enabled?: boolean;
  placement?: 'content' | 'sidebar' | 'footer' | 'mobile-sticky';
  className?: string;
}

export function AdBlock({
  globalEnabled,
  resourceAdsEnabled,
  nativeEnabled = true,
  banner300x250Enabled = true,
  banner320x50Enabled = true,
  banner728x90Enabled = true,
  placement = 'content',
  className = '',
}: AdBlockProps) {
  if (!globalEnabled || !resourceAdsEnabled) return null;

  const wrapperCls = `ad-block overflow-hidden rounded-lg ${className}`;
  const label = <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-textMuted/40">Advertisement</p>;

  if (placement === 'content') {
    return (
      <div className={wrapperCls}>
        {label}
        {/* Mobile: 300×250 */}
        {banner300x250Enabled && (
          <div className="flex justify-center lg:hidden">
            <AdsterraBanner
              adKey="8992bdb6d7f8b683144993ac74442230"
              width={300}
              height={250}
              format="300x250"
            />
          </div>
        )}
        {/* Desktop: 728×90 */}
        {banner728x90Enabled && (
          <div className="hidden justify-center lg:flex">
            <AdsterraBanner
              adKey="04f340bcc8ebf44cfb2d04f254e7a31c"
              width={728}
              height={90}
              format="728x90"
            />
          </div>
        )}
      </div>
    );
  }

  if (placement === 'sidebar') {
    return banner300x250Enabled ? (
      <div className={wrapperCls}>
        {label}
        <div className="flex justify-center">
          <AdsterraBanner
            adKey="8992bdb6d7f8b683144993ac74442230"
            width={300}
            height={250}
            format="300x250"
          />
        </div>
      </div>
    ) : null;
  }

  if (placement === 'footer') {
    return nativeEnabled ? (
      <div className={wrapperCls}>
        {label}
        <AdsterraNative />
      </div>
    ) : null;
  }

  if (placement === 'mobile-sticky') {
    return banner320x50Enabled ? (
      <div className={`fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-bgDark/95 py-1 backdrop-blur-sm lg:hidden ${className}`}>
        {label}
        <AdsterraBanner
          adKey="5cdb4a91f58a8f8c2ac39345afdf2448"
          width={320}
          height={50}
          format="320x50"
        />
      </div>
    ) : null;
  }

  return null;
}
