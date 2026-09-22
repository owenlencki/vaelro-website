// ---------------------------------------------------------------------------
// PRERENDER
// The last step of `npm run build`. Renders every route to static HTML in
// dist/, so crawlers and link previews get the real page in the first
// response, and React hydrates that markup in the browser.
//
// Routes are discovered, not listed: the crawl starts at "/" and follows every
// internal link in the rendered markup, plus the few pages nothing links to
// (UNLINKED_ROUTES in src/entry-server.tsx). An internal link that lands on
// the 404 page fails the build, and so does a page that renders empty or has
// an incomplete head.
//
// Also writes dist/sitemap.xml (every indexable page) and dist/_redirects.
//
// Plain Node on purpose: everything app-specific comes from the SSR bundle
// that `vite build --ssr src/entry-server.tsx` writes to dist-ssr/.
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
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

const decode = (text) =>
  text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** The head a crawler reads: one of each tag, and JSON-LD that parses. */
function assertHead(route, html, { canonical }) {
  const head = html.slice(0, html.indexOf("</head>"));
  const count = (pattern) => head.split(pattern).length - 1;
  const expect = (tag, want) => {
    const found = count(tag);
    if (found !== want) throw new Error(`${route}: expected ${want} × ${tag} in <head>, found ${found}`);
  };

  if (!html.includes('<html lang="en">')) throw new Error(`${route}: <html lang="en"> is missing`);
  expect("<title>", 1);
  expect('<meta name="viewport"', 1);
  expect('<meta name="description"', 1);
  expect('<meta name="robots"', 1);
  expect('<link rel="canonical"', canonical ? 1 : 0);
  expect('<meta property="og:url"', canonical ? 1 : 0);
  for (const property of ["og:type", "og:locale", "og:title", "og:description", "og:image"]) {
    expect(`<meta property="${property}"`, 1);
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description"]) {
    expect(`<meta name="${name}"`, 1);
  }
  for (const [, json] of head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch (error) {
      throw new Error(`${route}: JSON-LD does not parse (${error.message})`);
    }
  }
}

/** Search-snippet guidance for indexable pages. Warnings, not failures. */
function lintHead(route, html) {
  const head = html.slice(0, html.indexOf("</head>"));
  if (/<meta name="robots" content="noindex/.test(head)) return [];
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/)[1]);
  const description = decode(head.match(/<meta name="description" content="([^"]*)"/)[1]);
  const warnings = [];
  if (title.length >= 60) warnings.push(`title is ${title.length} characters (aim for under 60)`);
  if (description.length < 120 || description.length > 158) {
    warnings.push(`description is ${description.length} characters (aim for 120 to 158)`);
  }
  return warnings.map((warning) => `${route}: ${warning}`);
}

function toHtml({ head, body }) {
  // Replacer functions, not strings: markup can hold "$&" or "$$" patterns
  // that String.replace would otherwise expand.
  return template
    .replace("<!--app-head-->", () => head)
    .replace('<div id="root"></div>', () => `<div id="root" data-rendered-at="${renderedAt}">${body}</div>`);
}

const warnings = [];

async function writePage(route, result) {
  const html = toHtml(result);
  assertHead(route, html, { canonical: result.status === 200 });
  if (result.status === 200) warnings.push(...lintHead(route, html));
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

// --- Sitemap ------------------------------------------------------------------
// Every indexable page, at its canonical URL (read from the page's own head, so
// the two can never disagree). <lastmod> is the newest commit touching what the
// page is made of or the layout every page shares, so it only moves when the
// page actually changes. Routes not listed here date from all of src/.

const SHARED_SOURCES = ["index.html", "src/App.tsx", "src/components/layout", "src/data/business.ts"];
const PAGE_SOURCES = [
  [/^\/$/, ["src/pages/HomePage.tsx", "src/components/sections", "src/data/projects.ts"]],
  [/^\/web-design$/, ["src/pages/WebDesignPage.tsx", "src/components/service", "src/data/projects.ts"]],
  [/^\/automation$/, ["src/pages/AutomationPage.tsx", "src/components/service", "src/data/projects.ts"]],
  [/^\/about$/, ["src/pages/AboutPage.tsx", "src/components/sections"]],
  [/^\/contact$/, ["src/pages/ContactPage.tsx", "src/components/sections", "src/data/faqs.ts"]],
  [/^\/privacy$/, ["src/pages/PrivacyPage.tsx"]],
  [/^\/workshop$/, ["src/pages/WorkshopPage.tsx", "src/components/workshop", "src/data/workshop.ts"]],
  [/^\/work\//, ["src/pages/WorkDetailPage.tsx", "src/data/projects.ts"]],
];

function lastmodFor(route) {
  const own = PAGE_SOURCES.find(([pattern]) => pattern.test(route))?.[1] ?? ["src"];
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...own, ...SHARED_SOURCES], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
    if (date) return date;
  } catch {
    // Not a git checkout: date it by the build instead.
  }
  return new Date(renderedAt).toISOString().slice(0, 10);
}

const sitemap = pages
  .filter(({ result }) => !/<meta name="robots" content="noindex/.test(result.head))
  .map(({ route, result }) => ({
    loc: result.head.match(/<link rel="canonical" href="([^"]+)"/)[1],
    lastmod: lastmodFor(route),
  }));
await writeFile(
  path.join(DIST, "sitemap.xml"),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemap.map(({ loc, lastmod }) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`),
    "</urlset>",
    "",
  ].join("\n"),
);

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
for (const warning of warnings) console.warn(`  ⚠ ${warning}`);
console.log(`✓ prerendered ${pages.length} pages and the 404 page; ${sitemap.length} in dist/sitemap.xml`);
