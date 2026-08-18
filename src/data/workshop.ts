// ---------------------------------------------------------------------------
// WORKSHOP DATA
// Single source of truth for /workshop, the Home hero tease pill, the nav dot,
// and scripts/test-workshop.ts (which imports this file under tsx, so keep it
// free of JSX, asset imports, and import.meta.* -- plain data only).
//
// Everything on the page reads from here. No copy lives in components. The
// page moves itself through the three dates from Date.now(); recaps, the
// registration link, the venue address, and the Chamber logo are edits to this
// file and nothing else.
//
// Image paths are plain public-root strings ("/workshop/..."); components
// prefix them with Vite's BASE_URL via src/lib/paths.ts.
// ---------------------------------------------------------------------------

export type SessionStatus = "upcoming" | "next" | "today" | "completed";
export type SeriesPhase = "upcoming" | "in-progress" | "complete";

export interface SessionRecap {
  /** 2 to 4 short lines. The recap block stays hidden until this exists. */
  lines: string[];
  photo?: string;
  photoAlt?: string;
  link?: { label: string; href: string };
}

export interface WorkshopSession {
  number: 1 | 2 | 3;
  slug: string;
  title: string;
  /** ISO with an explicit Central offset. Nov 6 is after the Nov 1 DST change. */
  start: string;
  durationMinutes: number;
  blurb: string;
  leaders: string;
  recap?: SessionRecap;
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

export interface Outcome {
  tag: string;
  heading: string;
  body: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/** A prompt card in the "free to use today" band. */
export interface PromptCard {
  /** Stable id, sent to GA as prompt_id. */
  id: string;
  label: string;
  title: string;
  /** The prompt itself. This is what the copy button puts on the clipboard. */
  prompt: string;
}

export const workshop = {
  title: "AI for Your Business, Without the Overwhelm",
  partner: "Waupaca Area Chamber of Commerce",
  partnerUrl: "https://www.waupacachamber.com",
  // Asset is committed at /workshop/chamber-logo.webp. Set this string once
  // Jeff confirms co-branding and the logo slot renders itself.
  partnerLogo: undefined as string | undefined,

  registration: {
    // PLACEHOLDER: the Chamber's public events calendar (verified live). Swap
    // for the ChamberMaster event link when Jeff sends it, and set isFinal.
    url: "https://www.waupacachamber.com/events/eventcalendar",
    isFinal: false,
    label: "Register Through the Chamber",
  },

  venue: {
    name: "Waupaca Business Center",
    detail: "at the Waupaca Recreation Center", // OWEN TO CONFIRM
    address: "", // fill when confirmed; renders only when non-empty
    city: "Waupaca, WI",
    parkingNote: "", // fill later; renders only when non-empty
  },

  time: "8:00 AM",
  capacity: 25,
  contactEmail: "hello@vaelro.co",

  meta: {
    title: "Free AI Workshop Series for Waupaca Business Owners | Vaelro",
    description:
      "Three free Friday mornings with the Waupaca Area Chamber of Commerce: what AI actually is, where your business loses time, and real solutions built from your answers. Limited to 25 businesses.",
    ogTitle: "AI for Your Business, Without the Overwhelm",
    ogDescription:
      "Free three-session workshop series with the Waupaca Area Chamber of Commerce. Fridays at 8:00 AM, September 25, October 9, November 6. Limited to 25 businesses.",
    canonical: "https://vaelro.co/workshop",
    // v1 ships the site's existing OG image. The workshop-specific card and
    // the crawler-facing head are v1.1, after this merges.
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  hero: {
    eyebrow:
      "FREE WORKSHOP SERIES · WITH THE WAUPACA AREA CHAMBER OF COMMERCE",
    headingLines: ["AI for Your Business,", "Without the Overwhelm"],
    subhead:
      "Three free Friday morning sessions for local business owners. Learn what AI actually is, map where your business loses time, and leave with real solutions built around your operation.",
    trustLine:
      "Led by Owen Lencki and Liam Bloedow, co-founders of Vaelro. Session 1 features guest speaker Casey Plunkett, CEO of Secure AI and a former IBM and Oracle executive.",
    /** Rendered as one plain mono row. Dates are derived from `sessions`. */
    detailLead: "Fridays",
    detailVenue: "Waupaca Business Center",
    detailFree: "Free",
    microcopyPending:
      "Registration is handled by the Waupaca Area Chamber of Commerce. If you don't see the series on their events calendar yet, email hello@vaelro.co and we'll send you the link the moment it's live.",
    microcopyFinal:
      "Registration is handled by the Waupaca Area Chamber of Commerce. Space is limited and we expect this to fill.",
  },

  outcomes: {
    eyebrow: "WHAT YOU'LL LEAVE WITH",
    heading: "Three mornings, three things you walk out with.",
    items: [
      {
        tag: "SESSION 1",
        heading: "A clear, non-scary understanding of AI.",
        body: "What it actually is, the different kinds, and why it matters for a business your size. Plain English, with time for your questions.",
      },
      {
        tag: "SESSION 2",
        heading: "A map of where your business loses time.",
        body: "A guided worksheet you fill out in the room, with Owen and Liam helping. Worth the hour whether you ever use AI or not.",
      },
      {
        tag: "SESSION 3",
        heading: "Real solutions and a clear next step.",
        body: "Live demos built from what the group wrote down in Session 2. Free options you can use yourself, and fully built systems that run without you.",
      },
    ] as Outcome[],
    closingLine:
      "No technical background needed. Bring a pen. Each session stands on its own, but the series builds.",
  },

  series: {
    eyebrow: "THE SERIES",
    heading: "Three Fridays. One hour each. Built around your business.",
    recapLabel: "WHAT HAPPENED",
    badges: {
      next: "Next up",
      upcoming: "Upcoming",
      today: "Today at 8:00 AM",
      completed: "Completed",
    },
  },

  speakersSection: {
    eyebrow: "WHO'S LEADING IT",
    heading:
      "Two local founders and one guest speaker worth showing up early for.",
  },

  faqSection: {
    eyebrow: "STRAIGHT ANSWERS",
    heading: "Questions you're probably asking.",
  },

  chamberBand: {
    text: "Presented in partnership with the Waupaca Area Chamber of Commerce.",
    smallText:
      "Event registration and promotion are handled by the Chamber. Questions about the sessions themselves go to Owen and Liam at hello@vaelro.co.",
  },

  closing: {
    heading: "Reserve your seat before it fills.",
    detailLine:
      "Fridays at 8:00 AM · Waupaca Business Center · Free · Limited to 25 businesses",
    links: [
      {
        label: "Questions? Email hello@vaelro.co",
        href: "mailto:hello@vaelro.co?subject=Workshop%20series%20question",
      },
      {
        label: "Missed a seat? Email us and we'll tell you if one opens.",
        href: "mailto:hello@vaelro.co?subject=Workshop%20series%3A%20add%20me%20to%20the%20list",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Wrapped state: everything the page swaps to once Session 3 is completed.
  // Owen refines this copy before November 6.
  // -------------------------------------------------------------------------
  postSeries: {
    ctaLabel: "Book a Free Gameplan Call",
    ctaHref: "/contact",
    eventCardLabel: "FALL 2026 SERIES",
    microcopy:
      "A free 15 to 20 minute conversation about your specific business. We'll name the top two or three places you could get time back. No pitch, no obligation.",
    closingHeading: "Want this built around your business?",
    closingDetailLine:
      "A free 15 to 20 minute Gameplan call. We'll name the top two or three places you could get time back. No pitch, no obligation.",
  },

  pill: {
    upcoming: {
      full: "Free AI workshop series with the Waupaca Chamber · Starts Sep 25",
      short: "Free AI workshop series · Sep 25",
    },
    inProgress: {
      // {date} is replaced with the next session's short date, e.g. "Oct 9".
      full: "Free AI workshop series · Next session {date}",
      short: "Workshop series · Next: {date}",
    },
    complete: {
      full: "The workshop series has wrapped · Book a free Gameplan call",
      short: "Book a free Gameplan call",
    },
  },

  // -------------------------------------------------------------------------
  // OWEN: paste the copy deck's three prompt cards and the note line here.
  // The section renders itself as soon as `items` is non-empty and stays
  // hidden until then. Nothing in the component needs to change.
  // -------------------------------------------------------------------------
  prompts: {
    eyebrow: "FREE TO USE TODAY",
    heading: "Free to use today",
    items: [] as PromptCard[],
    note: "",
    copyLabel: "Copy prompt",
    copiedLabel: "Copied",
  },

  // -------------------------------------------------------------------------
  // OWEN: paste the "Why we're doing this" block here. Renders when non-empty.
  // -------------------------------------------------------------------------
  whyBand: {
    eyebrow: "WHY WE'RE DOING THIS",
    heading: "Why we're doing this",
    body: [] as string[],
  },

  /** Testing only. Must be undefined in commits. */
  stageOverride: undefined as SeriesPhase | undefined,

  sessions: [
    {
      number: 1,
      slug: "ai-education",
      title: "AI Education",
      start: "2026-09-25T08:00:00-05:00",
      durationMinutes: 60,
      blurb:
        "What AI actually is, the different types, and why it matters for a business of any size. Guest speaker Casey Plunkett breaks it down in plain English, then the floor opens for questions.",
      leaders: "Casey Plunkett with Owen and Liam",
    },
    {
      number: 2,
      slug: "pain-point-workshop",
      title: "Pain Point Workshop",
      start: "2026-10-09T08:00:00-05:00",
      durationMinutes: 60,
      blurb:
        "Hands-on. Map your biggest time drains, workflows, and tools with a guided worksheet while Owen and Liam work the room. Valuable whether you ever use AI or not.",
      leaders: "Owen and Liam",
    },
    {
      number: 3,
      slug: "solutions-and-demos",
      title: "Solutions and Demos",
      start: "2026-11-06T08:00:00-06:00",
      durationMinutes: 60,
      blurb:
        "Real tools and live demos built from your answers in Session 2. Free options you can use yourself, plus fully built systems. Then a clear next step.",
      leaders: "Owen and Liam",
    },
  ] as WorkshopSession[],

  speakers: [
    {
      id: "owen",
      name: "Owen Lencki",
      role: "Co-founder, Vaelro",
      bio: "Owen leads sales, strategy, and client relationships at Vaelro. He grew up around Waupaca entrepreneurs and hosts all three sessions.",
      photo: [
        { src: "/workshop/owen-320.webp", width: 320 },
        { src: "/workshop/owen-640.webp", width: 640 },
      ],
      photoAlt: "Owen Lencki, co-founder of Vaelro",
    },
    {
      id: "liam",
      name: "Liam Bloedow",
      role: "Co-founder, Vaelro",
      bio: "Liam builds the automations and systems Vaelro delivers. Waupaca High School graduate. In Session 2 he's the one sitting down next to you to help map your workflows.",
      photo: [
        { src: "/workshop/liam-320.webp", width: 320 },
        { src: "/workshop/liam-630.webp", width: 630 },
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

  faqs: [
    {
      id: "sales-pitch",
      question: "Is this a sales pitch?",
      answer:
        "No. The sessions are education and hands-on work, and nothing is for sale in the room. The only offer, at the very end of Session 3, is an optional free conversation about your specific business.",
    },
    {
      id: "all-three",
      question: "Do I have to attend all three?",
      answer:
        "No. Each session stands on its own, but they build on each other, and Session 3 is built from what the group writes down in Session 2. If you can only make one, come to the one that fits.",
    },
    {
      id: "not-technical",
      question: "I'm not technical. Will I be lost?",
      answer:
        "That's exactly who this is for. No technical background needed. If you can use your phone, you'll be fine.",
    },
    {
      id: "bring",
      question: "Do I need to bring anything?",
      answer:
        "A pen. Session 2 uses a printed worksheet we provide. No laptop required.",
    },
    {
      id: "free",
      question: "Is it really free?",
      answer:
        "Yes. Free to attend, presented with the Waupaca Area Chamber of Commerce. Registration is limited to 25 businesses so the working sessions stay hands-on.",
    },
    {
      id: "who-for",
      question: "Who is this for?",
      answer:
        "Local business owners and the people who run the day-to-day: restaurants, contractors, salons, dental and medical offices, real estate, landscaping, auto shops, retail, and professional practices. If repetitive work eats your week, this is for you.",
    },
    {
      // The second sentence is replaced by venue.address and venue.parkingNote
      // once those are filled in. See resolveFaqAnswer in src/lib/workshop.ts.
      id: "where",
      question: "Where is it, and where do I park?",
      answer:
        "The Waupaca Business Center in Waupaca. We'll add the room and parking details here before Session 1.",
    },
    {
      id: "fills-up",
      question: "What if it fills up?",
      answer:
        "It might, so register early. If you miss a seat, email hello@vaelro.co and we'll let you know if a spot opens or when the next series is scheduled.",
    },
  ] as Faq[],
};

export type Workshop = typeof workshop;
