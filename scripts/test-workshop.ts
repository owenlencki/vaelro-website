// ---------------------------------------------------------------------------
// test-workshop.ts
// Pins the /workshop date logic at fixed moments so the page's behaviour
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
import { session2 } from "../src/data/session2";
import {
  formatLongDate,
  formatSessionDateLine,
  formatShortDate,
  getNextSession,
  buildEventGraph,
  getPillCopy,
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
check("short dates are Central too", () => {
  assert.equal(formatShortDate(sessions[1].start), "Oct 9");
  assert.equal(formatShortDate(sessions[2].start), "Nov 6");
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
  assert.match(answer, /Same room as Session 2\.$/);
});
check("the committed venue answers with its real address", () => {
  const faq = workshop.faqs.find((f) => f.id === "where")!;
  assert.equal(
    resolveFaqAnswer(faq, workshop.venue),
    "The Waupaca Business Center, inside the Waupaca Recreation Center. 407 School St, Waupaca, WI 54981",
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

console.log("\nSession 3 is the only event advertised, and nothing invites sign-ups");
check("the schema holds one Event, Session 3, while sessions 1 and 2 are past", () => {
  const graph = buildEventGraph(workshop, AT.betweenSessions) as {
    "@graph": Array<Record<string, unknown>>;
  };
  assert.equal(graph["@graph"].length, 1);
  assert.match(String(graph["@graph"][0].name), /Session 3/);
  assert.equal(graph["@graph"][0].startDate, "2026-11-06T08:00:00-06:00");
});
check("the Event has no Offer, capacity, or free flag", () => {
  const graph = buildEventGraph(workshop, AT.betweenSessions) as {
    "@graph": Array<Record<string, unknown>>;
  };
  const event = graph["@graph"][0];
  assert.equal(event.offers, undefined);
  assert.equal(event.maximumAttendeeCapacity, undefined);
  assert.equal(event.isAccessibleForFree, undefined);
});
check("no schema at all once the series is over", () => {
  assert.equal(buildEventGraph(workshop, AT.afterSeries), undefined);
});
check("the pill names the next session and its date", () => {
  const copy = getPillCopy(workshop.pill, sessions[2]);
  assert.equal(copy.full, "Session 3 · Friday, November 6");
  assert.equal(copy.short, "Session 3 · Nov 6");
});
check("the hero carries the registration-closed line", () => {
  assert.equal(
    workshop.hero.registrationLine,
    "Registration for Session 3 is closed. If you signed up, we will see you there.",
  );
});
check("no em dashes, sign-up language, retainer, or prices", () => {
  const text = JSON.stringify(workshop);
  assert.ok(!text.includes("\u2014"), "em dash in workshop copy");
  assert.ok(!/sign.?up|register now|rsvp/i.test(text.replace(/Registration for Session 3 is closed/g, "").replace(/If you signed up/g, "").replace(/registered attendees/g, "")), "sign-up language");
  assert.ok(!/retainer/i.test(text), "retainer");
  assert.ok(!/\$\d/.test(text), "a price");
});
check("the closing card has no button, only the email link", () => {
  assert.equal(workshop.closing.links.length, 1);
  assert.match(workshop.closing.links[0].href, /^mailto:/);
});

console.log("\nSession 2 page");
check("no upload, summary, deadline, or em dash copy on the Session 2 page", () => {
  const text = JSON.stringify(session2);
  assert.ok(!/upload|summary|October 14|\u2014/i.test(text), "stale copy");
  assert.ok(!/running on its own/i.test(text), "old demo wording");
  assert.match(text, /live demos built from what the room wrote down/);
});

console.log(
  failures === 0
    ? "\nAll workshop date logic passing.\n"
    : `\n${failures} failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
