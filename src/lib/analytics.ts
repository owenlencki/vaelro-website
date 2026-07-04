declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fire a GA4 event. No-ops when gtag hasn't loaded (local dev, ad blockers),
 * so callers never need to guard.
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  window.gtag?.("event", name, params);
}
