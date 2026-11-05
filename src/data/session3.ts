// ---------------------------------------------------------------------------
// SESSION 3 DATA
// The Session 3 block on /workshop: the three free fixes, the twelve free
// prompts, the printable prompt card, and the closing line.
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
// OWEN: paste the two Google template links here. Each link appears under its
// fix on its own once its string is set; until then the steps show without it.
// ---------------------------------------------------------------------------
export const CATCH_IT_ONCE_FORM_URL = undefined as string | undefined;
export const ONE_LOG_TEMPLATE_URL = undefined as string | undefined;

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

// ---------------------------------------------------------------------------
// OWEN: flip to true once the series is over. The "Next session" card at the
// bottom of /workshop and the hero's registration line both become
// `finishedLine`. Nothing else on the page changes.
// ---------------------------------------------------------------------------
export const SERIES_FINISHED = false as boolean;

export const session3 = {
  finishedLine:
    "The series has finished. Everything from all three sessions is on this page.",

  /** The text link under the hero's registration line, to #session-3. */
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
          label: "Open the form template",
          href: CATCH_IT_ONCE_FORM_URL,
          event: "session3_form_template",
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
          label: "Open the One Log Template",
          href: ONE_LOG_TEMPLATE_URL,
          event: "session3_log_template",
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
