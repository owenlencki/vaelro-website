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
  Faq,
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

/** "Friday, September 25 · 8:00 AM" */
export function formatSessionDateLine(
  session: WorkshopSession,
  time: string,
): string {
  return `${formatLongDate(session.start)} · ${time}`;
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
 * "Sep 25 · Oct 9 · Nov 6", derived so the hero row can never drift from the
 * session data.
 */
export function formatDateRow(sessions: WorkshopSession[]): string {
  return sessions.map((s) => formatShortDate(s.start)).join(" · ");
}

/**
 * FAQ answers are verbatim from the copy deck, except the venue question:
 * once the address and parking note are filled in, they replace the
 * placeholder second sentence.
 */
export function resolveFaqAnswer(
  faq: Faq,
  venue: { address: string; parkingNote: string },
): string {
  if (faq.id !== "where") return faq.answer;
  const details = [venue.address, venue.parkingNote].filter(Boolean);
  if (details.length === 0) return faq.answer;
  const [firstSentence] = faq.answer.split(". ");
  return `${firstSentence}. ${details.join(" ")}`;
}

/** "Next session: Friday, October 9 at 8:00 AM" */
export function formatNextSessionLine(
  session: WorkshopSession,
  time: string,
): string {
  return `Next session: ${formatLongDate(session.start)} at ${time}`;
}

interface PillCopy {
  full: string;
  short: string;
}

/**
 * The Home hero pill's two strings for the current phase, with the next
 * session's date substituted in mid-series.
 */
export function getPillCopy(
  pill: { upcoming: PillCopy; inProgress: PillCopy; complete: PillCopy },
  phase: SeriesPhase,
  nextSession?: WorkshopSession,
): PillCopy {
  if (phase === "complete") return pill.complete;
  if (phase === "in-progress" && nextSession) {
    const date = formatShortDate(nextSession.start);
    return {
      full: pill.inProgress.full.replace("{date}", date),
      short: pill.inProgress.short.replace("{date}", date),
    };
  }
  return pill.upcoming;
}

// --- Structured data ------------------------------------------------------

interface SchemaShape {
  title: string;
  partner: string;
  partnerUrl: string;
  capacity: number;
  venue: { name: string; address: string; city: string };
  registration: { url: string };
  meta: { ogImage: string };
  sessions: WorkshopSession[];
  speakers: Array<{ id: string; name: string }>;
}

/**
 * The three sessions as one schema.org @graph of Event objects. Google runs
 * JavaScript, so injecting this at runtime is enough; the crawler-facing head
 * for link previews is separate work.
 */
export function buildEventGraph(data: SchemaShape): string {
  const organizer = [
    { "@type": "Organization", name: "Vaelro", url: "https://vaelro.co" },
    { "@type": "Organization", name: data.partner, url: data.partnerUrl },
  ];

  const person = (id: string) => {
    const match = data.speakers.find((s) => s.id === id);
    return match ? { "@type": "Person", name: match.name } : undefined;
  };

  const graph = data.sessions.map((session) => ({
    "@type": "Event",
    name: `${data.title}: Session ${session.number}, ${session.title}`,
    description: session.blurb,
    startDate: session.start,
    endDate: getSessionEnd(session),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: data.venue.name,
      address: {
        "@type": "PostalAddress",
        ...(data.venue.address ? { streetAddress: data.venue.address } : {}),
        addressLocality: "Waupaca",
        addressRegion: "WI",
        addressCountry: "US",
      },
    },
    image: data.meta.ogImage,
    organizer,
    performer: [
      person("owen"),
      person("liam"),
      ...(session.number === 1 ? [person("casey")] : []),
    ].filter(Boolean),
    isAccessibleForFree: true,
    maximumAttendeeCapacity: data.capacity,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: data.registration.url,
    },
  }));

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
