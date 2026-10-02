'use client';

import { useEffect } from 'react';
import { trackEvent, type AnalyticsEvent as EventName } from '@/lib/analytics';

export function AnalyticsEvent({ name, context }: { name: EventName; context: string }) {
  useEffect(() => {
    trackEvent(name, { context });
  }, [context, name]);
  return null;
}
