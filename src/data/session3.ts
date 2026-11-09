// ---------------------------------------------------------------------------
// SESSION 3 DATA
// The Session 3 block on /workshop: the three free fixes, the Tall Pines
// build, the twelve free prompts, and the printable prompt card.
//
// The prompts, the privacy rule, the per-tool settings, the habits and the
// closing text all come from vaelro-free-prompts.json, untouched. Edit that
// file, not the components. Only the copy that is not in the JSON lives here.
//
// Plain data only, like session1.ts and session2.ts: no JSX, no asset
// imports, and no import.meta.*.
// ---------------------------------------------------------------------------

import freePromptsJson from "./vaelro-free-prompts.json";

// ---------------------------------------------------------------------------
// The "Make a copy" links. Each opens Google's copy page for a file the demo
// account shares as "Anyone with the link: Viewer"; a visitor who is signed
// out is asked to sign in to Google first. Never link the Tall Pines app,
// the script, or anything with a token in it.
//
// TALL_PINES_COPY_URL is "Tall Pines Ops, Workshop Copy", which
// makeWorkshopCopy() in the Tall Pines Apps Script project made on Nov 8, 2026.
// ---------------------------------------------------------------------------
export const CATCH_IT_ONCE_COPY_URL =
  "https://docs.google.com/forms/d/1lQWLdCqhk_JTDMr1_KYoEIYa0lCAooxHiOmIko1_2DQ/copy";
export const ONE_LOG_COPY_URL =
  "https://docs.google.com/spreadsheets/d/1cYO6jGjj_NJX9pXGMVXZsYdlHZx8PHI0owIu3afLeSA/copy";
export const TALL_PINES_COPY_URL =
  "https://docs.google.com/spreadsheets/d/1L-CTwXYGwaTXX6KIXOKFUR7fncZ-6_cv3tmiVSJZLJ0/copy";

// ---------------------------------------------------------------------------
// The printable prompt card, served from public/. The build fails if this
// points at a file that is not there. Set it to undefined to hide the
// download.
// ---------------------------------------------------------------------------
export const PROMPT_CARD_PDF = "/Vaelro_Free_AI_Prompt_Card.pdf" as
  | string
  | undefined;

// ---------------------------------------------------------------------------
// The JSON's shape. Kept here so a typo in the JSON fails `tsc`, not the page.
// ---------------------------------------------------------------------------
export interface ToolStep {
  /** Empty for a plain note line under the labelled steps. */
  label: string;
  text: string;
}

export interface ToolSettings {
  id: string;
  name: string;
  plan: string;
  steps: ToolStep[];
}

export interface PromptGroup {
  id: string;
  label: string;
  blurb: string;
}

export interface FreePrompt {
  id: number;
  group: string;
  title: string;
  solves: string;
  /** What the Copy button puts on the clipboard, exactly as written. */
  prompt: string;
  fill_in: string;
  you_get: string;
  then: string;
}

export interface Habit {
  title: string;
  text: string;
}

export interface FreePrompts {
  version: string;
  title: string;
  subtitle: string;
  /** ISO date, YYYY-MM-DD. Shown in the small print at the end. */
  settings_checked_on: string;
  rule: string;
  rule_detail: string;
  how_to_use: string;
  tools: ToolSettings[];
  limits_note: string;
  groups: PromptGroup[];
  prompts: FreePrompt[];
  habits: Habit[];
  always: string;
  closing: { heading: string; text: string; cta: string };
  fine_print: string;
}

export const freePrompts: FreePrompts = freePromptsJson;

export interface FreeFix {
  id: string;
  title: string;
  summary: string;
  /** Rendered as small labelled tags above the steps, when present. */
  listLabel?: string;
  list?: string[];
  steps: string[];
  link?: { label: string; href: string | undefined; event: string };
}

export const session3 = {
  /** The text link under the hero's body, to #session-3. */
  heroLink: "Session 3: the free versions and the prompts",

  eyebrow: "Session 3 · Friday, November 6",

  freeVersions: {
    heading: "The free versions",
    intro:
      "Three fixes for the problems the room raised most. Each one fits in a lunch break and uses tools you already have.",
    fixes: [
      {
        id: "catch-it-once",
        title: "Catch it once",
        summary:
          "Every call is written down once, in the same shape, in one place.",
        listLabel: "The same eight questions on every call",
        list: [
          "Name",
          "Phone",
          "Address",
          "What they need",
          "Preferred date",
          "Who took the call",
          "How they found us",
          "Notes",
        ],
        steps: [
          "Ask the same eight questions on every call, in the same order.",
          "Build those eight as a Google Form on your phone. Make every field required.",
          "In the form's Responses tab, link it to one Google Sheet. Every call lands there in the same columns.",
        ],
        link: {
          label: "Make a copy",
          href: CATCH_IT_ONCE_COPY_URL,
          event: "session3_copy_form",
        },
      },
      {
        id: "one-log",
        title: "One log, every form",
        summary:
          "One spreadsheet holds the facts every office asks for, so each form is a copy, not a hunt.",
        listLabel: "Fixed columns",
        list: [
          "Date",
          "What",
          "Who",
          "Hours",
          "Miles",
          "Amount",
          "Receipt link",
        ],
        steps: [
          "Make one spreadsheet with these fixed columns, and keep them the same from week to week.",
          "Fill it in for twenty minutes at the same time every week.",
          "Photograph every receipt into one folder, and paste each photo's link in the receipt column.",
        ],
        link: {
          label: "Make a copy",
          href: ONE_LOG_COPY_URL,
          event: "session3_copy_one_log",
        },
      },
      {
        id: "never-drop-a-follow-up",
        title: "Never drop a follow-up",
        summary:
          "Quotes, posts and review asks stop depending on someone remembering.",
        steps: [
          "Put a \"next follow-up\" date on every quote you send.",
          "Write a week of posts in one sitting, then schedule them for free in Meta Business Suite.",
          "Make a review card with a QR code to your review link, and hand one over with every invoice.",
        ],
      },
    ] as FreeFix[],
  },

  // The whole demo system, right under the three free versions. The email
  // address in `closing` becomes a mailto link.
  tallPines: {
    eyebrow: "The full system",
    heading: "The Tall Pines build, as-is",
    intro:
      "This is a copy of the system we demoed on November 6: the sheet, the forms and the scripts behind them, built for Tall Pines Lawn & Landscape, a made-up company. It's here so you can see how it works under the hood.",
    notesLabel: "A few honest notes:",
    notes: [
      "It won't run on its own. The automatic emails and reminders need to be switched on and pointed at your own accounts, and Google will show a warning the first time you allow the scripts. That's normal for a custom tool.",
      "It's built for a landscaper. Your business will need different questions, columns and messages.",
      "It's provided as-is, with no support. Free to use in your own business. Please don't resell it.",
    ],
    closing:
      "If you'd rather have it set up and running for your business, in your own Google account, that's what we do. Email hello@vaelro.co.",
    buttonLabel: "Make a copy of the Tall Pines build",
    href: TALL_PINES_COPY_URL,
    event: "session3_copy_tall_pines",
  },

  prompts: {
    eyebrow: "Free prompts",
    ruleLabel: "The rule",
    howToUseLabel: "How to use them",
    beforeHeading: "Before you type anything",
    beforeIntro:
      "Turn off training on whichever tool you use. Tap a tool to see the steps.",
    copyAllLabel: "Copy all twelve",
    copyAllDone: "Copied all twelve",
    copyAllFailed:
      "Copying all twelve did not work in this browser. Each prompt still has its own Copy button.",
    promptLabel: "Prompt",
    solvesLabel: "Solves",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    selectedLabel: "Selected. Press copy.",
    detailsLabel: "Fill in, you get, then",
    fillInLabel: "Fill in",
    youGetLabel: "You get",
    thenLabel: "Then",
    habitsHeading: "Five habits that make any prompt better",
    alwaysLabel: "Always",
  },

  downloads: {
    eyebrow: "Downloads",
    heading: "Print it, pin it up",
    promptCardLabel: "Prompt card (PDF)",
    promptCardLine: "Five pages: the privacy settings, the twelve prompts, the five habits.",
  },

  smallPrint: "Settings checked on {date}.",
};
