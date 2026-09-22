// ---------------------------------------------------------------------------
// PRERENDER
// The last step of `npm run build`. Renders every route to static HTML in
// dist/, so crawlers and link previews get the real page in the first
// response, and React hydrates that markup in the browser.
//
// Routes are discovered, not listed: the crawl starts at "/" and follows every
// internal link in the rendered markup, plus the few pages nothing links to
// (UNLINKED_ROUTES in src/entry-server.tsx). An internal link that lands on
// the 404 page fails the build, and so does a page that renders empty.
//
// Plain Node on purpose: everything app-specific comes from the SSR bundle
// that `vite build --ssr src/entry-server.tsx` writes to dist-ssr/.
// ---------------------------------------------------------------------------

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SERVER_ENTRY = path.join(ROOT, "dist-ssr", "entry-server.js");

const { render, BASE_URL, UNLINKED_ROUTES, NOT_FOUND_ROUTE } = await import(
  pathToFileURL(SERVER_ENTRY).href
);

const BASE = BASE_URL.replace(/\/$/, "");
const template = await readFile(path.join(DIST, "index.html"), "utf8");
const renderedAt = Date.now();

if (!template.includes("<!--app-head-->") || !template.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html is missing the <!--app-head--> or #root placeholder");
}

/** "/" -> index.html, "/work/x" -> work/x/index.html */
function fileFor(route) {
  if (route === NOT_FOUND_ROUTE) return "404.html";
  return route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
}

/** Site-relative page links in a chunk of markup, as bare routes. */
function internalLinks(html) {
  const links = new Set();
  for (const [, raw] of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
    const href = raw.replace(/&amp;/g, "&");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    let route = href.split(/[?#]/)[0];
    if (BASE && route.startsWith(BASE)) route = route.slice(BASE.length);
    if (path.extname(route)) continue; // a file, not a page
    links.add(route.replace(/\/+$/, "") || "/");
  }
  return links;
}

/** Every local file the markup points at must exist in dist/. */
function missingAssets(html) {
  const refs = new Set();
  for (const [, attr, value] of html.matchAll(/\s(src|href|srcset)="([^"]+)"/g)) {
    const urls = attr === "srcset" ? value.split(",").map((s) => s.trim().split(/\s+/)[0]) : [value];
    for (const url of urls) {
      if (url.startsWith("/") && !url.startsWith("//") && path.extname(url.split(/[?#]/)[0])) {
        refs.add(url.split(/[?#]/)[0]);
      }
    }
  }
  return [...refs].filter((url) => {
    const local = BASE && url.startsWith(BASE) ? url.slice(BASE.length) : url;
    return !existsSync(path.join(DIST, decodeURIComponent(local)));
  });
}

function assertRendered(route, { body }) {
  const text = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!/<h1\b/.test(body)) throw new Error(`${route}: no <h1> in the prerendered markup`);
  if (text.length < 200) throw new Error(`${route}: prerendered markup is nearly empty`);
  if (/<template id="B:|\$RC\(/.test(body)) {
    throw new Error(`${route}: a Suspense boundary was streamed out of order instead of written inline`);
  }
}

/** The head a crawler reads: one of each tag, and JSON-LD that parses. */
function assertHead(route, html, { canonical }) {
  const head = html.slice(0, html.indexOf("</head>"));
  const count = (re) => (head.match(re) ?? []).length;
  const expect = (what, n, want) => {
    if (n !== want) throw new Error(`${route}: expected ${want} ${what} in <head>, found ${n}`);
  };
  expect("<title>", count(/<title>/g), 1);
  expect('meta name="description"', count(/<meta name="description"/g), 1);
  expect('link rel="canonical"', count(/<link rel="canonical"/g), canonical ? 1 : 0);
  for (const [, json] of head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch (error) {
      throw new Error(`${route}: JSON-LD does not parse (${error.message})`);
    }
  }
}

function toHtml({ head, body }) {
  // Replacer functions, not strings: markup can hold "$&" or "$$" patterns
  // that String.replace would otherwise expand.
  return template
    .replace("<!--app-head-->", () => head)
    .replace('<div id="root"></div>', () => `<div id="root" data-rendered-at="${renderedAt}">${body}</div>`);
}

async function writePage(route, result) {
  const html = toHtml(result);
  assertHead(route, html, { canonical: result.status === 200 });
  const missing = missingAssets(html);
  if (missing.length) throw new Error(`${route}: references files not in dist/: ${missing.join(", ")}`);
  const file = path.join(DIST, fileFor(route));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  return html.length;
}

// --- Crawl ------------------------------------------------------------------

const queue = ["/", ...UNLINKED_ROUTES];
const linkedFrom = new Map(queue.map((route) => [route, "(entry)"]));
const pages = [];

while (queue.length > 0) {
  const route = queue.shift();
  const result = await render(route, renderedAt);
  if (result.status !== 200) {
    throw new Error(`${route} renders a ${result.status} page (linked from ${linkedFrom.get(route)})`);
  }
  assertRendered(route, result);
  pages.push({ route, result });

  for (const link of internalLinks(result.body)) {
    if (!linkedFrom.has(link)) {
      linkedFrom.set(link, route);
      queue.push(link);
    }
  }
}

const notFound = await render(NOT_FOUND_ROUTE, renderedAt);
if (notFound.status !== 404) throw new Error(`${NOT_FOUND_ROUTE} should render the 404 page`);
assertRendered(NOT_FOUND_ROUTE, notFound);

// --- Write ------------------------------------------------------------------

const rows = [];
for (const { route, result } of pages) {
  rows.push([route, fileFor(route), await writePage(route, result)]);
}
rows.push([`(${NOT_FOUND_ROUTE})`, fileFor(NOT_FOUND_ROUTE), await writePage(NOT_FOUND_ROUTE, notFound)]);

// Netlify: serve each page at its canonical, slash-free URL straight from its
// file, whatever the site's Pretty URLs setting. Exact paths, never
// wildcards: a forced wildcard would also catch the images under /work/.
if (BASE === "") {
  const lines = pages
    .filter(({ route }) => route !== "/")
    .map(({ route }) => `${route}  ${route}/index.html  200!`);
  await writeFile(
    path.join(DIST, "_redirects"),
    `# Generated by scripts/prerender.mjs. Do not edit.\n${lines.join("\n")}\n`,
  );
}

const width = Math.max(...rows.map(([route]) => route.length));
for (const [route, file, size] of rows) {
  console.log(`  ${route.padEnd(width)}  dist/${file}  ${(size / 1024).toFixed(1)} kB`);
}
console.log(`✓ prerendered ${pages.length} pages and the 404 page`);
