// ---------------------------------------------------------------------------
// prepare-portraits.ts
// Re-runnable portrait build for /workshop. Crops each source to a 4:5 focal
// framing and writes WebP renditions to public/workshop/.
//
// Run:  npm run prepare:portraits
//
// Renditions are only ever emitted at widths the crop actually contains, so
// nothing is ever upscaled. Casey's source is a two-up conference photo, which
// is why his crop is small and ships as a single rendition; replacing him later
// is a swap of assets/workshop/casey-source.jpeg plus new numbers here.
//
// Netlify never runs this; the generated WebPs are committed.
// ---------------------------------------------------------------------------

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "workshop");

const QUALITY = 82;

interface PortraitSpec {
  id: string;
  source: string;
  /** 4:5 focal window in source pixels. */
  crop: { left: number; top: number; width: number; height: number };
  /** Output widths. The largest must not exceed the crop width. */
  widths: number[];
}

const PORTRAITS: PortraitSpec[] = [
  {
    // Same file the About page uses; framed tighter for a portrait card.
    id: "owen",
    source: "src/assets/team/owen.jpg",
    crop: { left: 95, top: 45, width: 520, height: 650 },
    widths: [320, 520],
  },
  {
    id: "liam",
    source: "src/assets/team/liam.jpg",
    crop: { left: 335, top: 185, width: 440, height: 550 },
    widths: [320, 440],
  },
  {
    // Right-hand frame of the two-up, cropped to Casey alone.
    id: "casey",
    source: "assets/workshop/casey-source.jpeg",
    crop: { left: 612, top: 20, width: 328, height: 410 },
    widths: [328],
  },
];

/** The Chamber's own logo, held ready for the day co-branding is confirmed. */
const PARTNER_LOGO = {
  source: "assets/workshop/chamber-logo-source.webp",
  out: "chamber-logo.webp",
  width: 600,
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const portrait of PORTRAITS) {
    const { crop, widths } = portrait;
    const ratio = crop.width / crop.height;
    if (Math.abs(ratio - 0.8) > 0.005) {
      throw new Error(`${portrait.id}: crop is ${ratio.toFixed(3)}, not 4:5`);
    }
    const largest = Math.max(...widths);
    if (largest > crop.width) {
      throw new Error(
        `${portrait.id}: ${largest}w would upscale a ${crop.width}px crop`,
      );
    }

    for (const width of widths) {
      const buffer = await sharp(path.join(ROOT, portrait.source))
        .extract(crop)
        .resize({ width, height: Math.round(width * 1.25) })
        .webp({ quality: QUALITY })
        .toBuffer();
      const file = `${portrait.id}-${width}.webp`;
      await writeFile(path.join(OUT_DIR, file), buffer);
      console.log(
        `  wrote public/workshop/${file}  ${(buffer.length / 1024).toFixed(1)} kB`,
      );
    }
  }

  const logo = await sharp(path.join(ROOT, PARTNER_LOGO.source))
    .resize({ width: PARTNER_LOGO.width })
    .webp({ quality: QUALITY })
    .toBuffer();
  await writeFile(path.join(OUT_DIR, PARTNER_LOGO.out), logo);
  console.log(
    `  wrote public/workshop/${PARTNER_LOGO.out}  ${(logo.length / 1024).toFixed(1)} kB`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
