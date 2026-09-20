// ---------------------------------------------------------------------------
// SESSION 1 RESOURCE HUB DATA
// Single source of truth for /workshop/session-1, the unlisted page behind the
// QR code and NFC tags in the room on September 25.
//
// scripts/capture-session1.ts imports this file under tsx, so keep it free of
// JSX, asset imports, and import.meta.* -- plain data only. Image paths are
// public-root strings; components prefix them with Vite's BASE_URL via
// src/lib/paths.ts.
//
// Swapping a screenshot:
//   software   -> drop a new file in assets/portfolio/, point `source` at it,
//                 run `npm run capture:session1`
//   websites   -> re-run `npm run capture:session1` (captured live from `url`)
//   Super Bowl -> drop the three phone screenshots in assets/session-1/ as
//                 superbowl-1/2/3.png and run the same command. Until then the
//                 cards render a labelled empty frame rather than a broken img.
// ---------------------------------------------------------------------------

/**
 * A screenshot slot. `image` is absent until the capture script has run; every
 * frame on the page is a fixed-aspect box, so a missing or oddly-shaped file
 * never shifts the layout.
 */
export interface Shot {
  image?: string;
}

export interface SoftwareItem extends Shot {
  id: string;
  name: string;
  /** One line under the name: what the thing is. */
  kind: string;
  body: string;
  /** The "two college students" line. Rendered in mono, under the body. */
  credit: string;
  alt: string;
  /** File under assets/portfolio/ the capture script resizes from. */
  source: string;
}

export interface WebsiteItem extends Shot {
  id: string;
  name: string;
  /** Shown as the visible link text, e.g. "hfhonline.com". */
  domain: string;
  url: string;
  blurb: string;
  alt: string;
}

export interface SuperBowlShot extends Shot {
  id: string;
  label: string;
  alt: string;
}

export interface Pillar {
  id: string;
  name: string;
  examples: string;
}

export const session1 = {
  meta: {
    title: "Session 1: AI Education | Vaelro Workshop",
    description:
      "Resources from Session 1 of the free AI workshop series with the Waupaca Area Chamber of Commerce: what we built, the Super Bowl test, your homework for October 9, and one prompt to try this week.",
    canonical: "https://vaelro.co/workshop/session-1",
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  header: {
    eyebrow: "SESSION 1 · SEPTEMBER 25, 2026",
    title: "Session 1: AI Education",
    subtitle: "AI for Your Business, Without the Overwhelm",
  },

  built: {
    eyebrow: "WHAT WE BUILT",
    heading: "All of this was built with AI.",
    softwareLabel: "Software",
    websitesLabel: "Websites",
    software: [
      {
        id: "maverick",
        name: "Maverick",
        kind: "Flight school compliance software",
        body: "Student records, flight logs, and progress against the Part 61 minimums a flight school has to prove. Live and in use at a flight school in Waupaca.",
        credit:
          "Roughly 200,000 lines of code. Built by two college students who are not software developers.",
        alt: "The Maverick admin dashboard, showing flight hours, student counts, and monthly charts",
        image: "/workshop/session-1/maverick.webp",
        source: "maverick-dashboard-portfolio.png",
      },
      {
        id: "meridian",
        name: "Meridian",
        kind: "Property management platform",
        body: "A command center for small landlords: what each property made, what it cost, which rent is missing, and what needs attention this month.",
        credit:
          "Built by the same two college students. Still not software developers.",
        alt: "The Meridian dashboard, showing portfolio income, expenses, rent collection, and upcoming reminders",
        image: "/workshop/session-1/meridian.webp",
        source: "meridian-dashboard-1.png",
      },
    ] as SoftwareItem[],
    websites: [
      {
        id: "hfh",
        name: "Health & Fitness Headquarters",
        domain: "hfhonline.com",
        url: "https://hfhonline.com",
        blurb: "A local gym, on its own domain, with inquiries going straight to the owner.",
        alt: "The Health & Fitness Headquarters website",
        image: "/workshop/session-1/site-hfh.webp",
      },
      {
        id: "uwspama",
        name: "UWSP AMA",
        domain: "uwspama.com",
        url: "https://uwspama.com",
        blurb: "The American Marketing Association student chapter at UW-Stevens Point.",
        alt: "The UWSP American Marketing Association website",
        image: "/workshop/session-1/site-uwspama.webp",
      },
      {
        id: "harvestfest",
        name: "715 Harvest Fest",
        domain: "715harvestfest.com",
        url: "https://715harvestfest.com",
        blurb: "An event site with online vendor applications that land in one organizer spreadsheet.",
        alt: "The 715 Harvest Fest website",
        image: "/workshop/session-1/site-harvestfest.webp",
      },
    ] as WebsiteItem[],
  },

  superBowl: {
    eyebrow: "THE SUPER BOWL TEST",
    heading: "Same question, three different answers.",
    intro:
      "We asked ChatGPT “who wins the next Super Bowl” three times in a row. Same tool. Three different answers.",
    /** Rendered in the empty frame until the screenshots are captured. */
    pendingLabel: "Screenshot coming",
    shots: [
      {
        id: "response-1",
        label: "Response 1",
        alt: "First ChatGPT answer to who wins the next Super Bowl",
      },
      {
        id: "response-2",
        label: "Response 2",
        alt: "Second ChatGPT answer to the same question, naming a different team",
      },
      {
        id: "response-3",
        label: "Response 3",
        alt: "Third ChatGPT answer to the same question, different again",
      },
    ] as SuperBowlShot[],
    kicker: "Facts are stable. Opinions drift. That’s why you check everything.",
  },

  homework: {
    eyebrow: "YOUR HOMEWORK FOR OCTOBER 9",
    heading: "Pick one. Write down what eats your time.",
    pillars: [
      {
        id: "staffing",
        name: "Staffing",
        examples: "Hiring, scheduling, turnover, training.",
      },
      {
        id: "marketing",
        name: "Marketing",
        examples: "Reviews, social, website, getting found.",
      },
      {
        id: "sales",
        name: "Sales",
        examples: "Quotes, follow-ups, leads that go quiet.",
      },
      {
        id: "operations",
        name: "Operations",
        examples: "Paperwork, scheduling, the stuff nobody owns.",
      },
      {
        id: "money",
        name: "Money",
        examples: "Invoices, bookkeeping, chasing payments.",
      },
    ] as Pillar[],
    instruction:
      "Pick one. Write down the 1–3 things that eat the most time. Bring the list to October 9.",
  },

  prompt: {
    eyebrow: "ONE PROMPT TO TRY THIS WEEK",
    heading: "Make it ask before it writes.",
    text: "Before you write anything, ask me questions one at a time until you have what you need, then give me a draft.",
    note: "Paste this at the end of any request to ChatGPT, Claude, or Gemini.",
    copyLabel: "Tap to copy",
    copiedLabel: "Copied",
  },

  takeaways: {
    eyebrow: "KEY TAKEAWAYS",
    heading: "Three things to remember.",
    items: [
      "AI is a fast, confident intern. Great first drafts, always check its work.",
      "You’re not late. We’re in the first inning.",
      "Learning to ask is the whole skill.",
    ],
  },

  footer: {
    heading: "See you October 9. Bring your list.",
    linkLabel: "Full series info at vaelro.co/workshop",
    linkTo: "/workshop",
  },
};

export type Session1 = typeof session1;
