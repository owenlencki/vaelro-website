// ---------------------------------------------------------------------------
// test-workshop.ts
// Pins the /workshop date logic at four fixed moments so the page's behaviour
// across the three sessions can be checked today instead of in November.
//
// Run:  npm run test:workshop
//
// TZ is forced to Asia/Tokyo first: every displayed string must come out in
// Central time regardless of where the visitor (or this process) sits.
// ---------------------------------------------------------------------------

process.env.TZ = "Asia/Tokyo";

import assert from "node:assert/strict";
import { workshop } from "../src/data/workshop";
import {
  formatDateRow,
  formatLongDate,
  formatSessionDateLine,
  formatShortDate,
  getNextSession,
  getSeriesPhase,
  getSessionEnd,
  getSessionStatuses,
  resolveFaqAnswer,
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
check("short dates match the hero row", () => {
  assert.equal(formatShortDate(sessions[1].start), "Oct 9");
  assert.equal(formatDateRow(sessions), "Sep 25 · Oct 9 · Nov 6");
});
check("session date lines match the copy deck", () => {
  assert.equal(
    formatSessionDateLine(sessions[0], workshop.time),
    "Friday, September 25 · 8:00 AM",
  );
});
check("end times keep the session's own offset across the DST change", () => {
  assert.equal(getSessionEnd(sessions[0]), "2026-09-25T09:00:00-05:00");
  assert.equal(getSessionEnd(sessions[2]), "2026-11-06T09:00:00-06:00");
});

console.log("\nVenue-dependent FAQ");
check("placeholder sentence holds while the address is empty", () => {
  const faq = workshop.faqs.find((f) => f.id === "where")!;
  const answer = resolveFaqAnswer(faq, { address: "", parkingNote: "" });
  assert.match(answer, /before Session 1\.$/);
});
check("the committed venue answers with its real address", () => {
  const faq = workshop.faqs.find((f) => f.id === "where")!;
  assert.equal(
    resolveFaqAnswer(faq, workshop.venue),
    "The Waupaca Area Chamber of Commerce in downtown Waupaca. 315 S Main St, Waupaca, WI 54981",
  );
});
check("a parking note joins the address once it is filled in", () => {
  const faq = workshop.faqs.find((f) => f.id === "where")!;
  const answer = resolveFaqAnswer(faq, {
    address: workshop.venue.address,
    parkingNote: "Park in the north lot.",
  });
  assert.match(answer, /54981 Park in the north lot\.$/);
});
check("the venue name the map link keys on is present in the answer", () => {
  const faq = workshop.faqs.find((f) => f.id === "where")!;
  assert.ok(
    resolveFaqAnswer(faq, workshop.venue).includes(workshop.venue.name),
    "VenueLink splits on venue.name; the answer must contain it verbatim",
  );
});
check("the closing detail line carries the venue name too", () => {
  assert.ok(workshop.closing.detailLine.includes(workshop.venue.name));
});
check("venue has a map URL for the links to point at", () => {
  assert.match(workshop.venue.mapUrl, /^https:\/\//);
});

console.log(
  failures === 0
    ? "\nAll workshop date logic passing.\n"
    : `\n${failures} failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
