import { Link } from "react-router-dom";
import { PACKET_UPLOAD_URL } from "../../data/workshop";
import type { AttendeeCardLink } from "../../data/workshop";
import { trackEvent } from "../../lib/analytics";

interface AttendeeCardProps {
  card: {
    heading: string;
    /** A line and a button to the packet upload form, while uploads are open. */
    upload?: { text: string; label: string };
    /** A plain line under the upload button. */
    summary?: string;
    links: AttendeeCardLink[];
  };
}

/**
 * The dark card for people who were in the room: on /workshop, the upload
 * button and the Session 1 recap; on /workshop/waupaca, text links to the
 * Session 1 and Session 2 pages (uploads there closed long ago).
 */
export default function AttendeeCard({ card }: AttendeeCardProps) {
  return (
    <section
      aria-labelledby="attendee-card-heading"
      className="bg-cream-100 py-10 md:py-14"
    >
      <div className="container-site">
        <div className="rounded-2xl bg-ink-900 p-5 text-cream-100 shadow-[0_2px_4px_rgba(26,26,26,0.06),0_14px_36px_rgba(26,26,26,0.12)] sm:max-w-xl md:p-6">
          <h2
            id="attendee-card-heading"
            className="font-serif text-xl leading-snug font-bold md:text-2xl"
          >
            {card.heading}
          </h2>

          {card.upload && (
            <>
              <p className="mt-3 text-base leading-relaxed text-cream-100/85">
                {card.upload.text}
              </p>
              {/* The biggest tap target on the card. Dark text on the orange,
                  so the label clears 4.5:1. */}
              <a
                href={PACKET_UPLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("packet_upload_click", { location: "workshop_card" })
                }
                className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-center text-lg leading-tight font-bold text-ink-950 transition-colors duration-200 hover:bg-orange-400 sm:inline-flex sm:px-8"
              >
                {card.upload.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          )}

          {card.summary && (
            <p className="mt-4 text-base leading-relaxed text-cream-100/85">
              {card.summary}
            </p>
          )}

          <ul
            className={`${card.upload || card.summary ? "mt-2" : "mt-3"} flex flex-col sm:flex-row sm:flex-wrap sm:gap-x-8`}
          >
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
        </div>
      </div>
    </section>
  );
}
