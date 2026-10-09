import { Link } from "react-router-dom";
import { PACKET_UPLOAD_URL, workshop } from "../../data/workshop";
import { trackEvent } from "../../lib/analytics";

/**
 * The first thing on /workshop, above the hero heading so it sits in the
 * first screen on a phone. The NFC tags and table stands in the room open
 * this page, and most people who tap one are there to send in their packet,
 * so one big button goes straight to the upload form. The session pages are
 * quieter text links under it.
 */
export default function AttendeeCard() {
  const card = workshop.attendeeCard;

  return (
    <section
      aria-labelledby="attendee-card-heading"
      className="mb-8 rounded-2xl bg-ink-900 p-5 text-cream-100 shadow-[0_2px_4px_rgba(26,26,26,0.06),0_14px_36px_rgba(26,26,26,0.12)] sm:max-w-xl md:mb-10 md:p-6"
    >
      {/* Set as a heading but not one in the outline: it sits above the
          page's <h1>. */}
      <p
        id="attendee-card-heading"
        className="font-serif text-xl leading-snug font-bold md:text-2xl"
      >
        {card.heading}
      </p>

      {/* The biggest tap target on the card. Dark text on the orange, so the
          label clears 4.5:1. No icon and tight side padding: the label has to
          stay on one line on a 375px phone. */}
      <a
        href={PACKET_UPLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("packet_upload_click", { location: "workshop_card" })
        }
        className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-center text-lg leading-tight font-bold text-ink-950 transition-colors duration-200 hover:bg-orange-400"
      >
        {card.uploadLabel}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>

      <ul className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-8">
        {card.links.map(({ label, to, event }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={event ? () => trackEvent(event) : undefined}
              className="group inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-semibold text-cream-100/85 transition-colors duration-200 hover:text-orange-300"
            >
              <span className="underline decoration-cream-100/35 underline-offset-4 transition-colors duration-200 group-hover:decoration-orange-400">
                {label}
              </span>
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10" />
                <path d="m9 4 4 4-4 4" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
