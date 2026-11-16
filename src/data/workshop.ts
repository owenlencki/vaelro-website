// ---------------------------------------------------------------------------
// WORKSHOP DATA: THE SHARED PIECES
// What every Chamber series has in common: the shapes, the people who lead
// them, and the packet upload form. Each series is its own file in
// src/data/workshops/ (marshfield.ts, waupaca.ts), and
// src/data/workshops/index.ts says which one is current: /workshop leads with
// it, and the Home pill and the nav dot follow its dates.
//
// scripts/test-workshop.ts imports these files under tsx, so keep them free
// of JSX, asset imports, and import.meta.* -- plain data only.
//
// Image paths are plain public-root strings ("/workshop/..."); components
// prefix them with Vite's BASE_URL via src/lib/paths.ts.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// The packet upload form, its own site with its own repo. The Marshfield
// attendee card on /workshop and the Marshfield Session 1 recap link straight
// to it: Session 1 worksheets are due Friday, November 20. The vaelro.co/upload
// redirect in netlify.toml carries this same address, so change the two
// together. Link here, never to /upload: the prerender would crawl /upload as
// a page and fail the build.
// ---------------------------------------------------------------------------
export const PACKET_UPLOAD_URL = "https://vaelro-packet-upload.netlify.app";

export type SessionStatus = "upcoming" | "next" | "today" | "completed";
export type SeriesPhase = "upcoming" | "in-progress" | "complete";

export interface WorkshopSession {
  number: 1 | 2 | 3;
  slug: string;
  title: string;
  /**
   * ISO with an explicit Central offset: -05:00 before the first Sunday of
   * November, -06:00 after it. scripts/test-workshop.ts checks each one
   * against America/Chicago.
   */
  start: string;
  durationMinutes: number;
  /** One or two plain sentences for the sessions block. Archived series have none. */
  blurb?: string;
}

/** One rendition of a portrait. Widths are real pixel widths, never upscaled. */
export interface PhotoSource {
  src: string;
  width: number;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Ordered small to large; the component builds a srcset from these. */
  photo: PhotoSource[];
  photoAlt: string;
}

/** A person, before a series gives them the bio that fits it. */
export type Person = Omit<Speaker, "bio">;

/** A text link on an attendee card. */
export interface AttendeeCardLink {
  label: string;
  to: string;
  /** Sent to GA when the link is tapped, for the links that have an event. */
  event?: string;
}

/**
 * Everyone who has led a session. Bios live with each series, because the
 * last line of each says what the person did in that series.
 */
export const people = {
  owen: {
    id: "owen",
    name: "Owen Lencki",
    role: "Co-founder, Vaelro",
    photo: [
      { src: "/workshop/owen-320.webp", width: 320 },
      { src: "/workshop/owen-520.webp", width: 520 },
    ],
    photoAlt: "Owen Lencki, co-founder of Vaelro",
  },
  liam: {
    id: "liam",
    name: "Liam Bloedow",
    role: "Co-founder, Vaelro",
    photo: [
      { src: "/workshop/liam-320.webp", width: 320 },
      { src: "/workshop/liam-440.webp", width: 440 },
    ],
    photoAlt: "Liam Bloedow, co-founder of Vaelro",
  },
  casey: {
    id: "casey",
    name: "Casey Plunkett",
    role: "Guest speaker, Session 1 · CEO, Secure AI",
    // One rendition only: the source is a cropped conference photo. Swapping
    // in the clean headshot is a file replacement plus a width bump here.
    photo: [{ src: "/workshop/casey-328.webp", width: 328 }],
    photoAlt: "Casey Plunkett, CEO of Secure AI",
  },
} satisfies Record<string, Person>;
