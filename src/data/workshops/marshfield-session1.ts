// ---------------------------------------------------------------------------
// MARSHFIELD SESSION 1 RECAP DATA
// Single source of truth for /workshop/marshfield/session-1, the recap for
// the people who were in the room on November 17, linked from the attendee
// card on /workshop. Built from the Session 1 slideshow: the section copy
// below is the slides' text, as written. Change it here, not in the
// components.
//
// Like the Waupaca session pages it stays out of search (noindex, plus an
// X-Robots-Tag header in netlify.toml).
//
// Plain data only (scripts/test-workshop.ts imports it under tsx). Image
// paths are public-root strings; components prefix them with Vite's BASE_URL.
// ---------------------------------------------------------------------------

import { session1 } from "../session1";
import type { PromptItem, SuperBowlShot } from "../session1";

/** The three answers from the Super Bowl test, the same captures the Waupaca page uses. */
const [try1, try2, try3] = session1.superBowl.shots;

export interface Titled {
  title: string;
  text: string;
}

export interface Named {
  name: string;
  text: string;
}

export const marshfieldSession1 = {
  meta: {
    title: "Marshfield Session 1: Where Your Time Goes | Vaelro",
    description:
      "Notes from Session 1 of the Marshfield AI workshop: how to think about AI, where it saves time today, two minutes of setup, and one prompt to try this week.",
    canonical: "https://vaelro.co/workshop/marshfield/session-1",
    ogImage: "https://vaelro.co/og-image.jpg",
  },

  header: {
    date: "Tuesday, November 17",
    title: "Session 1: Where your time goes",
    speaker: "With Owen Lencki, co-founder of Vaelro.",
  },

  // A
  thinkOfIt: {
    eyebrow: "How to think about it",
    heading: "A fast, confident intern.",
    points: [
      "Sounds just as sure when it's guessing.",
      "Great first drafts. Never the final draft.",
      "Always check its work.",
      "Context is king. Tell it more, get more.",
      "It aims to please. Ask it to argue the other side.",
    ],
  },

  // B
  superBowl: {
    eyebrow: "The Super Bowl test",
    heading: "Same question, same tool, three tries.",
    cases: [
      {
        label: "Factual",
        question: "Who won the last five Super Bowls?",
        answer: "Same answer. Every single time.",
      },
      {
        label: "Open-ended",
        question: "Who wins next year?",
        tries: [
          "Try 1: Rams.",
          "Try 2: Bills.",
          "Try 3: \"Rams, Bills, Ravens or Seahawks.\"",
        ],
        answer: "Three different picks. It never said it was guessing.",
      },
    ],
    takeaway: "The more open the question, the more you need to check the answer.",
    pendingLabel: session1.superBowl.pendingLabel,
    enlargeLabel: session1.superBowl.enlargeLabel,
    shots: [
      { ...try1, label: "Try 1" },
      { ...try2, label: "Try 2" },
      { ...try3, label: "Try 3" },
    ] as SuperBowlShot[],
  },

  // C
  savesTime: {
    eyebrow: "Where it saves time today",
    heading: "30 minutes to 30 seconds.",
    items: [
      { name: "Emails and quotes", text: "A first draft in 30 seconds, not 30 minutes." },
      { name: "Review replies", text: "Turn a 1-star review into a calm, professional reply." },
      { name: "Job posts", text: "A posting that sounds like your business, not a template." },
      { name: "Social media", text: "A week of captions in ten minutes." },
      { name: "Documents", text: "Paste a contract or policy, get plain English back." },
      { name: "Follow-ups", text: "Draft the email you keep meaning to send." },
    ] as Named[],
  },

  // D
  youDecide: {
    eyebrow: "Who does what",
    heading: "AI drafts. You decide.",
    goodAt: {
      label: "Good at",
      items: [
        "First drafts.",
        "Sorting a messy inbox.",
        "Summarizing.",
        "Reading handwriting.",
        "Helping build tools, fast.",
      ],
    },
    keepYours: {
      label: "Keep this yours",
      items: [
        "Your trade.",
        "Your judgment.",
        "Your numbers.",
        "Your customers' trust.",
      ],
    },
    note: "Most of what we build doesn't run on AI at all. AI helps us build it fast.",
  },

  // E
  setup: {
    eyebrow: "Privacy",
    heading: "Two minutes of setup.",
    rule: "Never paste a customer's name, phone number, address or card number into a free AI tool.",
    tools: [
      { name: "ChatGPT", text: "Turn off \"Improve the model for everyone.\"" },
      { name: "Claude", text: "Turn off \"Help improve our AI models.\"" },
      { name: "Gemini", text: "Turn off \"Keep Activity.\"" },
      {
        name: "Copilot",
        text: "The new app has no switch. Microsoft says chats aren't used to train its core models.",
      },
    ] as Named[],
    smallPrint:
      "Setting names as of November 2026. Apps rename these, so look for the one about improving or training the model.",
  },

  // F
  learnToAsk: {
    eyebrow: "How to ask",
    heading: "Learning to ask is the whole skill.",
    body: "Most people try it once, get a bad answer, and quit. The bad answer was the question.",
    tryFirstLabel: "Try this first",
    prompt: {
      id: "learn-to-use-you",
      name: "Try this first",
      prompt: "Help me learn how to use you.",
    } as PromptItem,
    after: "It will interview you about your business, then teach itself to you. Works in every tool.",
  },

  // G
  habits: {
    eyebrow: "Habits",
    heading: "Five habits that fix most bad answers.",
    items: [
      {
        title: "Tell it about your business first.",
        text: "Let it interview you once. Paste that summary at the top of every chat.",
      },
      {
        title: "Say who it's for.",
        text: "\"For my crew\" and \"for a first-time customer\" get different drafts.",
      },
      {
        title: "Paste your own writing.",
        text: "Two or three emails you've sent. It will start to sound like you.",
      },
      {
        title: "Ask for a short draft, then react.",
        text: "\"Shorter.\" \"Warmer.\" \"Less salesy.\"",
      },
      {
        title: "Say the length and the shape.",
        text: "\"One text.\" \"Three bullets.\" \"Under a page.\"",
      },
    ] as Titled[],
  },

  // H
  onePrompt: {
    eyebrow: "Prompts",
    heading: "One prompt to try this week",
    prompt: {
      id: "questions-first",
      name: "One prompt to try this week",
      prompt:
        "Before you write anything, ask me questions one at a time until you have what you need. Then give me a draft.",
      note: "Paste it at the end of any request, in any tool.",
    } as PromptItem,
  },

  // I
  next: {
    eyebrow: "After Session 1",
    heading: "What happens next.",
    steps: [
      {
        title: "We read every packet.",
        text: "Looking for the patterns across every business in the room.",
      },
      {
        title: "We build the fixes.",
        text: "Free do-it-yourself options, and done-for-you ones.",
      },
      {
        title: "December 8: We show you.",
        text: "Walkthroughs built from what you wrote.",
      },
    ] as Titled[],
    upload: {
      text: "Upload photos of pages 2, 3 and 4 of your worksheet by Friday, November 20.",
      label: "Upload your worksheet",
    },
    summary:
      "Your summary arrives a few days before December 8, with a link to book a free follow-up call.",
  },

  footer: {
    eyebrow: "Next session",
    line: "Session 2 is Tuesday, December 8, 10:30 a.m. to noon, at the MACCI office.",
    email: "hello@vaelro.co",
    /** Subject line of the email the address opens. Not shown on the page. */
    emailSubject: "Marshfield Session 1",
  },
};

export type MarshfieldSession1 = typeof marshfieldSession1;
