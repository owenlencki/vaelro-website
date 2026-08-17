// ---------------------------------------------------------------------------
// capture-work.ts
// Re-runnable screenshot capture for the Work section. For every featured
// project in src/data/projects.ts it produces:
//   public/work/<slug>/card.webp  720x1200 (3:5 portrait, mobile viewport)
//   public/work/<slug>/hero.webp  1600w    (desktop viewport)
// Projects without a liveUrl, live URLs that turn out to be login walls or
// near-blank, and slugs listed in FORCE_ASSET_SOURCES are built from curated
// screenshots in assets/portfolio/ instead.
//
// Run:  npm run capture:work            (all featured projects)
//       npm run capture:work -- --only <slug>
// Once: npx playwright install chromium
//
// Netlify never runs this; the generated WebPs are committed.
// ---------------------------------------------------------------------------

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser } from "playwright";
import sharp from "sharp";
import { featuredProjects, type Project } from "../src/data/projects";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.join(ROOT, "assets", "portfolio");
const OUT_DIR = path.join(ROOT, "public", "work");

const CARD_W = 720;
const CARD_H = 1200;
const HERO_W = 1600;
const CARD_TARGET = 120_000; // bytes
const HERO_TARGET = 250_000;
const PAD = 24; // composite inset and stack gap
const CORNER = 16; // composite rounded-corner radius
// peach-50 from src/index.css @theme: the Work section's background token.
const CANVAS_BG = "#fbf7f2";

interface AssetSource {
  /** Files under assets/portfolio/, primary first (the hero uses the primary). */
  files: string[];
  /**
   * How the 3:5 card is built:
   *  "stack" – contain-fit one or two images stacked on the section-token
   *            canvas (dashboards that must not be cropped)
   *  "cover" – full-height portrait crop of the primary image, for
   *            screenshots whose content is a centered column or lockup that
   *            survives side-cropping
   */
  card: "stack" | "cover";
  /** "cover" only: horizontal center of the crop window, fraction of width. */
  focusX?: number;
  /**
   * "cover" only: minimum window width as a fraction of source width. When
   * this exceeds what a full-height 3:5 window allows, the wider window is
   * scaled to card width and letterboxed on a canvas sampled from the
   * image's own background color.
   */
  minWidthFrac?: number;
}

// Sources picked by filename per WORK_BUILD.md Section 3/5, plus curated
// overrides. Used when a project has no liveUrl, when the live page is a
// login wall or near-blank, or when the slug is in FORCE_ASSET_SOURCES.
const ASSET_SOURCES: Record<string, AssetSource> = {
  meridian: {
    files: ["meridian-dashboard-1.png", "meridian-dashboard-2.png"],
    card: "stack",
  },
  maverick: {
    files: ["maverick-dashboard-portfolio.png", "maverick-students-portfolio.png"],
    card: "stack",
  },
  "udoni-salan-real-estate": {
    files: ["udoni-salan-ai-email-generator.png"],
    card: "cover",
    focusX: 0.5, // the tool is a dead-centered column; the crop keeps all of it
  },
  owenlencki: {
    files: ["owenlencki-hero.png"],
    card: "cover",
    // Measured bounds: name lockup x 713-1582, eyebrow line x 706-1676 of
    // 2880. Center the window on that content and widen it past the
    // full-height 3:5 limit so nothing sits flush against the card edges.
    focusX: 0.4135,
    minWidthFrac: 0.38,
  },
};

// Slugs whose images always come from ASSET_SOURCES even though a liveUrl
// exists: live capture of owenlencki.com misses the hero photo collage
// (it loads in late), so a curated screenshot is used instead. liveUrl
// stays the visit link on the site either way.
const FORCE_ASSET_SOURCES = new Set(["owenlencki"]);

// tsx compiles via esbuild with keepNames, which injects __name() calls into
// the closures Playwright serializes into the page; define it there so
// page.evaluate doesn't throw ReferenceError.
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
  slug: string;
  source: string;
  /** "no" = live capture, "yes" = wall fallback, "override" = curated
   *  asset source forced over a working liveUrl, "-" = no liveUrl. */
  fallback: string;
  card: string;
  hero: string;
  flags: string;
}

/** Encode to webp, stepping quality down until under target (best effort). */
async function toWebp(image: sharp.Sharp, target: number): Promise<Buffer> {
  let out: Buffer = Buffer.alloc(0);
  for (const quality of [80, 65, 50]) {
    out = await image.clone().webp({ quality }).toBuffer();
    if (out.length <= target) return out;
  }
  return out;
}

/** Resize a source to `width` (optionally capped to maxH) with rounded corners. */
async function roundedLayer(
  file: string,
  width: number,
  maxH: number,
): Promise<{ buf: Buffer; h: number }> {
  let pipeline = sharp(file).resize({ width });
  let { info } = await pipeline.png().toBuffer({ resolveWithObject: true });
  if (info.height > maxH) {
    pipeline = sharp(file).resize({ width, height: maxH, fit: "inside" });
    ({ info } = await pipeline.png().toBuffer({ resolveWithObject: true }));
  }
  const data = await pipeline.png().toBuffer();
  const mask = Buffer.from(
    `<svg width="${info.width}" height="${info.height}"><rect width="${info.width}" height="${info.height}" rx="${CORNER}" ry="${CORNER}"/></svg>`,
  );
  const buf = await sharp(data)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  return { buf, h: info.height };
}

/** "cover" card: full-height portrait crop of the source, centered on focusX.
 *  A minWidthFrac wider than the full-height window allows switches to a
 *  letterboxed fit on a canvas sampled from the image's background. */
async function coverCard(
  file: string,
  focusX: number,
  minWidthFrac = 0,
): Promise<Buffer> {
  const meta = await sharp(file).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  const aspect = CARD_W / CARD_H;
  const fullHeightW = Math.min(Math.round(H * aspect), W);
  const winW = Math.min(Math.max(fullHeightW, Math.round(W * minWidthFrac)), W);
  const left = Math.min(Math.max(Math.round(W * focusX - winW / 2), 0), W - winW);

  if (winW <= fullHeightW) {
    const winH = Math.min(Math.round(winW / aspect), H);
    const image = sharp(file)
      .extract({ left, top: 0, width: winW, height: winH })
      .resize(CARD_W, CARD_H);
    return toWebp(image, CARD_TARGET);
  }

  // Wider-than-full-height window: fit to card width and center it over a
  // blurred cover crop of the same image, so the letterbox reads as the
  // image's own background instead of flat bars.
  const window = sharp(file).extract({ left, top: 0, width: winW, height: H });
  const scaled = await window.resize({ width: CARD_W }).png().toBuffer();
  const scaledH = Math.round(H * (CARD_W / winW));
  const underlay = await sharp(file)
    .resize(CARD_W, CARD_H, { fit: "cover" })
    .blur(30)
    .png()
    .toBuffer();
  const canvas = sharp(underlay).composite([
    { input: scaled, left: 0, top: Math.round((CARD_H - scaledH) / 2) },
  ]);
  return toWebp(sharp(await canvas.png().toBuffer()), CARD_TARGET);
}

/**
 * Build card + hero from assets/portfolio/ sources. "stack" cards contain-fit
 * one or two images top-aligned on a 720x1200 canvas in the section
 * background color; "cover" cards crop a portrait window from the primary
 * image. The hero is always the primary source fit to 1600 wide.
 */
async function composeFromSources(slug: string): Promise<{ card: Buffer; hero: Buffer; source: string }> {
  const config = ASSET_SOURCES[slug];
  if (!config || config.files.length === 0) {
    throw new Error(`no asset sources mapped for "${slug}" in ASSET_SOURCES`);
  }
  const files = config.files.map((n) => path.join(SOURCE_DIR, n));

  let card: Buffer;
  if (config.card === "cover") {
    card = await coverCard(files[0], config.focusX ?? 0.5, config.minWidthFrac);
  } else {
    const layerW = CARD_W - PAD * 2; // 672
    const layers: sharp.OverlayOptions[] = [];
    let y = PAD;
    for (const file of files.slice(0, 2)) {
      const remaining = CARD_H - y - PAD;
      if (remaining < 100) break;
      const { buf, h } = await roundedLayer(file, layerW, remaining);
      layers.push({ input: buf, left: PAD, top: y });
      y += h + PAD;
    }
    const canvas = sharp({
      create: { width: CARD_W, height: CARD_H, channels: 4, background: CANVAS_BG },
    }).composite(layers);
    const cardPng = await canvas.png().toBuffer();
    card = await toWebp(sharp(cardPng), CARD_TARGET);
  }
  const hero = await toWebp(sharp(files[0]).resize({ width: HERO_W }), HERO_TARGET);
  return { card, hero, source: files.map((f) => path.relative(ROOT, f)).join(" + ") };
}

/** True when the loaded page is a sign-in wall or has almost no content. */
async function isWallOrBlank(page: import("playwright").Page): Promise<boolean> {
  return page.evaluate(() => {
    const lower = (s: string | null | undefined) => (s ?? "").toLowerCase();
    const hasPassword = !!document.querySelector('input[type="password"]');
    const authRe = /sign in|log in|login/;
    const authTitle =
      authRe.test(lower(document.title)) ||
      authRe.test(lower(document.querySelector("h1")?.textContent));
    const nearBlank = (document.body?.innerText ?? "").trim().length < 40;
    return hasPassword || authTitle || nearBlank;
  });
}

/**
 * Some sites open on an intro/enter screen (a near-empty page with a single
 * "view site" / "enter" control). Click through it so we capture the real
 * content. Only runs when the page has almost no text.
 */
async function passIntroGate(page: import("playwright").Page): Promise<void> {
  const found = await page.evaluate(() => {
    if (document.querySelector('input[type="password"]')) return false;
    // Exact-match phrases only, so marketing CTAs ("Start Free Trial",
    // "Explore the Gym") never match. Accessible-label duplication ("view
    // site" twice via a visually-hidden span) is tolerated. Element must be
    // visible in-viewport.
    const keys = ["viewsite", "entersite", "enter"];
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('a, button, [role="button"]'),
    );
    for (const el of els) {
      const t = (el.innerText || "").toLowerCase().replace(/[^a-z]/g, "");
      if (!keys.some((k) => t === k || t === k + k)) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) {
        el.setAttribute("data-capture-gate", "1");
        return true;
      }
    }
    return false;
  });
  if (found) {
    console.log("  intro gate detected, clicking through");
    // Trusted click via Playwright, in case the site ignores synthetic events.
    await page.click("[data-capture-gate]", { timeout: 5000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(1500);
  }
}

async function preparePage(page: import("playwright").Page, url: string): Promise<void> {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  } catch {
    console.warn(`  networkidle timed out for ${url}, continuing with loaded state`);
  }
  await page.waitForTimeout(1500);
  await passIntroGate(page);
  // Scroll to the bottom and back to trigger lazy images.
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = () => {
        y += 600;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else {
          window.scrollTo(0, 0);
          resolve();
        }
      };
      step();
    });
  });
  await page.addStyleTag({ content: HIDE_OVERLAYS_CSS });
  // Also hide small fixed elements pinned to the bottom-right corner: chat
  // launchers and back-to-top buttons that don't carry vendor class names.
  await page.evaluate(() => {
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
      const s = getComputedStyle(el);
      if (s.position !== "fixed" || s.display === "none") continue;
      const r = el.getBoundingClientRect();
      const small = r.width >= 30 && r.width <= 140 && r.height >= 30 && r.height <= 140;
      const corner = r.top > innerHeight * 0.6 && r.left > innerWidth * 0.55;
      if (small && corner) el.style.display = "none";
    }
  });
  await page.waitForTimeout(500);
}

async function captureLive(
  browser: Browser,
  url: string,
): Promise<{ card: Buffer; hero: Buffer } | "wall"> {
  const mobile = await browser.newContext({
    viewport: { width: 430, height: 716 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  try {
    await mobile.addInitScript({ content: PAGE_POLYFILL });
    const page = await mobile.newPage();
    await preparePage(page, url);
    if (await isWallOrBlank(page)) return "wall";
    const mobileShot = await page.screenshot(); // viewport, not full page
    const card = await toWebp(
      sharp(mobileShot).resize(CARD_W, CARD_H, { fit: "cover" }),
      CARD_TARGET,
    );

    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
      colorScheme: "light",
    });
    try {
      await desktop.addInitScript({ content: PAGE_POLYFILL });
      const dPage = await desktop.newPage();
      await preparePage(dPage, url);
      const desktopShot = await dPage.screenshot();
      const hero = await toWebp(sharp(desktopShot).resize({ width: HERO_W }), HERO_TARGET);
      return { card, hero };
    } finally {
      await desktop.close();
    }
  } finally {
    await mobile.close();
  }
}

function dataFlags(p: Project): string[] {
  const flags: string[] = [];
  if (!p.images) flags.push("MISSING images in projects.ts");
  if (!p.year) flags.push("MISSING year in projects.ts");
  return flags;
}

async function main() {
  const onlyIdx = process.argv.indexOf("--only");
  const only = onlyIdx > -1 ? process.argv[onlyIdx + 1] : undefined;
  const targets = only
    ? featuredProjects.filter((p) => p.slug === only)
    : featuredProjects;
  if (only && targets.length === 0) {
    console.error(`No featured project with slug "${only}".`);
    process.exit(1);
  }

  const rows: Row[] = [];
  const browser = await chromium.launch();
  try {
    for (const p of targets) {
      const flags = dataFlags(p);
      console.log(`\n${p.slug}`);
      try {
        let card: Buffer;
        let hero: Buffer;
        let source = p.liveUrl ?? "";
        let fallback: Row["fallback"] = "no";

        if (p.liveUrl && !FORCE_ASSET_SOURCES.has(p.slug)) {
          console.log(`  capturing ${p.liveUrl}`);
          const result = await captureLive(browser, p.liveUrl);
          if (result === "wall") {
            console.log("  login wall or near-blank page detected, using assets/portfolio/ fallback");
            fallback = "yes";
            ({ card, hero, source } = await composeFromSources(p.slug));
          } else {
            ({ card, hero } = result);
          }
        } else if (p.liveUrl) {
          console.log("  curated asset override, building from assets/portfolio/");
          fallback = "override";
          ({ card, hero, source } = await composeFromSources(p.slug));
        } else {
          console.log("  no liveUrl, building from assets/portfolio/");
          fallback = "-";
          ({ card, hero, source } = await composeFromSources(p.slug));
        }

        const dir = path.join(OUT_DIR, p.slug);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, "card.webp"), card);
        await writeFile(path.join(dir, "hero.webp"), hero);
        if (card.length > CARD_TARGET) flags.push(`card over ${CARD_TARGET / 1000} KB target`);
        if (hero.length > HERO_TARGET) flags.push(`hero over ${HERO_TARGET / 1000} KB target`);
        rows.push({
          slug: p.slug,
          source,
          fallback,
          card: `${card.length.toLocaleString()} B`,
          hero: `${hero.length.toLocaleString()} B`,
          flags: flags.join("; "),
        });
        console.log(`  wrote ${path.relative(ROOT, dir)}/card.webp + hero.webp`);
      } catch (err) {
        console.error(`  FAILED: ${err instanceof Error ? err.message : String(err)}`);
        rows.push({
          slug: p.slug,
          source: p.liveUrl ?? "-",
          fallback: "-",
          card: "-",
          hero: "-",
          flags: [...flags, `FAILED: ${err instanceof Error ? err.message : String(err)}`].join("; "),
        });
      }
    }
  } finally {
    await browser.close();
  }

  // Summary table. Flags column also calls out any featured project whose
  // data is missing images or year (both are required for featured entries).
  console.log("\nSummary");
  const headers: Row = { slug: "slug", source: "source", fallback: "fallback", card: "card", hero: "hero", flags: "flags" };
  const all = [headers, ...rows];
  const width = (k: keyof Row) => Math.max(...all.map((r) => r[k].length));
  for (const r of all) {
    console.log(
      [
        r.slug.padEnd(width("slug")),
        r.source.padEnd(width("source")),
        r.fallback.padEnd(width("fallback")),
        r.card.padStart(width("card")),
        r.hero.padStart(width("hero")),
        r.flags,
      ].join("  "),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
