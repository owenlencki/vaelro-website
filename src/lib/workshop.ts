// ---------------------------------------------------------------------------
// WORKSHOP HELPERS
// Pure functions over src/data/workshop.ts. Every one of them takes `now` so
// the page can be tested at a fixed date (scripts/test-workshop.ts) instead of
// waiting for September. Kept out of the data file so that file stays plain
// data and can be imported under tsx.
//
// All display dates are formatted in America/Chicago, so a visitor in another
// timezone still reads "Friday, September 25 at 8:00 AM".
// ---------------------------------------------------------------------------

import type {
  SeriesPhase,
  SessionStatus,
  WorkshopSession,
} from "../data/workshop";

const TZ = "America/Chicago";

/** A session counts as done two hours after it starts. */
const COMPLETED_AFTER_MS = 2 * 60 * 60 * 1000;

/** Calendar day in Central time, as "2026-09-25", for same-day comparisons. */
function centralDayKey(ms: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms));
}

/**
 * Status of one session on its own: completed once it is two hours past its
 * start, today while it is the same Central calendar day, otherwise upcoming.
 * The `next` promotion is a property of the set, so it lives in
 * getSessionStatuses.
 */
export function getSessionStatus(
  session: WorkshopSession,
  now: number = Date.now(),
): SessionStatus {
  const start = Date.parse(session.start);
  if (now >= start + COMPLETED_AFTER_MS) return "completed";
  if (centralDayKey(now) === centralDayKey(start)) return "today";
  return "upcoming";
}

/**
 * Statuses for the whole series. The earliest session that is not completed is
 * promoted to `next`; a session happening today keeps `today` instead.
 */
export function getSessionStatuses(
  sessions: WorkshopSession[],
  now: number = Date.now(),
): SessionStatus[] {
  const statuses = sessions.map((s) => getSessionStatus(s, now));
  const firstOpen = statuses.findIndex((s) => s !== "completed");
  if (firstOpen !== -1 && statuses[firstOpen] === "upcoming") {
    statuses[firstOpen] = "next";
  }
  return statuses;
}

/**
 * upcoming until Session 1 starts, in-progress until Session 3 is completed,
 * complete after that. `override` (the data file's stageOverride) wins.
 */
export function getSeriesPhase(
  sessions: WorkshopSession[],
  now: number = Date.now(),
  override?: SeriesPhase,
): SeriesPhase {
  if (override) return override;
  if (sessions.length === 0) return "complete";
  const first = Math.min(...sessions.map((s) => Date.parse(s.start)));
  const last = Math.max(...sessions.map((s) => Date.parse(s.start)));
  if (now < first) return "upcoming";
  if (now >= last + COMPLETED_AFTER_MS) return "complete";
  return "in-progress";
}

/** The earliest session that is not completed, or undefined once all are. */
export function getNextSession(
  sessions: WorkshopSession[],
  now: number = Date.now(),
): WorkshopSession | undefined {
  return sessions.find((s) => getSessionStatus(s, now) !== "completed");
}

// --- Formatting -----------------------------------------------------------

function format(ms: number, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...options }).format(
    new Date(ms),
  );
}

/** "Friday, September 25" */
export function formatLongDate(iso: string): string {
  return format(Date.parse(iso), {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** "Sep 25" */
export function formatShortDate(iso: string): string {
  return format(Date.parse(iso), { month: "short", day: "numeric" });
}

/**
 * End of a session as an ISO string carrying the same offset as its start, for
 * schema.org endDate.
 */
export function getSessionEnd(session: WorkshopSession): string {
  const match = session.start.match(/([+-])(\d{2}):(\d{2})$/);
  const offsetMinutes = match
    ? (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]))
    : 0;
  const endMs = Date.parse(session.start) + session.durationMinutes * 60_000;
  const wallClock = new Date(endMs + offsetMinutes * 60_000)
    .toISOString()
    .slice(0, 19);
  return `${wallClock}${match ? match[0] : "Z"}`;
}

// --- Derived copy ---------------------------------------------------------

/**
 * The Home hero pill's two strings for the next session: {number},
 * {longDate} ("Friday, November 6"), and {date} ("Nov 6") are filled in from
 * it. The wrapped state has no pill, so callers stop rendering it rather than
 * asking for copy that does not exist.
 */
export function getPillCopy(
  pill: { full: string; short: string },
  session: WorkshopSession,
): { full: string; short: string } {
  const fill = (text: string) =>
    text
      .replace("{number}", String(session.number))
      .replace("{longDate}", formatLongDate(session.start))
      .replace("{date}", formatShortDate(session.start));
  return { full: fill(pill.full), short: fill(pill.short) };
}

// --- Structured data ------------------------------------------------------

interface SchemaShape {
  title: string;
  partner: string;
  partnerUrl: string;
  venue: { name: string; address: string; mapUrl?: string };
  meta: { canonical: string; description: string; ogTitle: string; ogImage: string };
  sessions: WorkshopSession[];
}

/**
 * schema.org JSON-LD for /workshop's <head> (prerendered, so crawlers read it
 * without running JavaScript): the page, and the finished series it is about,
 * with its real dates. The series is over, so nothing here may read as an open
 * invitation: no Event with a status, no Offer, no capacity.
 */
export function buildWorkshopSchema(data: SchemaShape): Record<string, unknown> {
  // venue.address is one display string ("407 School St, Waupaca, WI 54981");
  // locality, region, and postal code are their own fields here, so only the
  // street part belongs in streetAddress.
  const street = data.venue.address.split(",")[0].trim();
  const postalCode = data.venue.address.match(/\b\d{5}\b/)?.[0] ?? "";
  const first = data.sessions[0];
  const last = data.sessions[data.sessions.length - 1];

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${data.meta.canonical}#webpage`,
    url: data.meta.canonical,
    name: data.meta.ogTitle,
    description: data.meta.description,
    inLanguage: "en-US",
    image: data.meta.ogImage,
    isPartOf: { "@id": "https://vaelro.co/#website" },
    publisher: { "@id": "https://vaelro.co/#business" },
    about: {
      "@type": "EventSeries",
      name: data.title,
      startDate: first.start,
      endDate: getSessionEnd(last),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: data.venue.name,
        ...(data.venue.mapUrl ? { hasMap: data.venue.mapUrl } : {}),
        address: {
          "@type": "PostalAddress",
          ...(street ? { streetAddress: street } : {}),
          addressLocality: "Waupaca",
          addressRegion: "WI",
          ...(postalCode ? { postalCode } : {}),
          addressCountry: "US",
        },
      },
      organizer: [
        { "@type": "Organization", name: "Vaelro", url: "https://vaelro.co" },
        { "@type": "Organization", name: data.partner, url: data.partnerUrl },
      ],
    },
  };
}
