// ---------------------------------------------------------------------------
// test-workshop.ts
// Pins the workshop date logic at fixed moments for the current series
// (Marshfield): its statuses, the Home pill and the nav dot, before, on and
// between the session days and after December 8. Then checks the approved
// copy, links and page rules for /workshop, the Marshfield Session 1 recap,
// and the Waupaca archive at /workshop/waupaca.
//
// Run:  npm run test:workshop
//
// TZ is forced to Asia/Tokyo first: every displayed string must come out in
// Central time regardless of where the visitor (or this process) sits.
// ---------------------------------------------------------------------------

process.env.TZ = "Asia/Tokyo";

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PACKET_UPLOAD_URL } from "../src/data/workshop";
import type { WorkshopSession } from "../src/data/workshop";
import { currentSeries, pastSeries } from "../src/data/workshops";
import { marshfield } from "../src/data/workshops/marshfield";
import { marshfieldSession1 } from "../src/data/workshops/marshfield-session1";
import { waupaca } from "../src/data/workshops/waupaca";
import { session1 } from "../src/data/session1";
import { session2 } from "../src/data/session2";
import {
  CATCH_IT_ONCE_COPY_URL,
  ONE_LOG_COPY_URL,
  TALL_PINES_COPY_URL,
  freePrompts,
  session3,
} from "../src/data/session3";
import {
  buildSessionEventsSchema,
  buildWorkshopSchema,
  formatClockTime,
  formatLongDate,
  formatSessionDateLine,
  formatShortDate,
  getNextSession,
  getPillCopy,
  getSeriesPhase,
  getSessionEnd,
  getSessionStatuses,
  isSession3Anchor,
} from "../src/lib/workshop";

let failures = 0;

function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ok    ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${name}`);
    console.log(`        ${(error as Error).message.split("\n")[0]}`);
  }
}

/** Every string anywhere in a data object, for exact-copy checks. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

/** What the Home pill and the nav dot read: both show until the series is complete. */
function pillAndDotShow(now: number): boolean {
  return (
    getSeriesPhase(currentSeries.sessions, now, currentSeries.stageOverride) !==
    "complete"
  );
}

/** The pill's two strings at a moment, or null when it is hidden. */
function pillAt(now: number) {
  if (!pillAndDotShow(now)) return null;
  const next = getNextSession(currentSeries.sessions, now);
  return next ? getPillCopy(currentSeries.pill, next) : null;
}

const sessions = currentSeries.sessions;
const at = (iso: string) => Date.parse(iso);

// ---------------------------------------------------------------------------
console.log("\nThe current series");
check("/workshop leads with Marshfield", () => {
  assert.equal(currentSeries, marshfield);
  assert.equal(currentSeries.path, "/workshop");
});
check("Waupaca is the one past series, at /workshop/waupaca", () => {
  assert.deepEqual(
    pastSeries.map((s) => s.path),
    ["/workshop/waupaca"],
  );
});
check("stageOverride is unset in the committed data file", () => {
  assert.equal(currentSeries.stageOverride, undefined);
});

// ---------------------------------------------------------------------------
console.log("\nMon, Nov 16, noon CT: the day before Session 1");
{
  const now = at("2026-11-16T12:00:00-06:00");
  check("phase is upcoming", () => {
    assert.equal(getSeriesPhase(sessions, now), "upcoming");
  });
  check("Session 1 is next up, Session 2 upcoming", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["next", "upcoming"]);
  });
  check("the pill names Session 1 and the nav dot shows", () => {
    assert.deepEqual(pillAt(now), {
      full: "Session 1 · Tuesday, November 17",
      short: "Session 1 · Nov 17",
    });
    assert.equal(pillAndDotShow(now), true);
  });
}

console.log("\nTue, Nov 17, 9:00 AM CT: Session 1 day, before it starts");
{
  const now = at("2026-11-17T09:00:00-06:00");
  check("phase is still upcoming", () => {
    assert.equal(getSeriesPhase(sessions, now), "upcoming");
  });
  check("Session 1 reads today, Session 2 upcoming", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["today", "upcoming"]);
  });
}

console.log("\nTue, Nov 17, 11:15 AM CT: during Session 1");
{
  const now = at("2026-11-17T11:15:00-06:00");
  check("phase is in-progress", () => {
    assert.equal(getSeriesPhase(sessions, now), "in-progress");
  });
  check("Session 1 keeps today instead of next", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["today", "upcoming"]);
  });
  check("the pill still names Session 1", () => {
    assert.equal(pillAt(now)?.short, "Session 1 · Nov 17");
  });
}

console.log("\nTue, Nov 17, 12:30 PM CT: two hours after Session 1 starts");
{
  const now = at("2026-11-17T12:30:00-06:00");
  check("Session 1 completed, Session 2 next up", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["completed", "next"]);
  });
  check("one minute earlier, Session 1 still reads today", () => {
    assert.deepEqual(
      getSessionStatuses(sessions, now - 60_000),
      ["today", "upcoming"],
    );
  });
}

console.log("\nWed, Nov 25: between the sessions");
{
  const now = at("2026-11-25T12:00:00-06:00");
  check("phase is in-progress", () => {
    assert.equal(getSeriesPhase(sessions, now), "in-progress");
  });
  check("Session 1 completed, Session 2 next up", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["completed", "next"]);
    assert.equal(getNextSession(sessions, now)?.number, 2);
  });
  check("the pill names Session 2 and the nav dot shows", () => {
    assert.deepEqual(pillAt(now), {
      full: "Session 2 · Tuesday, December 8",
      short: "Session 2 · Dec 8",
    });
    assert.equal(pillAndDotShow(now), true);
  });
}

console.log("\nTue, Dec 8, 11:00 AM CT: during Session 2");
{
  const now = at("2026-12-08T11:00:00-06:00");
  check("Session 1 completed, Session 2 today", () => {
    assert.deepEqual(getSessionStatuses(sessions, now), ["completed", "today"]);
  });
  check("phase is in-progress and the nav dot shows", () => {
    assert.equal(getSeriesPhase(sessions, now), "in-progress");
    assert.equal(pillAndDotShow(now), true);
  });
}

console.log("\nAfter December 8");
{
  const done = at("2026-12-08T12:30:00-06:00");
  const nextDay = at("2026-12-09T12:00:00-06:00");
  check("phase is complete from 12:30 PM on Dec 8", () => {
    assert.equal(getSeriesPhase(sessions, done - 60_000), "in-progress");
    assert.equal(getSeriesPhase(sessions, done), "complete");
    assert.equal(getSeriesPhase(sessions, nextDay), "complete");
  });
  check("both sessions completed, no next session", () => {
    assert.deepEqual(getSessionStatuses(sessions, nextDay), ["completed", "completed"]);
    assert.equal(getNextSession(sessions, nextDay), undefined);
  });
  check("the Home pill and the nav dot are gone", () => {
    assert.equal(pillAt(nextDay), null);
    assert.equal(pillAndDotShow(nextDay), false);
  });
  check("stageOverride beats the real date in both directions", () => {
    assert.equal(getSeriesPhase(sessions, at("2026-11-01T12:00:00-05:00"), "complete"), "complete");
    assert.equal(getSeriesPhase(sessions, nextDay, "upcoming"), "upcoming");
  });
}

// ---------------------------------------------------------------------------
console.log("\nDates and times, from a process running in Asia/Tokyo");
check("long and short dates are Central, not local", () => {
  assert.equal(formatLongDate(sessions[0].start), "Tuesday, November 17");
  assert.equal(formatLongDate(sessions[1].start), "Tuesday, December 8");
  assert.equal(formatShortDate(sessions[0].start), "Nov 17");
  assert.equal(formatShortDate(sessions[1].start), "Dec 8");
});
check("the sessions block's date lines", () => {
  assert.equal(
    formatSessionDateLine(sessions[0], currentSeries.time),
    "Tuesday, November 17 · 10:30 a.m. to noon",
  );
  assert.equal(
    formatSessionDateLine(sessions[1], currentSeries.time),
    "Tuesday, December 8 · 10:30 a.m. to noon",
  );
});
check("\"10:30 a.m. to noon\" matches every start and duration", () => {
  for (const s of sessions) {
    const start = Date.parse(s.start);
    assert.equal(formatClockTime(start), "10:30 AM", s.slug);
    assert.equal(formatClockTime(start + s.durationMinutes * 60_000), "12:00 PM", s.slug);
  }
});
check("every start's offset is America/Chicago's on that date", () => {
  const all: WorkshopSession[] = [...sessions, ...waupaca.sessions];
  for (const s of all) {
    const zone = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      timeZoneName: "longOffset",
    })
      .formatToParts(new Date(s.start))
      .find((part) => part.type === "timeZoneName")?.value;
    assert.equal(zone?.replace("GMT", ""), s.start.slice(-6), s.start);
  }
});
check("end times are noon, Central", () => {
  assert.equal(getSessionEnd(sessions[0]), "2026-11-17T12:00:00-06:00");
  assert.equal(getSessionEnd(sessions[1]), "2026-12-08T12:00:00-06:00");
});

// ---------------------------------------------------------------------------
console.log("\n/workshop schema: an Event per Marshfield session");
{
  const schema = buildSessionEventsSchema(currentSeries) as {
    "@graph": Array<Record<string, any>>;
  };
  const [page, ...events] = schema["@graph"];
  check("the page at its canonical URL, about both sessions", () => {
    assert.equal(page["@type"], "WebPage");
    assert.equal(page.url, "https://vaelro.co/workshop");
    assert.equal(page.about.length, 2);
  });
  check("two Events with their Central starts and ends", () => {
    assert.deepEqual(
      events.map((e) => [e["@type"], e.startDate, e.endDate]),
      [
        ["Event", "2026-11-17T10:30:00-06:00", "2026-11-17T12:00:00-06:00"],
        ["Event", "2026-12-08T10:30:00-06:00", "2026-12-08T12:00:00-06:00"],
      ],
    );
  });
  check("at the MACCI office, 700 South Central Ave, Marshfield", () => {
    for (const e of events) {
      assert.deepEqual(e.location.address, {
        "@type": "PostalAddress",
        streetAddress: "700 South Central Ave",
        addressLocality: "Marshfield",
        addressRegion: "WI",
        postalCode: "54449",
        addressCountry: "US",
      });
    }
  });
  check("hosted with MACCI, led by Owen, and no Offer or capacity", () => {
    const text = JSON.stringify(schema);
    assert.match(text, /"name":"Marshfield Area Chamber of Commerce and Industry","url":"https:\/\/www\.marshfieldchamber\.com"/);
    assert.ok(events.every((e) => e.performer.name === "Owen Lencki"));
    assert.ok(!/offers|maximumAttendeeCapacity|isAccessibleForFree|Tall Pines|Waupaca/.test(text), text);
  });
}

// ---------------------------------------------------------------------------
console.log("\n/workshop copy");
check("search title and description name Marshfield and fit the snippet", () => {
  const { title, description, canonical } = currentSeries.meta;
  assert.ok(title.length < 60, `title is ${title.length}`);
  assert.ok(description.length >= 120 && description.length <= 158, `description is ${description.length}`);
  assert.match(title, /Marshfield/);
  assert.match(description, /Marshfield/);
  assert.equal(canonical, "https://vaelro.co/workshop");
});
check("the hero and the line for Waupaca visitors", () => {
  assert.equal(currentSeries.hero.eyebrow, "Marshfield Area Chamber of Commerce and Industry");
  assert.equal(currentSeries.hero.heading, "AI for Your Business, Without the Overwhelm");
  assert.match(currentSeries.hero.body, /^Two free sessions for Marshfield-area business owners\./);
  assert.equal(
    `${currentSeries.waupacaNote.text} ${currentSeries.waupacaNote.linkLabel}`,
    "Here for the Waupaca workshop materials? They're here.",
  );
});
check("both sessions: titles and blurbs as approved", () => {
  assert.deepEqual(
    sessions.map((s) => [s.number, s.title, s.start, s.durationMinutes, s.blurb]),
    [
      [1, "Where your time goes", "2026-11-17T10:30:00-06:00", 90, "What AI can realistically do, then a short worksheet on where your week actually goes."],
      [2, "How to get it back", "2026-12-08T10:30:00-06:00", 90, "Solutions to the room's most common problems. A free version you can do yourself, and a built version."],
    ],
  );
});
check("Owen only, with the Marshfield last line on his bio", () => {
  const { speaker } = currentSeries.leader;
  assert.equal(speaker.id, "owen");
  assert.equal(
    speaker.bio,
    "Owen leads client relationships and builds Vaelro's websites and applications. He grew up in a Waupaca business family and studies marketing at UW-Stevens Point. He leads both Marshfield sessions.",
  );
  const text = JSON.stringify(currentSeries);
  assert.ok(!/Liam|Casey/.test(text), "Liam or Casey on the Marshfield page");
});
check("the attendee card", () => {
  const card = currentSeries.attendeeCard;
  assert.equal(card.heading, "Were you at Session 1?");
  assert.match(card.upload.text, /pages 2, 3 and 4/);
  assert.match(card.upload.text, /by Friday, November 20\.$/);
  assert.equal(
    card.summary,
    "Your summary arrives a few days before December 8, with a link to book a free follow-up call.",
  );
  assert.deepEqual(card.links.map((l) => l.to), ["/workshop/marshfield/session-1"]);
});
check("past workshops: the Waupaca card", () => {
  assert.equal(currentSeries.pastWorkshops.heading, "Past workshops");
  assert.deepEqual(pastSeries[0].archiveCard, {
    label: "Waupaca Area Chamber of Commerce · Fall 2026 · Three sessions",
    linkLabel: "Everything from the series, free to copy",
  });
});
check("the closing line", () => {
  assert.equal(
    `${currentSeries.closing.heading} ${currentSeries.closing.body}`,
    "Questions? Email hello@vaelro.co.",
  );
});

// ---------------------------------------------------------------------------
console.log("\nMarshfield Session 1 recap copy, as written on the slides");
{
  const leaves = new Set(strings(marshfieldSession1));
  const expected = [
    // A
    "A fast, confident intern.",
    "Sounds just as sure when it's guessing.",
    "Great first drafts. Never the final draft.",
    "Always check its work.",
    "Context is king. Tell it more, get more.",
    "It aims to please. Ask it to argue the other side.",
    // B
    "Same question, same tool, three tries.",
    "Who won the last five Super Bowls?",
    "Same answer. Every single time.",
    "Who wins next year?",
    "Try 1: Rams.",
    "Try 2: Bills.",
    "Try 3: \"Rams, Bills, Ravens or Seahawks.\"",
    "Three different picks. It never said it was guessing.",
    "The more open the question, the more you need to check the answer.",
    // C
    "30 minutes to 30 seconds.",
    "A first draft in 30 seconds, not 30 minutes.",
    "Turn a 1-star review into a calm, professional reply.",
    "A posting that sounds like your business, not a template.",
    "A week of captions in ten minutes.",
    "Paste a contract or policy, get plain English back.",
    "Draft the email you keep meaning to send.",
    // D
    "AI drafts. You decide.",
    "Helping build tools, fast.",
    "Your customers' trust.",
    "Most of what we build doesn't run on AI at all. AI helps us build it fast.",
    // E
    "Two minutes of setup.",
    "Never paste a customer's name, phone number, address or card number into a free AI tool.",
    "Turn off \"Improve the model for everyone.\"",
    "Turn off \"Help improve our AI models.\"",
    "Turn off \"Keep Activity.\"",
    "The new app has no switch. Microsoft says chats aren't used to train its core models.",
    "Setting names as of November 2026. Apps rename these, so look for the one about improving or training the model.",
    // F
    "Learning to ask is the whole skill.",
    "Most people try it once, get a bad answer, and quit. The bad answer was the question.",
    "Help me learn how to use you.",
    "It will interview you about your business, then teach itself to you. Works in every tool.",
    // G
    "Five habits that fix most bad answers.",
    "Let it interview you once. Paste that summary at the top of every chat.",
    "\"For my crew\" and \"for a first-time customer\" get different drafts.",
    "Two or three emails you've sent. It will start to sound like you.",
    "\"Shorter.\" \"Warmer.\" \"Less salesy.\"",
    "\"One text.\" \"Three bullets.\" \"Under a page.\"",
    // H
    "One prompt to try this week",
    "Before you write anything, ask me questions one at a time until you have what you need. Then give me a draft.",
    "Paste it at the end of any request, in any tool.",
    // I
    "What happens next.",
    "Looking for the patterns across every business in the room.",
    "Free do-it-yourself options, and done-for-you ones.",
    "December 8: We show you.",
    "Walkthroughs built from what you wrote.",
    "Your summary arrives a few days before December 8, with a link to book a free follow-up call.",
  ];
  check(`all ${expected.length} lines are on the page, word for word`, () => {
    const missing = expected.filter((line) => !leaves.has(line));
    assert.deepEqual(missing, []);
  });
  check("the five habits and the three next steps are in order", () => {
    assert.deepEqual(
      marshfieldSession1.habits.items.map((h) => h.title),
      [
        "Tell it about your business first.",
        "Say who it's for.",
        "Paste your own writing.",
        "Ask for a short draft, then react.",
        "Say the length and the shape.",
      ],
    );
    assert.deepEqual(
      marshfieldSession1.next.steps.map((s) => s.title),
      ["We read every packet.", "We build the fixes.", "December 8: We show you."],
    );
  });
  check("the upload reminder names the pages and the deadline", () => {
    assert.equal(
      marshfieldSession1.next.upload.text,
      "Upload photos of pages 2, 3 and 4 of your worksheet by Friday, November 20.",
    );
  });
  check("the recap is noindex at the edge too", () => {
    const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
    assert.match(
      toml,
      /for = "\/workshop\/marshfield\/session-1"\s*\[headers\.values\]\s*X-Robots-Tag = "noindex"/,
    );
  });
}

// ---------------------------------------------------------------------------
console.log("\nMarshfield page rules (/workshop and the recap)");
{
  const marshfieldCopy = JSON.stringify([currentSeries, marshfieldSession1]);
  check("no em dashes or en dashes", () => {
    assert.ok(!/[\u2014\u2013]/.test(marshfieldCopy), "a dash in the Marshfield copy");
  });
  check("nothing about Tall Pines, Part 3, or the Waupaca sessions", () => {
    assert.ok(!/Tall Pines|Part\s*3|Session 3|November 6/i.test(marshfieldCopy));
  });
  check("no prices, retainers, or sign-up language", () => {
    assert.ok(!/\$\d/.test(marshfieldCopy), "a price");
    assert.ok(!/retainer/i.test(marshfieldCopy), "retainer");
    assert.ok(!/sign.?up|register|registration|rsvp/i.test(marshfieldCopy), "sign-up language");
  });
  check("one soft offer per page: the free follow-up call, and nothing else to book", () => {
    for (const page of [currentSeries, marshfieldSession1]) {
      const text = JSON.stringify(page);
      assert.equal(text.match(/follow-up call/g)?.length, 1);
      assert.equal(text.match(/\bbook\b/gi)?.length, 1);
      assert.ok(!/consult|gameplan|book a call|hire us/i.test(text));
    }
  });
  check("no email address but hello@vaelro.co, and no app, script or token links", () => {
    const emails = marshfieldCopy.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? [];
    assert.deepEqual([...new Set(emails)], ["hello@vaelro.co"]);
    assert.ok(!/workers\.dev|script\.google|googleusercontent|\/exec\b|\/macros\/|token/i.test(marshfieldCopy));
  });
  check("uploads go straight to the form, never through /upload", () => {
    assert.equal(PACKET_UPLOAD_URL, "https://vaelro-packet-upload.netlify.app");
    assert.ok(!/vaelro\.co\/upload|"\/upload"/i.test(marshfieldCopy));
    const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
    for (const from of ["/upload", "/Upload", "/UPLOAD"]) {
      assert.ok(toml.includes(`from = "${from}"\n  to = "${PACKET_UPLOAD_URL}"`), from);
    }
  });
}

// ---------------------------------------------------------------------------
console.log("\nThe Waupaca archive at /workshop/waupaca");
check("its own canonical, a Waupaca title, indexable", () => {
  assert.equal(waupaca.path, "/workshop/waupaca");
  assert.equal(waupaca.meta.canonical, "https://vaelro.co/workshop/waupaca");
  assert.equal(waupaca.meta.title, "Waupaca AI Workshops: Free Templates and Prompts | Vaelro");
  assert.ok(waupaca.meta.title.length < 60, `title is ${waupaca.meta.title.length}`);
  const n = waupaca.meta.description.length;
  assert.ok(n >= 120 && n <= 158, `description is ${n}`);
  assert.equal(waupaca.meta.ogTitle, waupaca.hero.heading);
});
check("the new eyebrow over the unchanged top section", () => {
  assert.equal(waupaca.hero.eyebrow, "Fall 2026 · Waupaca Area Chamber of Commerce");
  assert.equal(waupaca.hero.heading, "The workshop series is a wrap.");
  assert.equal(
    waupaca.hero.body,
    "Thank you to everyone who came out to the Waupaca Area Chamber AI workshops this fall, and to the Waupaca Area Chamber of Commerce for the room, the coffee and the invitation. Everything we promised is below, free to copy and use in your own business. Questions about any of it? Email us at hello@vaelro.co.",
  );
});
check("the bottom line", () => {
  assert.equal(
    `${waupaca.closing.heading} ${waupaca.closing.body}`,
    "Questions about anything from the series? Email hello@vaelro.co.",
  );
});
check("the Session 1 and 2 card still links both session pages", () => {
  assert.equal(waupaca.attendeeCard.heading, "Were you at Session 1 or Session 2?");
  assert.deepEqual(
    waupaca.attendeeCard.links.map((l) => [l.label, l.to]),
    [
      ["Session 1 prompts and homework", "/workshop/session-1"],
      ["Session 2 free prompts and resources", "/workshop/session-2"],
    ],
  );
});
check("old /workshop links into the Session 3 block forward to the archive", () => {
  // Every id Session3.tsx renders, from the data it renders them from.
  const ids = [
    "session-3",
    "free-versions",
    ...session3.freeVersions.fixes.map((f) => f.id),
    "tall-pines",
    "free-prompts",
    ...freePrompts.groups.map((g) => `prompts-${g.id}`),
    ...freePrompts.prompts.map((p) => `prompt-${p.id}`),
    "downloads",
  ];
  assert.deepEqual(ids.filter((id) => !isSession3Anchor(`#${id}`)), []);
  // The Marshfield page's own anchors stay put.
  for (const own of ["#sessions", "#leader", "#past-workshops", "#attendee-card-heading", ""]) {
    assert.ok(!isSession3Anchor(own), own);
  }
});
check("both session pages link back to the archive, not to /workshop", () => {
  assert.equal(session1.backLink.to, "/workshop/waupaca");
  assert.equal(session2.backLink.to, "/workshop/waupaca");
  assert.equal(session2.resources.session1Link.to, "/workshop/session-1");
});
check("the Tall Pines build", () => {
  const t = session3.tallPines;
  assert.equal(t.heading, "The Tall Pines build, as-is");
  assert.equal(
    t.intro,
    "This is a copy of the system we demoed on November 6: the sheet, the forms and the scripts behind them, built for Tall Pines Lawn & Landscape, a made-up company. It's here so you can see how it works under the hood.",
  );
  assert.equal(t.notesLabel, "A few honest notes:");
  assert.deepEqual(t.notes, [
    "It won't run on its own. The automatic emails and reminders need to be switched on and pointed at your own accounts, and Google will show a warning the first time you allow the scripts. That's normal for a custom tool.",
    "It's built for a landscaper. Your business will need different questions, columns and messages.",
    "It's provided as-is, with no support. Free to use in your own business. Please don't resell it.",
  ]);
  assert.equal(
    t.closing,
    "If you'd rather have it set up and running for your business, in your own Google account, that's what we do. Email hello@vaelro.co.",
  );
  assert.equal(t.buttonLabel, "Make a copy of the Tall Pines build");
  assert.equal(t.href, TALL_PINES_COPY_URL);
});
check("Make a copy buttons on Catch it once and One log, none on Never drop a follow-up", () => {
  const links = session3.freeVersions.fixes.map((f) => [f.title, f.link?.label, f.link?.href]);
  assert.deepEqual(links, [
    ["Catch it once", "Make a copy", CATCH_IT_ONCE_COPY_URL],
    ["One log, every form", "Make a copy", ONE_LOG_COPY_URL],
    ["Never drop a follow-up", undefined, undefined],
  ]);
});
check("the three Make a copy links are Google /copy links", () => {
  assert.match(CATCH_IT_ONCE_COPY_URL, /^https:\/\/docs\.google\.com\/forms\/d\/[\w-]{25,}\/copy$/);
  assert.match(ONE_LOG_COPY_URL, /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]{25,}\/copy$/);
  assert.match(TALL_PINES_COPY_URL, /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]{25,}\/copy$/);
});

console.log("\nThe archive's schema describes the finished series");
{
  const schema = buildWorkshopSchema(waupaca) as {
    "@type": string;
    url: string;
    about: { "@type": string; startDate: string; endDate: string; location: { hasMap?: string } };
  };
  check("one WebPage at the archive's canonical URL", () => {
    assert.equal(schema["@type"], "WebPage");
    assert.equal(schema.url, "https://vaelro.co/workshop/waupaca");
  });
  check("about the series, with its real first and last dates", () => {
    assert.equal(schema.about["@type"], "EventSeries");
    assert.equal(schema.about.startDate, "2026-09-25T08:00:00-05:00");
    assert.equal(schema.about.endDate, "2026-11-06T09:00:00-06:00");
    assert.match(schema.about.location.hasMap ?? "", /^https:\/\//);
  });
  check("nothing reads as an open invitation: no status, Offer, or capacity", () => {
    const text = JSON.stringify(schema);
    assert.ok(!/EventScheduled|eventStatus|offers|maximumAttendeeCapacity|isAccessibleForFree/.test(text), text);
  });
}

console.log("\nWaupaca archive page rules");
{
  const pageCopy = JSON.stringify([waupaca, session3]);
  check("no em dashes", () => {
    assert.ok(!pageCopy.includes("\u2014"), "em dash in the page copy");
  });
  check("no prices, retainers, or sign-up language", () => {
    assert.ok(!/\$\d/.test(pageCopy), "a price");
    assert.ok(!/retainer/i.test(pageCopy), "retainer");
    assert.ok(!/sign.?up|register|registration|rsvp/i.test(pageCopy), "sign-up language");
  });
  check("nothing about sessions still to come", () => {
    assert.ok(!/next session|upcoming|see you there|is closed/i.test(pageCopy), "upcoming-session copy");
  });
  check("no app, script, API or token links, and no email address but hello@vaelro.co", () => {
    assert.ok(
      !/workers\.dev|script\.google|googleusercontent|\/exec\b|\/macros\/|token/i.test(pageCopy),
      "something that must never be on the page",
    );
    const emails = pageCopy.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) ?? [];
    assert.deepEqual([...new Set(emails)], ["hello@vaelro.co"]);
  });
}

// ---------------------------------------------------------------------------
console.log("\nSession 2 page");
check("no upload, summary, deadline, or em dash copy on the Session 2 page", () => {
  const text = JSON.stringify(session2);
  assert.ok(!/upload|summary|October 14|\u2014/i.test(text), "stale copy");
  assert.match(
    text,
    /On November 6 we share what the room wrote down and show practical ways to start getting that time back\./,
  );
});
check("no demo, fix, or version promises in the Session 2 copy", () => {
  const PROMISES = /\bdemos?\b|\bfix(es)?\b|done-for-you|do-it-yourself|two (ways|versions)|running on its own|live example/i;
  assert.ok(!PROMISES.test(JSON.stringify(session2)), "session2.ts");
});

// ---------------------------------------------------------------------------
console.log("\nllms.txt");
check("names the Marshfield series and the Waupaca archive", () => {
  const llms = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8");
  assert.match(llms, /\(https:\/\/vaelro\.co\/workshop\): .*Marshfield/);
  assert.match(llms, /\(https:\/\/vaelro\.co\/workshop\/waupaca\)/);
  assert.ok(!/\u2014/.test(llms), "em dash in llms.txt");
});

console.log(
  failures === 0
    ? "\nAll workshop checks passing.\n"
    : `\n${failures} failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
