// ---------------------------------------------------------------------------
// PRERENDER ENTRY
// Built by `vite build --ssr` and driven by scripts/prerender.mjs, which calls
// render() once per route and writes the result into dist/ as static HTML.
// Never loaded in the browser.
// ---------------------------------------------------------------------------

import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { RenderTimeContext } from "./hooks/useNow";
import { SsrContext, type SsrCollector } from "./lib/ssr";

export const BASE_URL = import.meta.env.BASE_URL;

/**
 * Routes the prerender builds whether or not anything links to them; every
 * other page is discovered by following links out from "/". The Session 1
 * page is linked from the card on /workshop today, but people also reach it
 * straight from a texted link, so it must keep building if that card goes.
 */
export const UNLINKED_ROUTES = ["/workshop/session-1"];

/** Rendered to dist/404.html. Any path the router does not know will do. */
export const NOT_FOUND_ROUTE = "/404";

export interface RenderResult {
  /** Everything for <head>: the tags React hoisted, then the JSON-LD. */
  head: string;
  /** The app markup for #root. */
  body: string;
  /** HTTP status the file should be served with. */
  status: number;
}

// Rendering a tree that is not a whole <html> document, React writes the
// elements it hoists (title, meta, link, image preloads) ahead of the app
// markup. Peel them off so they can go in the real <head>.
const HOISTED =
  /^(?:<(?:meta|link|base)\b[^>]*>|<(title|style|script)\b[^>]*>[\s\S]*?<\/\1>)/;

function splitHoisted(html: string): { head: string; body: string } {
  let head = "";
  let body = html;
  for (let m = HOISTED.exec(body); m; m = HOISTED.exec(body)) {
    head += m[0];
    body = body.slice(m[0].length);
  }
  return { head, body };
}

export async function render(
  route: string,
  renderedAt: number,
): Promise<RenderResult> {
  const collector: SsrCollector = { status: 200, jsonLd: [] };
  const errors: unknown[] = [];

  const { prelude } = await prerender(
    <SsrContext.Provider value={collector}>
      <RenderTimeContext.Provider value={renderedAt}>
        <StaticRouter
          basename={BASE_URL}
          location={BASE_URL.replace(/\/$/, "") + route}
        >
          <App />
        </StaticRouter>
      </RenderTimeContext.Provider>
    </SsrContext.Provider>,
    {
      // An error inside a Suspense boundary would otherwise ship that
      // boundary's empty fallback as the page. Fail the build instead.
      onError: (error) => void errors.push(error),
      // React streams a boundary bigger than this (12.8 kB by default) out of
      // order: the fallback in place, the content in a hidden div, and a
      // script to swap them. A static file should read top to bottom with no
      // JavaScript, so always write boundaries inline.
      progressiveChunkSize: Infinity,
    },
  );
  if (errors.length > 0) throw errors[0];

  const { head, body } = splitHoisted(await new Response(prelude).text());
  const jsonLd = collector.jsonLd
    .map((json) => `<script type="application/ld+json" data-seo="">${json}</script>`)
    .join("");

  return { head: head + jsonLd, body, status: collector.status };
}
