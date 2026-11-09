// ---------------------------------------------------------------------------
// test-workshop.ts
// Pins the /workshop date logic at fixed moments (the Home pill and the nav
// dot still read it, and both must disappear once the series is over), and
// checks the wrapped page's copy and links against the rules it was approved
// under.
//
// Run:  npm run test:workshop
//
// TZ is forced to Asia/Tokyo first: every displayed string must come out in
// Central time regardless of where the visitor (or this process) sits.
// ---------------------------------------------------------------------------

process.env.TZ = "Asia/Tokyo";

import assert from "node:assert/strict";
import { workshop } from "../src/data/workshop";
import { session2 } from "../src/data/session2";
import {
  CATCH_IT_ONCE_COPY_URL,
  ONE_LOG_COPY_URL,
  TALL_PINES_COPY_URL,
  session3,
} from "../src/data/session3";
import {
  buildWorkshopSchema,
  formatLongDate,
  formatShortDate,
  getNextSession,
  getPillCopy,
  getSeriesPhase,
  getSessionEnd,
  getSessionStatuses,
} from "../src/lib/workshop";

const sessions = workshop.sessions;
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

const AT = {
  beforeSeries: Date.parse("2026-09-01T12:00:00-05:00"),
  duringSession1: Date.parse("2026-09-25T09:30:00-05:00"),
  betweenSessions: Date.parse("2026-10-20T12:00:00-05:00"),
  afterSeries: Date.parse("2026-11-07T12:00:00-06:00"),
};

console.log("\nSep 1, 2026: three weeks out");
check("phase is upcoming", () => {
  assert.equal(getSeriesPhase(sessions, AT.beforeSeries), "upcoming");
});
check("session 1 is next, 2 and 3 upcoming", () => {
  assert.deepEqual(getSessionStatuses(sessions, AT.beforeSeries), [
    "next",
    "upcoming",
    "upcoming",
  ]);
});
check("next session is session 1", () => {
  assert.equal(getNextSession(sessions, AT.beforeSeries)?.number, 1);
});

console.log("\nSep 25, 2026 9:30 AM CT: 90 minutes into session 1");
check("phase is in-progress", () => {
  assert.equal(getSeriesPhase(sessions, AT.duringSession1), "in-progress");
});
check("session 1 reads today and keeps it instead of next", () => {
  assert.deepEqual(getSessionStatuses(sessions, AT.duringSession1), [
    "today",
    "upcoming",
    "upcoming",
  ]);
});
check("next session is still session 1 until it completes", () => {
  assert.equal(getNextSession(sessions, AT.duringSession1)?.number, 1);
});
check("session 1 completes two hours after it starts", () => {
  const twoHoursIn = Date.parse("2026-09-25T10:00:00-05:00");
  assert.equal(getSessionStatuses(sessions, twoHoursIn)[0], "completed");
});

console.log("\nOct 20, 2026: sessions 1 and 2 done");
check("phase is in-progress", () => {
  assert.equal(getSeriesPhase(sessions, AT.betweenSessions), "in-progress");
});
check("sessions 1 and 2 completed, session 3 is next", () => {
  assert.deepEqual(getSessionStatuses(sessions, AT.betweenSessions), [
    "completed",
    "completed",
    "next",
  ]);
});
check("next session is session 3", () => {
  assert.equal(getNextSession(sessions, AT.betweenSessions)?.number, 3);
});

console.log("\nNov 7, 2026: the day after session 3");
check("phase is complete", () => {
  assert.equal(getSeriesPhase(sessions, AT.afterSeries), "complete");
});
check("every session is completed", () => {
  assert.deepEqual(getSessionStatuses(sessions, AT.afterSeries), [
    "completed",
    "completed",
    "completed",
  ]);
});
check("there is no next session", () => {
  assert.equal(getNextSession(sessions, AT.afterSeries), undefined);
});

console.log("\nstageOverride");
check("override beats the real date in both directions", () => {
  assert.equal(
    getSeriesPhase(sessions, AT.beforeSeries, "complete"),
    "complete",
  );
  assert.equal(
    getSeriesPhase(sessions, AT.afterSeries, "upcoming"),
    "upcoming",
  );
});
check("stageOverride is unset in the committed data file", () => {
  assert.equal(workshop.stageOverride, undefined);
});

console.log("\nFormatting, from a process running in Asia/Tokyo");
check("long dates are Central, not local", () => {
  assert.equal(formatLongDate(sessions[0].start), "Friday, September 25");
  assert.equal(formatLongDate(sessions[2].start), "Friday, November 6");
});
check("short dates are Central too", () => {
  assert.equal(formatShortDate(sessions[1].start), "Oct 9");
  assert.equal(formatShortDate(sessions[2].start), "Nov 6");
});
check("end times keep the session's own offset across the DST change", () => {
  assert.equal(getSessionEnd(sessions[0]), "2026-09-25T09:00:00-05:00");
  assert.equal(getSessionEnd(sessions[2]), "2026-11-06T09:00:00-06:00");
});
check("the pill names the next session and its date", () => {
  const copy = getPillCopy(workshop.pill, sessions[2]);
  assert.equal(copy.full, "Session 3 · Friday, November 6");
  assert.equal(copy.short, "Session 3 · Nov 6");
});

console.log("\nThe page's schema describes the finished series");
const schema = buildWorkshopSchema(workshop) as {
  "@type": string;
  url: string;
  about: { "@type": string; startDate: string; endDate: string; location: { hasMap?: string } };
};
check("one WebPage at the canonical URL", () => {
  assert.equal(schema["@type"], "WebPage");
  assert.equal(schema.url, "https://vaelro.co/workshop");
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

console.log("\nThe approved copy is in place");
check("the top section", () => {
  assert.equal(workshop.hero.heading, "The workshop series is a wrap.");
  assert.equal(
    workshop.hero.body,
    "Thank you to everyone who came out to the Waupaca Area Chamber AI workshops this fall, and to the Waupaca Area Chamber of Commerce for the room, the coffee and the invitation. Everything we promised is below, free to copy and use in your own business. Questions about any of it? Email us at hello@vaelro.co.",
  );
});
check("the bottom line", () => {
  assert.equal(
    `${workshop.closing.heading} ${workshop.closing.body}`,
    "Questions about anything from the series? Email hello@vaelro.co.",
  );
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
check("search title and description fit the snippet", () => {
  assert.equal(workshop.meta.title, "AI Workshop Series: Free Templates and Prompts | Vaelro");
  assert.ok(workshop.meta.title.length < 60, `title is ${workshop.meta.title.length}`);
  const n = workshop.meta.description.length;
  assert.ok(n >= 120 && n <= 158, `description is ${n}`);
  assert.equal(workshop.meta.ogTitle, workshop.hero.heading);
});

console.log("\nPage rules");
const pageCopy = JSON.stringify([workshop, session3]);
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
check("the three Make a copy links are Google /copy links", () => {
  assert.match(CATCH_IT_ONCE_COPY_URL, /^https:\/\/docs\.google\.com\/forms\/d\/[\w-]{25,}\/copy$/);
  assert.match(ONE_LOG_COPY_URL, /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]{25,}\/copy$/);
  assert.ok(!TALL_PINES_COPY_URL.includes("TALL_PINES_COPY_ID"), "TALL_PINES_COPY_URL is still the placeholder");
  assert.match(TALL_PINES_COPY_URL, /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[\w-]{25,}\/copy$/);
});

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

console.log(
  failures === 0
    ? "\nAll workshop checks passing.\n"
    : `\n${failures} failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
