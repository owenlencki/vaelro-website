// ---------------------------------------------------------------------------
// WORKSHOP DATA
// Single source of truth for /workshop, the Home hero tease pill, the nav dot,
// and scripts/test-workshop.ts (which imports this file under tsx, so keep it
// free of JSX, asset imports, and import.meta.* -- plain data only).
//
// The series wrapped on November 6, so /workshop is now the record of it: a
// thank you, then everything that was promised, free to copy. The Session 3
// material (the free versions, the Tall Pines build, the prompts) lives in
// session3.ts. The sessions stay here because the Home pill and the nav dot
// still read their dates (both hide once the series is over) and the page's
// schema describes the series from them.
//
// Image paths are plain public-root strings ("/workshop/..."); components
// prefix them with Vite's BASE_URL via src/lib/paths.ts.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// The packet upload form, its own site with its own repo. Uploads are closed
// and no page on this site links to it any more; the constant stays because
// the vaelro.co/upload redirect in netlify.toml carries this same address and
// its comment points here.
// ---------------------------------------------------------------------------
export const PACKET_UPLOAD_URL = "https://vaelro-packet-upload.netlify.app";

export type SessionStatus = "upcoming" | "next" | "today" | "completed";
export type SeriesPhase = "upcoming" | "in-progress" | "complete";

export interface WorkshopSession {
  number: 1 | 2 | 3;
  slug: string;
  title: string;
  /** ISO with an explicit Central offset. Nov 6 is after the Nov 1 DST change. */
  start: string;
  durationMinutes: number;
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

/** A text link on the Session 1 and 2 card on /workshop. */
export interface AttendeeCardLink {
  label: string;
  to: string;
  /** Sent to GA when the link is tapped, for the links that have an event. */
  event?: string;
}

export const workshop = {
  title: "AI for Your Business, Without the Overwhelm",
  partner: "Waupaca Area Chamber of Commerce",
  partnerUrl: "https://www.waupacachamber.com",

  /** Where the sessions were held. Only the page's schema reads this now. */
  venue: {
    name: "Waupaca Business Center",
    address: "407 School St, Waupaca, WI 54981",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Waupaca%20Recreation%20Center%2C%20407%20School%20St%2C%20Waupaca%2C%20WI%2054981&query_place_id=ChIJhx3a3Nh0AYgR0U06VZP9CH8",
  },

  meta: {
    // Search snippet: title under 60 characters, description 120 to 158.
    title: "AI Workshop Series: Free Templates and Prompts | Vaelro",
    description:
      "The Waupaca Area Chamber AI workshop series is a wrap. Copy the free intake form, the One Log, twelve prompts and the full Tall Pines build.",
    ogTitle: "The workshop series is a wrap.",
    ogDescription:
      "Everything from the Waupaca Area Chamber AI workshops, free to copy and use in your own business.",
    canonical: "https://vaelro.co/workshop",
    // The site's own OG image until a workshop-specific card exists.
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  // The top of the page. The email address in the body becomes a mailto link.
  hero: {
    heading: "The workshop series is a wrap.",
    body: "Thank you to everyone who came out to the Waupaca Area Chamber AI workshops this fall, and to the Waupaca Area Chamber of Commerce for the room, the coffee and the invitation. Everything we promised is below, free to copy and use in your own business. Questions about any of it? Email us at hello@vaelro.co.",
  },

  // The page's last card. The email address is the link.
  closing: {
    heading: "Questions about anything from the series?",
    body: "Email hello@vaelro.co.",
  },

  // The Home hero pill. {number}, {longDate}, and {date} are the next
  // session's number, "Friday, November 6", and "Nov 6". It hides once the
  // series is over.
  pill: {
    full: "Session {number} · {longDate}",
    short: "Session {number} · {date}",
  },

  /** Testing only. Must be undefined in commits. */
  stageOverride: undefined as SeriesPhase | undefined,

  /** The card near the bottom of /workshop: text links to the Session 1 and Session 2 pages. */
  attendeeCard: {
    heading: "Were you at Session 1 or Session 2?",
    links: [
      {
        label: "Session 1 prompts and homework",
        to: "/workshop/session-1",
        event: "session1_card_click",
      },
      {
        label: "Session 2 free prompts and resources",
        to: "/workshop/session-2",
      },
    ] as AttendeeCardLink[],
  },

  sessions: [
    {
      number: 1,
      slug: "ai-education",
      title: "AI Education",
      start: "2026-09-25T08:00:00-05:00",
      durationMinutes: 60,
    },
    {
      number: 2,
      slug: "pain-point-workshop",
      title: "Pain Point Workshop",
      start: "2026-10-09T08:00:00-05:00",
      durationMinutes: 60,
    },
    {
      number: 3,
      slug: "solutions",
      title: "Solutions",
      start: "2026-11-06T08:00:00-06:00",
      durationMinutes: 60,
    },
  ] as WorkshopSession[],

  // The hero's portrait strip and the Session 1 page read these.
  speakers: [
    {
      id: "owen",
      name: "Owen Lencki",
      role: "Co-founder, Vaelro",
      bio: "Owen leads client relationships and builds Vaelro's websites and applications. He grew up in a Waupaca business family and studies marketing at UW-Stevens Point. He runs the room across all three sessions.",
      photo: [
        { src: "/workshop/owen-320.webp", width: 320 },
        { src: "/workshop/owen-520.webp", width: 520 },
      ],
      photoAlt: "Owen Lencki, co-founder of Vaelro",
    },
    {
      id: "liam",
      name: "Liam Bloedow",
      role: "Co-founder, Vaelro",
      bio: "Liam builds the automations and systems Vaelro delivers. Waupaca High School graduate. In Session 2 he sat down next to owners to help map their workflows.",
      photo: [
        { src: "/workshop/liam-320.webp", width: 320 },
        { src: "/workshop/liam-440.webp", width: 440 },
      ],
      photoAlt: "Liam Bloedow, co-founder of Vaelro",
    },
    {
      id: "casey",
      name: "Casey Plunkett",
      role: "Guest speaker, Session 1 · CEO, Secure AI",
      bio: "Former IBM and Oracle executive with more than 600 technology engagements worldwide, and the author of a book on AI in business. A Waupaca-area local who brought the idea for this series to Owen and Liam and offered to help make it happen.",
      // One rendition only: the source is a cropped conference photo. Swapping
      // in the clean headshot is a file replacement plus a width bump here.
      photo: [{ src: "/workshop/casey-328.webp", width: 328 }],
      photoAlt: "Casey Plunkett, CEO of Secure AI",
    },
  ] as Speaker[],
};

export type Workshop = typeof workshop;
