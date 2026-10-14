'use client';

import { useEffect, useRef } from 'react';

interface ResourceEventTrackerProps {
  resourceId: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

/**
 * Fires a 'view' event when the resource page loads.
 * Uses a ref to ensure it only fires once per mount.
 */
export function ResourceViewTracker({ resourceId, utmSource, utmMedium, utmCampaign }: ResourceEventTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch('/api/resources/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource_id: resourceId,
        event_type: 'view',
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      }),
    }).catch(() => {/* silent — analytics failures must not break the page */});
  }, [resourceId, utmSource, utmMedium, utmCampaign]);

  return null;
}

interface DownloadButtonProps {
  resourceId: number;
  downloadUrl: string;
  fileName?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Download button that tracks the click event before navigating.
 * Opens in a new tab to prevent navigation interruption.
 */
export function DownloadButton({
  resourceId,
  downloadUrl,
  fileName,
  utmSource,
  utmMedium,
  utmCampaign,
  className,
  children,
}: DownloadButtonProps) {
  const handleClick = () => {
    fetch('/api/resources/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource_id: resourceId,
        event_type: 'download_click',
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
      }),
    }).catch(() => {/* silent */});
    // Navigation happens via the anchor href
  };

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      download={fileName || undefined}
      className={className}
    >
      {children}
    </a>
  );
}
