// ---------------------------------------------------------------------------
// capture-session1.ts
// Re-runnable image build for /workshop/session-1. Produces, under
// public/workshop/session-1/:
//   <software id>.webp    1600w  from assets/portfolio/<source>
//   site-<website id>.webp 1200x750 (16:10) live capture of the site
//   superbowl-<n>.webp    1080w  from assets/session-1/superbowl-<n>.png
//
// The Super Bowl screenshots are phone screenshots Owen drops in by hand; they
// are skipped without error until those files exist, and the page renders a
// labelled empty frame in their place.
//
// Run:  npm run capture:session1
//       npm run capture:session1 -- --only sites
// Once: npx playwright install chromium
//
// Netlify never runs this; the generated WebPs are committed.
// ---------------------------------------------------------------------------

import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import sharp from "sharp";
import { session1 } from "../src/data/session1";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORTFOLIO_DIR = path.join(ROOT, "assets", "portfolio");
const DROP_DIR = path.join(ROOT, "assets", "session-1");
const OUT_DIR = path.join(ROOT, "public", "workshop", "session-1");

const SOFTWARE_W = 1600;
const SITE_W = 1200;
const SITE_H = 750; // 16:10, matching the capture viewport's own ratio
// Captured wider than it ships, then downscaled: at 1200 CSS px hfhonline.com's
// nav collides with its own logo, which a 1440 viewport clears.
const SITE_VIEWPORT_W = 1440;
const SITE_VIEWPORT_H = 900;
const PHONE_W = 1080;
const TARGET = 180_000; // bytes, best effort

// tsx compiles via esbuild with keepNames, which injects __name() into the
// closures Playwright serializes into the page. See scripts/capture-work.ts.
const PAGE_POLYFILL = "globalThis.__name = (f) => f;";

const HIDE_OVERLAYS_CSS = `
  [id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
  [id*="onetrust" i], [class*="onetrust" i], [class*="intercom" i],
  [id*="crisp" i], [class*="crisp" i], [class*="chat-widget" i],
  [id*="tawk" i], [class*="tawk" i], [id*="tidio" i], [class*="tidio" i],
  [id*="chatway" i], [class*="chatway" i], iframe[title*="chat" i],
  iframe[src*="chat" i], iframe[id*="chat" i] { display: none !important; }
`;

interface Row {
  out: string;
  source: string;
  size: string;
  note: string;
}

const rows: Row[] = [];

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

/** Encode to webp, stepping quality down until under target (best effort). */
async function toWebp(image: sharp.Sharp): Promise<Buffer> {
  let out: Buffer = Buffer.alloc(0);
  for (const quality of [82, 70, 58]) {
    out = await image.clone().webp({ quality }).toBuffer();
    if (out.length <= TARGET) return out;
  }
  return out;
}

async function write(name: string, buf: Buffer, source: string, note = "") {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, name), buf);
  rows.push({
    out: `public/workshop/session-1/${name}`,
    source,
    size: `${buf.length.toLocaleString()} B`,
    note,
  });
  console.log(`  wrote ${name} (${buf.length.toLocaleString()} B)`);
}

/**
 * Load a site, settle it, and strip the overlays that otherwise get baked into
 * the thumbnail: consent banners by selector, plus any small fixed element
 * pinned to a bottom corner (chat launchers and back-to-top buttons that carry
 * no vendor class name -- hfhonline.com's is a bare `<a id="fab">`).
 */
async function preparePage(page: Page, url: string): Promise<void> {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  } catch {
    console.warn(`  networkidle timed out for ${url}, continuing`);
  }
  await page.waitForTimeout(1500);
  // Nudge lazy images above the fold, then return to the top.
  await page.evaluate(() => {
    window.scrollTo(0, 400);
    window.scrollTo(0, 0);
  });
  await page.addStyleTag({ content: HIDE_OVERLAYS_CSS });
  await page.evaluate(() => {
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const s = getComputedStyle(el);
      if (s.position !== "fixed" || s.display === "none") continue;
      const r = el.getBoundingClientRect();
      const small = r.width >= 30 && r.width <= 140 && r.height >= 30 && r.height <= 140;
      const corner = r.top > innerHeight * 0.6;
      if (small && corner) el.style.display = "none";
    }
  });
  await page.waitForTimeout(600);
}

async function captureSites(browser: Browser): Promise<void> {
  for (const site of session1.built.websites) {
    console.log(`\nsite-${site.id}  ${site.url}`);
    const context = await browser.newContext({
      viewport: { width: SITE_VIEWPORT_W, height: SITE_VIEWPORT_H },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    try {
      await context.addInitScript({ content: PAGE_POLYFILL });
      const page = await context.newPage();
      await preparePage(page, site.url);
      const shot = await page.screenshot(); // viewport, not full page
      const buf = await toWebp(sharp(shot).resize(SITE_W, SITE_H, { fit: "cover" }));
      await write(`site-${site.id}.webp`, buf, site.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  FAILED: ${message}`);
      rows.push({
        out: `site-${site.id}.webp`,
        source: site.url,
        size: "-",
        note: `FAILED: ${message}`,
      });
    } finally {
      await context.close();
    }
  }
}

async function buildSoftware(): Promise<void> {
  for (const item of session1.built.software) {
    console.log(`\n${item.id}`);
    const file = path.join(PORTFOLIO_DIR, item.source);
    if (!(await exists(file))) {
      console.error(`  MISSING ${path.relative(ROOT, file)}`);
      rows.push({
        out: `${item.id}.webp`,
        source: item.source,
        size: "-",
        note: "MISSING source in assets/portfolio/",
      });
      continue;
    }
    const buf = await toWebp(sharp(file).resize({ width: SOFTWARE_W }));
    await write(`${item.id}.webp`, buf, `assets/portfolio/${item.source}`);
  }
}

/**
 * The three phone screenshots, dropped in by hand. Any common image extension
 * works. Missing files are reported, not fatal: the page shows an empty frame
 * until they land.
 */
async function buildSuperBowl(): Promise<void> {
  const extensions = ["png", "jpg", "jpeg", "webp", "PNG", "JPG", "JPEG"];
  for (const [i, shot] of session1.superBowl.shots.entries()) {
    const n = i + 1;
    console.log(`\nsuperbowl-${n}`);
    let found: string | undefined;
    for (const ext of extensions) {
      const candidate = path.join(DROP_DIR, `superbowl-${n}.${ext}`);
      if (await exists(candidate)) {
        found = candidate;
        break;
      }
    }
    if (!found) {
      console.log(`  none yet at assets/session-1/superbowl-${n}.*  (frame stays empty)`);
      rows.push({
        out: `superbowl-${n}.webp`,
        source: `assets/session-1/superbowl-${n}.*`,
        size: "-",
        note: "not provided yet",
      });
      continue;
    }
    // Never upscale: a phone screenshot narrower than PHONE_W is left alone.
    const meta = await sharp(found).metadata();
    const width = Math.min(PHONE_W, meta.width ?? PHONE_W);
    const buf = await toWebp(sharp(found).resize({ width }));
    await write(
      `superbowl-${n}.webp`,
      buf,
      path.relative(ROOT, found),
      `${shot.label}, ${meta.width}x${meta.height} source`,
    );
  }
}

async function main() {
  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : undefined;
  const run = (name: string) => !only || only === name;

  if (run("software")) await buildSoftware();
  if (run("superbowl")) await buildSuperBowl();
  if (run("sites")) {
    const browser = await chromium.launch();
    try {
      await captureSites(browser);
    } finally {
      await browser.close();
    }
  }

  console.log("\nSummary");
  const headers: Row = { out: "out", source: "source", size: "size", note: "note" };
  const all = [headers, ...rows];
  const width = (k: keyof Row) => Math.max(...all.map((r) => r[k].length));
  for (const r of all) {
    console.log(
      [
        r.out.padEnd(width("out")),
        r.source.padEnd(width("source")),
        r.size.padStart(width("size")),
        r.note,
      ].join("  "),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
