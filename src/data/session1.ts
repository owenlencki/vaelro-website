// ---------------------------------------------------------------------------
// SESSION 1 RESOURCE PAGE DATA
// Single source of truth for /workshop/session-1, the attendee page behind the
// card at the top of /workshop. (The NFC tags and QR codes on the tables open
// /workshop, and that card is the way in.)
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

// ---------------------------------------------------------------------------
// OWEN: the slides. Put the PDF at public/workshop/session-1/slides.pdf and set
// this to "/workshop/session-1/slides.pdf". The download button on the Session
// 1 page and "and the slides" on the /workshop card then appear on their own.
// The build fails if this points at a file that is not there.
// ---------------------------------------------------------------------------
export const SESSION1_SLIDES_PDF = undefined as string | undefined;

/**
 * A screenshot slot. `image` is absent until the capture script has run; every
 * frame on the page is a fixed-aspect box, so a missing or oddly-shaped file
 * never shifts the layout.
 */
export interface Shot {
  image?: string;
}

/** Everything in the showcase links to its case study at /work/<slug>. */
export interface SoftwareItem extends Shot {
  id: string;
  slug: string;
  name: string;
  /** One line over the name: what the thing is. */
  kind: string;
  body: string;
  /** The "two college students" line, in mono under the body. */
  credit: string;
  alt: string;
  /** File under assets/portfolio/ the capture script resizes from. */
  source: string;
}

export interface WebsiteItem extends Shot {
  id: string;
  slug: string;
  name: string;
  /** The live site. The capture script screenshots it from here. */
  url: string;
  blurb: string;
  alt: string;
}

export interface SuperBowlShot extends Shot {
  id: string;
  label: string;
  alt: string;
  /**
   * The file's pixel size. The capture script only ever scales these
   * proportionally, so the ratio stays true after a re-run. It reserves the
   * frame before the image loads and decides which shots get cropped.
   */
  width: number;
  height: number;
}

export interface PromptItem {
  /** Stable id, sent to GA as prompt_id. */
  id: string;
  name: string;
  /** What the Copy button puts on the clipboard, bar the date fill below. */
  prompt: string;
  /** The one-line reason, when the copy deck gives one. */
  why?: string;
  /**
   * The prompt carries `tryThis.datePlaceholder`. It is shown as a
   * placeholder, and Copy swaps in the reader's own date, so nobody has to
   * type it on a phone.
   */
  fillsDate?: boolean;
}

export interface Caution {
  id: string;
  /** The first sentence, set as the card's heading. */
  title: string;
  body: string;
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
      "Resources from Session 1 of the free AI workshop series with the Waupaca Area Chamber of Commerce: three prompts to try this week, four honest cautions, and your homework for October 9.",
    canonical: "https://vaelro.co/workshop/session-1",
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  header: {
    date: "Friday, September 25",
    title: "Session 1: AI Education",
    speaker:
      "With guest speaker Casey Plunkett, CEO of Secure AI, former IBM and Oracle.",
    slidesLabel: "Download the slides (PDF)",
  },

  idea: {
    eyebrow: "The one idea",
    lead: "Think of AI as a fast, confident intern.",
    rest: "Great first drafts. Always check its work.",
  },

  superBowl: {
    eyebrow: "The Super Bowl test",
    heading: "Same question, three answers",
    line: "Facts stay the same. Opinions drift. The more open the question, the more you check.",
    /** Rendered in the empty frame until the screenshots are captured. */
    pendingLabel: "Screenshot coming",
    /** Every shot is small on a phone; tapping opens the full-size file. */
    enlargeLabel: "Tap to enlarge",
    shots: [
      {
        id: "response-1",
        label: "Response 1",
        image: "/workshop/session-1/superbowl-1.webp",
        width: 1040,
        height: 1148,
        alt: "ChatGPT's first answer: the five past Super Bowl champions, then the Los Angeles Rams named only as the current betting favorite, with no prediction made.",
      },
      {
        id: "response-2",
        label: "Response 2",
        image: "/workshop/session-1/superbowl-2.webp",
        width: 592,
        height: 1362,
        alt: "ChatGPT's second answer: the same five past champions, then an NFL standings table and an outright pick of the Buffalo Bills.",
      },
      {
        id: "response-3",
        label: "Response 3",
        image: "/workshop/session-1/superbowl-3.webp",
        width: 438,
        height: 1288,
        alt: "ChatGPT's third answer: the same five past champions, then a box score and standings, ending with the Rams, Bills, Ravens and Seahawks as a leading group and no pick at all.",
      },
    ] as SuperBowlShot[],
  },

  tryThis: {
    eyebrow: "Prompts",
    heading: "Three things to try this week",
    copyLabel: "Copy prompt",
    copiedLabel: "Copied",
    /** Only if the browser refuses the clipboard, which is rare. */
    copyFailed: "Your browser blocked the copy. Press and hold the prompt to copy it.",
    datePlaceholder: "[today's date]",
    dateNote: "Copy fills in today's date for you.",
    items: [
      {
        id: "pull-prompting",
        name: "Pull prompting",
        prompt:
          "Before you write anything, ask me questions one at a time until you have what you need.",
        why: "It interviews you instead of guessing.",
      },
      {
        id: "tell-it-the-date",
        name: "Tell it the date",
        prompt: "Today is [today's date]. Look up the most recent information.",
        why: "It does not know what day it is unless you say so.",
        fillsDate: true,
      },
      {
        id: "easy-way",
        name: "Ask for the easy way",
        prompt: "What is the most efficient way to do this?",
        why: "Often it knows a shortcut you didn't.",
      },
    ] as PromptItem[],
    bonus: {
      id: "learn-to-use-you",
      name: "Bonus",
      prompt: "Help me learn how to use you.",
      why: "Works in every tool.",
    } as PromptItem,
  },

  cautions: {
    eyebrow: "Cautions",
    heading: "Four honest cautions",
    items: [
      {
        id: "free-tools",
        title: "Free tools can learn from what you paste.",
        body: "Do not put client data, contracts, or sensitive info into free versions.",
      },
      {
        id: "confident",
        title: "It makes things up with confidence.",
        body: "Check facts and numbers.",
      },
      {
        id: "generic",
        title: "Customers can smell generic AI.",
        body: "Edit before you publish.",
      },
      {
        id: "scams",
        title: "The scams got smarter.",
        body: "AI can clone a voice from seconds of audio.",
      },
    ] as Caution[],
    rule: {
      label: "The one rule",
      text: "Surprise money request? Hang up. Call back on the number you already have.",
    },
  },

  homework: {
    eyebrow: "Homework for October 9",
    heading: "Where does your week leak?",
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
      "Pick one. Over the next two weeks, write down the one to three things in it that eat the most time. Bring the list.",
  },

  built: {
    eyebrow: "Our work",
    heading: "What two college students built with AI",
    caseStudyLabel: "See the case study",
    /** The label over each website card; software cards use their `kind`. */
    websiteKind: "Website",
    moreLabel: "See all our work",
    moreTo: "/#work",
    software: [
      {
        id: "maverick",
        slug: "maverick",
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
        slug: "meridian",
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
        slug: "health-fitness-headquarters",
        name: "Health & Fitness Headquarters",
        url: "https://hfhonline.com",
        blurb: "A local gym, on its own domain, with inquiries going straight to the owner.",
        alt: "The Health & Fitness Headquarters website",
        image: "/workshop/session-1/site-hfh.webp",
      },
      {
        id: "harvestfest",
        slug: "715-harvest-fest",
        name: "715 Harvest Fest",
        url: "https://715harvestfest.com",
        blurb: "An event site with online vendor applications that land in one organizer spreadsheet.",
        alt: "The 715 Harvest Fest website",
        image: "/workshop/session-1/site-harvestfest.webp",
      },
    ] as WebsiteItem[],
  },

  feedback: {
    eyebrow: "Feedback",
    heading: "How did we do?",
    intro: "Only the first question is required.",
    rating: {
      legend: "Was this worth your morning?",
      low: "Not really",
      high: "Absolutely",
      error: "Pick a number from 1 to 5.",
    },
    octoberWish: "What would make October 9 worth coming back for?",
    referral: {
      label: "Know anyone else who should be at these?",
      helper: "Their name and business.",
    },
    name: "Name",
    business: "Business",
    email: {
      label: "Email",
      invalid: "That email doesn't look right. Mind double-checking?",
      neededForTools: "Add your email so we can send them.",
    },
    tools: "Send me the free tools when they're ready",
    submitLabel: "Send my feedback",
    sendingLabel: "Sending…",
    privacy: "We never share your information.",
    success: "Thanks. See you October 9.",
    failure:
      "That didn't go through. Try again in a moment, or email hello@vaelro.co.",
  },

  footer: {
    eyebrow: "Next session",
    line: "Friday, October 9, 8:00 AM, same room. Bring your list.",
    email: "hello@vaelro.co",
  },
};

export type Session1 = typeof session1;
