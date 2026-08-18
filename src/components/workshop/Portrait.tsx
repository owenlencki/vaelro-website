import type { Speaker } from "../../data/workshop";
import { withBase } from "../../lib/paths";

interface PortraitProps {
  speaker: Speaker;
  /** Layout hint for the browser's srcset pick. */
  sizes: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * A speaker portrait at a fixed 4:5 crop. Renditions come from the data file
 * and are only ever the real widths on disk, so nothing is upscaled: Casey's
 * source is a cropped conference photo and ships with a single, smaller
 * rendition until the clean headshot replaces it.
 */
export default function Portrait({
  speaker,
  sizes,
  className,
  loading = "lazy",
}: PortraitProps) {
  const largest = speaker.photo[speaker.photo.length - 1];

  return (
    <img
      src={withBase(largest.src)}
      srcSet={speaker.photo
        .map((p) => `${withBase(p.src)} ${p.width}w`)
        .join(", ")}
      sizes={sizes}
      alt={speaker.photoAlt}
      width={largest.width}
      height={Math.round(largest.width * 1.25)}
      loading={loading}
      decoding="async"
      className={`aspect-[4/5] w-full bg-peach-100 object-cover object-top ${
        className ?? ""
      }`}
    />
  );
}
