// ---------------------------------------------------------------------------
// SESSION 2 RESOURCE PAGE DATA
// Single source of truth for /workshop/session-2, the attendee page linked
// from the resources card on /workshop. Packet uploads are closed, so the page
// carries what Session 2 led to (Session 3) and the free prompts.
//
// Plain data only, like session1.ts: no JSX, no asset imports, and no
// import.meta.*.
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
      "Session 2 of the AI workshop series with the Waupaca Area Chamber: three free prompts to use on your own packet, and what comes next on November 6.",
    canonical: "https://vaelro.co/workshop/session-2",
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  header: {
    date: "Friday, October 9",
    title: "Session 2: Pain Point Workshop",
    line: "With Owen and Liam.",
  },

  next: {
    eyebrow: "What happens next",
    heading: "November 6 starts from what the room wrote down",
    steps: [
      "We looked for the problems that showed up across the room.",
      "On November 6 we share what the room wrote down and show practical ways to start getting that time back.",
    ],
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
      line: "Missed the session, or want a clean copy? Print it and fill it out.",
    },
    session1Link: {
      label: "Session 1: prompts and cautions",
      to: "/workshop/session-1",
    },
  },

  footer: {
    eyebrow: "Next session",
    line: "Session 3 is Friday, November 6, 8:00 AM, same room. Registration for Session 3 is closed. If you signed up, we will see you there.",
    email: "hello@vaelro.co",
    /** Subject line of the email the address opens. Not shown on the page. */
    emailSubject: "Workshop Session 2",
  },
};

export type Session2 = typeof session2;
