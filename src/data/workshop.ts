// ---------------------------------------------------------------------------
// WORKSHOP DATA
// Single source of truth for /workshop, the Home hero tease pill, the nav dot,
// and scripts/test-workshop.ts (which imports this file under tsx, so keep it
// free of JSX, asset imports, and import.meta.* -- plain data only).
//
// Everything on the page reads from here. No copy lives in components. The
// page moves itself through the three dates from Date.now(); recaps, the venue
// address, and the Chamber logo are edits to this file and nothing else.
// (Chamber registration has closed, so the page carries no register buttons.)
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

export interface HeardItem {
  tag: string;
  text: string;
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

/** A text link on the resources card under the timeline on /workshop. */
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
  // Asset is committed at /workshop/chamber-logo.webp. Set this string once
  // Jeff confirms co-branding and the logo slot renders itself.
  partnerLogo: undefined as string | undefined,

  venue: {
    name: "Waupaca Business Center",
    detail: "Inside the Waupaca Recreation Center on School Street",
    address: "407 School St, Waupaca, WI 54981",
    city: "Waupaca, WI",
    parkingNote: "", // fill later; renders only when non-empty
    /** Wherever the venue is named on the page, it links here. */
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Waupaca%20Recreation%20Center%2C%20407%20School%20St%2C%20Waupaca%2C%20WI%2054981&query_place_id=ChIJhx3a3Nh0AYgR0U06VZP9CH8",
  },

  time: "8:00 AM",
  contactEmail: "hello@vaelro.co",

  meta: {
    // Search snippet: title under 60 characters, description 120 to 158.
    title: "Session 3: Solutions for Waupaca Businesses | Vaelro",
    description:
      "Session 3 is Friday, November 6: live demos for the top three problems local businesses shared, with a free do-it-yourself option. Registration is closed.",
    ogTitle: "Session 3: Live Demos for the Top Three Problems",
    ogDescription:
      "Hosted with the Waupaca Area Chamber of Commerce. Friday, November 6 at 8:00 AM. A free do-it-yourself option and a done-for-you version of each. Registration is closed.",
    canonical: "https://vaelro.co/workshop",
    // The site's own OG image until a workshop-specific card exists.
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  hero: {
    eyebrow:
      "SESSION 3 · FRIDAY, NOVEMBER 6 · WITH THE WAUPACA AREA CHAMBER OF COMMERCE",
    headingLines: ["Three Problems From the Room,", "Two Ways to Fix Each"],
    subhead:
      "In Sessions 1 and 2, local business owners told us where their time goes. On Friday, November 6, we show live demos for the top three problems: a free do-it-yourself option and a done-for-you version of each.",
    /** Sits under the subhead. Registration is closed; the page asks for nothing. */
    registrationLine:
      "Registration for Session 3 is closed. If you signed up, we will see you there.",
    /** Rendered as one plain mono row: the featured session's date, then these. */
    detailVenue: "Waupaca Business Center, inside the Rec Center",
  },

  // What the room told us, in general terms only. No business or person is
  // named here, and nothing is quoted from the slides or packets.
  whatWeHeard: {
    eyebrow: "WHAT WE HEARD FROM LOCAL BUSINESSES",
    heading: "The same few problems kept coming up.",
    body: "Across Sessions 1 and 2, owners described the same kinds of daily drags. Three came up most, and those are the three we built live demos for.",
    items: [
      {
        tag: "01",
        text: "Typing the same information into more than one place, and getting it wrong a little more each time.",
      },
      {
        tag: "02",
        text: "Marketing and follow-ups slipping when the day gets busy.",
      },
      {
        tag: "03",
        text: "Paperwork that every office asks for in a different shape.",
      },
    ] as HeardItem[],
    footer: "No business or person is named here. Attendee details stay with Vaelro.",
  },

  // Text only, by design: the call is offered to people who attend, so there is
  // no button and no link here.
  gameplan: {
    eyebrow: "FOR SESSION 3 ATTENDEES",
    heading: "After Session 3: a free Gameplan call.",
    body: "Each business that attends Session 3 is offered a free Gameplan call afterward, a chance to talk through what would give you your time back. Nothing is sold at any session.",
  },

  series: {
    eyebrow: "THE SERIES",
    heading: "Two sessions done. One to go.",
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
    heading: "Two local founders and one experienced expert.",
  },

  faqSection: {
    eyebrow: "STRAIGHT ANSWERS",
    heading: "Questions you're probably asking.",
  },

  chamberBand: {
    text: "Hosted in partnership with the Waupaca Area Chamber of Commerce.",
    smallText:
      "Questions about Session 3 go to Owen and Liam at hello@vaelro.co.",
  },

  // The sign-off card at the bottom of the page. Its heading is the next
  // session line (formatNextSessionLine), the same one the hero shows. No
  // button: registration is closed.
  closing: {
    detailLine: "Session 3 · Waupaca Business Center",
    links: [
      {
        label: "Questions? Email hello@vaelro.co",
        href: "mailto:hello@vaelro.co?subject=Session%203%20question",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Wrapped state: what the page swaps to once Session 3 is completed. There is
  // no call to action here by design. The page becomes the record of what
  // happened: the closing card says thanks and the Home pill disappears.
  // -------------------------------------------------------------------------
  postSeries: {
    heroSubhead: "The series wrapped on November 6. Here's what we covered.",
    closingHeading: "Thanks for coming.",
    closingBody: "The series wrapped on November 6. Questions? Email hello@vaelro.co.",
  },

  // The Home hero pill. {number}, {longDate}, and {date} are the next
  // session's number, "Friday, November 6", and "Nov 6".
  pill: {
    full: "Session {number} · {longDate}",
    short: "Session {number} · {date}",
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
    heading: "From people who live here.",
    body: [
      "Vaelro is a web and automation agency in Waupaca. Owen and Liam grew up here and build websites and systems that give local business owners their time back. This series is education, start to finish: plain English, real examples, and honest answers to the questions you actually have. If you leave with a clearer head and one thing to try, it did its job.",
    ] as string[],
  },

  /** Testing only. Must be undefined in commits. */
  stageOverride: undefined as SeriesPhase | undefined,

  /**
  * The resources card under the timeline on /workshop. It is for people who
  * were in the room: text links to the Session 1 and Session 2 pages. It has
  * no upload button; the packet deadline has passed.
  */
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
      blurb:
        "Pure education. We covered how to think of AI as a fast, confident intern, why the way you ask matters, and why most businesses are still early. The homework was to bring one to three things that eat your week.",
      leaders: "Casey Plunkett with Owen and Liam",
    },
    {
      number: 2,
      slug: "pain-point-workshop",
      title: "Pain Point Workshop",
      start: "2026-10-09T08:00:00-05:00",
      durationMinutes: 60,
      blurb:
        "Hands-on. Owners worked through a six-part packet: where their hours go, which tools they use, what is actually painful, and what they would do with the time back.",
      leaders: "Owen and Liam",
    },
    {
      number: 3,
      slug: "solutions-and-demos",
      title: "Solutions and Demos",
      start: "2026-11-06T08:00:00-06:00",
      durationMinutes: 60,
      blurb:
        "We are bringing live demos built from what the room wrote down. Each of the top three problems gets a free do-it-yourself option and a done-for-you version. Nothing is sold at any session.",
      leaders: "Owen and Liam",
    },
  ] as WorkshopSession[],

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

  faqs: [
    {
      id: "what-is-ai",
      question: "What is AI, in one sentence?",
      answer:
        "Session 1 covered this, and here is the short version: software that has learned from huge numbers of examples, so it can write, sort, predict, and handle steps that used to need a person doing them by hand. You've used it for years without noticing, every time your phone finished a sentence or your email caught spam.",
    },
    {
      id: "all-three",
      question: "I missed the first two sessions. Does Session 3 still make sense?",
      answer:
        "For registered attendees, yes. Session 3 makes sense on its own. Registration for Session 3 is closed. If you signed up, we will see you there.",
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
        "Nothing required. A pen is handy for notes, and no laptop is needed.",
    },
    {
      id: "free",
      question: "Is it really free?",
      answer:
        "Free for registered attendees. Nothing is sold at the workshops, and attendee information stays with Vaelro. Owen and Liam run it because this is their community, and the Chamber is hosting it for its members.",
    },
    {
      id: "who-for",
      question: "Who is it for?",
      answer:
        "Local business owners and the people who run the day to day: restaurants, contractors, salons, dental and medical offices, real estate, landscaping, auto shops, retail, and professional practices.",
    },
    {
      id: "gameplan",
      question: "What is a Gameplan call?",
      answer:
        "A free call offered to each business that attends Session 3, a chance to talk through where to start.",
    },
    {
      id: "privacy",
      question: "What happens to what I share?",
      answer: "Attendee information stays with Vaelro.",
    },
    {
      // The second sentence is replaced by venue.address and venue.parkingNote
      // once those are filled in. See resolveFaqAnswer in src/lib/workshop.ts.
      id: "where",
      question: "Where is it?",
      answer:
        "The Waupaca Business Center, inside the Waupaca Recreation Center. Same room as Session 2.",
    },
  ] as Faq[],
};

export type Workshop = typeof workshop;
