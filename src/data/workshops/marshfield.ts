// ---------------------------------------------------------------------------
// MARSHFIELD SERIES (CURRENT)
// Two free sessions with the Marshfield Area Chamber of Commerce and Industry
// (MACCI), November 17 and December 8, 2026. /workshop leads with this series,
// and the Home pill and the nav dot follow its dates (see ./index.ts).
// Registration ran through MACCI, so nothing here asks anyone to sign up.
//
// Statuses ("Next up", "Today at 10:30 a.m.", "Completed") come from the
// dates alone, so nothing needs changing between sessions.
//
// Plain data only (scripts/test-workshop.ts imports it under tsx).
// ---------------------------------------------------------------------------

import { people } from "../workshop";
import type { AttendeeCardLink, SeriesPhase, SessionStatus, WorkshopSession } from "../workshop";

export const marshfield = {
  path: "/workshop",
  title: "AI for Your Business, Without the Overwhelm",
  partner: "Marshfield Area Chamber of Commerce and Industry",
  partnerUrl: "https://www.marshfieldchamber.com",

  // The MACCI office in downtown Marshfield. Public listings disagree on the
  // street (S or N Central Ave); marshfieldchamber.com's own footer and Contact
  // Us page both say "700 South Central Ave, Marshfield, WI 54449" (checked
  // November 16, 2026). The page and the schema both read this.
  venue: {
    name: "Marshfield Area Chamber of Commerce and Industry",
    streetAddress: "700 South Central Ave",
    locality: "Marshfield",
    region: "WI",
    postalCode: "54449",
  },

  /** Both sessions. scripts/test-workshop.ts checks it against each start and duration. */
  time: "10:30 a.m. to noon",

  meta: {
    // Search snippet: title under 60 characters, description 120 to 158.
    title: "Marshfield AI Workshops for Business Owners | Vaelro",
    description:
      "Two free AI sessions for Marshfield-area business owners with MACCI: where your time goes on November 17, and how to get it back on December 8.",
    ogTitle: "AI for Your Business, Without the Overwhelm",
    ogDescription:
      "Two free sessions with the Marshfield Area Chamber of Commerce and Industry. Tuesday, November 17 and Tuesday, December 8, 10:30 a.m. to noon.",
    canonical: "https://vaelro.co/workshop",
    // The site's own OG image until a workshop-specific card exists.
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  hero: {
    eyebrow: "Marshfield Area Chamber of Commerce and Industry",
    heading: "AI for Your Business, Without the Overwhelm",
    body: "Two free sessions for Marshfield-area business owners. Session 1 looks at where your time goes and what AI can realistically do. Session 2 shows solutions built from what the room wrote down.",
  },

  /**
   * The one small line right under the hero, for anyone arriving from an old
   * Waupaca link (the printed prompt card says vaelro.co/workshop).
   */
  waupacaNote: {
    text: "Here for the Waupaca workshop materials?",
    linkLabel: "They're here.",
  },

  sessionsBlock: {
    eyebrow: "The sessions",
    heading: "Two Tuesdays at the MACCI office",
    venueLine: "700 South Central Ave, in downtown Marshfield.",
    badges: {
      next: "Next up",
      upcoming: "Upcoming",
      today: "Today at 10:30 a.m.",
      completed: "Completed",
    } satisfies Record<SessionStatus, string>,
  },

  leader: {
    eyebrow: "Who's leading it",
    speaker: {
      ...people.owen,
      bio: "Owen leads client relationships and builds Vaelro's websites and applications. He grew up in a Waupaca business family and studies marketing at UW-Stevens Point. He leads both Marshfield sessions.",
    },
  },

  /** For the people who were in the room. The upload button opens PACKET_UPLOAD_URL. */
  attendeeCard: {
    heading: "Were you at Session 1?",
    upload: {
      text: "Upload photos of pages 2, 3 and 4 of your worksheet by Friday, November 20.",
      label: "Upload your worksheet",
    },
    summary:
      "Your summary arrives a few days before December 8, with a link to book a free follow-up call.",
    links: [
      {
        label: "Session 1 recap",
        to: "/workshop/marshfield/session-1",
        event: "marshfield_recap_click",
      },
    ] as AttendeeCardLink[],
  },

  pastWorkshops: {
    heading: "Past workshops",
  },

  // The page's last card. The email address is the link.
  closing: {
    heading: "Questions?",
    body: "Email hello@vaelro.co.",
  },

  // The Home hero pill. {number}, {longDate}, and {date} are the next
  // session's number, "Tuesday, November 17", and "Nov 17". It hides once the
  // series is over.
  pill: {
    full: "Session {number} · {longDate}",
    short: "Session {number} · {date}",
  },

  /** Testing only. Must be undefined in commits. */
  stageOverride: undefined as SeriesPhase | undefined,

  sessions: [
    {
      number: 1,
      slug: "where-your-time-goes",
      title: "Where your time goes",
      start: "2026-11-17T10:30:00-06:00",
      durationMinutes: 90,
      blurb:
        "What AI can realistically do, then a short worksheet on where your week actually goes.",
    },
    {
      number: 2,
      slug: "how-to-get-it-back",
      title: "How to get it back",
      start: "2026-12-08T10:30:00-06:00",
      durationMinutes: 90,
      blurb:
        "Solutions to the room's most common problems. A free version you can do yourself, and a built version.",
    },
  ] as WorkshopSession[],
};

export type MarshfieldSeries = typeof marshfield;
