// ---------------------------------------------------------------------------
// SESSION 2 RESOURCE PAGE DATA
// Single source of truth for /workshop/session-2, the attendee page linked
// from the card at the top of /workshop. It exists to get packet pages
// uploaded; the free resources come second.
//
// Plain data only, like session1.ts: no JSX, no asset imports, and no
// import.meta.*. The upload button's address is not here: it is
// PACKET_UPLOAD_URL in src/data/workshop.ts, shared with the /workshop card.
// ---------------------------------------------------------------------------

import type { PromptItem } from "./session1";

// ---------------------------------------------------------------------------
// OWEN: the blank packet. Put the PDF at public/workshop/session-2/packet.pdf
// and set this to "/workshop/session-2/packet.pdf". The download button on the
// Session 2 page and the line under it then appear on their own. The build
// fails if this points at a file that is not there.
// ---------------------------------------------------------------------------
export const SESSION2_PACKET_PDF = undefined as string | undefined;

export const session2 = {
  meta: {
    title: "Session 2: Pain Point Workshop | Vaelro Workshop",
    description:
      "Session 2 of the free AI workshop series with the Waupaca Area Chamber: upload your packet pages, grab three free prompts, and see what happens November 6.",
    canonical: "https://vaelro.co/workshop/session-2",
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  header: {
    date: "Friday, October 9",
    title: "Session 2: Pain Point Workshop",
    line: "With Owen and Liam.",
  },

  upload: {
    eyebrow: "Your packet",
    heading: "Send us your pages",
    steps: [
      "Tap the button below.",
      "Enter your name, business, and email.",
      "Tap Take Photo for each page, 2 through 6.",
      "Tap Submit Packet.",
    ],
    buttonLabel: "Upload my packet",
    lateLine: "Need more time? Take it home and upload by Wednesday, October 14.",
    /** The address inside this sentence becomes the mailto link. */
    fallbackLine: "Upload not working? Email your photos to hello@vaelro.co.",
    fallbackEmail: "hello@vaelro.co",
    fallbackSubject: "Session 2 packet",
    privacy:
      "Your pages go to a private folder that only Owen and Liam can open. We never share your information.",
  },

  next: {
    eyebrow: "What happens next",
    heading: "November 6 is built from what you wrote",
    steps: [
      "We read every uploaded packet ourselves.",
      "We look for the problems that show up across the room.",
      "On November 6 we bring the fixes: a free version you can do yourself, and a live example of the same job running on its own.",
    ],
    // OWEN: set this to "" and the line leaves the page.
    summaryLine:
      "We'll also send you a short summary of your answers before November 6.",
  },

  resources: {
    eyebrow: "Free resources",
    heading: "Three prompts to use on your own packet",
    intro:
      "Paste one into ChatGPT, Claude, or whatever tool you use. Fill in the brackets with what you wrote in your packet.",
    /** The Copy button puts `prompt` on the clipboard exactly as written. */
    prompts: [
      {
        id: "biggest-leak",
        name: "Find your biggest leak",
        prompt:
          "Here is roughly where my hours go in a normal week: [paste your list from page 2]. Ask me questions one at a time until you understand my business. Then tell me the three tasks most worth fixing first, and why.",
        why: "It ranks your time drains instead of leaving you with a list.",
      },
      {
        id: "task-to-checklist",
        name: "Turn a task into a checklist",
        prompt:
          "I want to write down how I do [task] so someone else could do it the same way. Ask me about each step, one question at a time. Then write it as a numbered checklist I can print.",
        why: "A written process is the first step to handing a job off.",
      },
      {
        id: "put-a-number-on-it",
        name: "Put a number on it",
        prompt:
          "I spend about [hours] hours a week on [task], and an hour of my time is worth about $[amount]. Work out what that costs me in a year and show the math. Then list three ways a business my size could cut that time, starting with the cheapest.",
        why: "Seeing the yearly cost makes it easier to decide what is worth fixing.",
      },
    ] as PromptItem[],
    /** Under the prompt cards. */
    note: "Leave out customer names and anything private. Free tools can learn from what you paste. And check its math.",
    quickMath: {
      label: "The quick math",
      text: "Hours a week × what an hour of your time is worth × 50 weeks. Five hours a week at $50 an hour is $12,500 a year.",
    },
    /** Rendered only once SESSION2_PACKET_PDF above is set. */
    packet: {
      label: "Download a blank packet (PDF)",
      line: "Missed the session, or want a clean copy? Print it, fill it out, and upload your pages by Wednesday, October 14.",
    },
    session1Link: {
      label: "Session 1: prompts and cautions",
      to: "/workshop/session-1",
    },
  },

  footer: {
    eyebrow: "Next session",
    line: "Friday, November 6, 8:00 AM, same room. We bring the fixes.",
    email: "hello@vaelro.co",
    /** Subject line of the email the address opens. Not shown on the page. */
    emailSubject: "Workshop Session 2",
  },
};

export type Session2 = typeof session2;
