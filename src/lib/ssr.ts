import { createContext, useContext } from "react";

/**
 * What a page reports to the prerender while it renders on the server
 * (src/entry-server.tsx). Null in the browser.
 */
export interface SsrCollector {
  /** HTTP status the static file should be served with. */
  status: number;
  /** Serialized JSON-LD documents, written into <head> by the prerender. */
  jsonLd: string[];
}

export const SsrContext = createContext<SsrCollector | null>(null);

/** Marks the page being prerendered with an HTTP status (the 404 page). */
export function useSsrStatus(status: number) {
  const collector = useContext(SsrContext);
  if (collector) collector.status = status;
}
