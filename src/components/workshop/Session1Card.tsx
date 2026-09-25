import { Link } from "react-router-dom";
import { workshop } from "../../data/workshop";
import { SESSION1_SLIDES_PDF } from "../../data/session1";
import { trackEvent } from "../../lib/analytics";

/**
 * The first thing on /workshop, above the hero heading so it sits in the
 * first screen on a phone. The NFC tags and QR codes in the room open this
 * page; this card takes people on to the Session 1 resources. It only
 * mentions the slides once there are slides to get.
 */
export default function Session1Card() {
  const card = workshop.session1Card;

  return (
    <Link
      to={card.to}
      onClick={() => trackEvent("session1_card_click")}
      className="group mb-8 flex items-center gap-4 rounded-2xl bg-ink-900 py-4 pr-4 pl-5 text-cream-100 shadow-[0_2px_4px_rgba(26,26,26,0.06),0_14px_36px_rgba(26,26,26,0.12)] transition-colors duration-200 hover:bg-ink-800 sm:max-w-xl md:mb-10 md:py-5 md:pr-5 md:pl-6"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-serif text-lg leading-snug font-bold md:text-xl">
          {card.heading}
        </span>
        <span className="mt-1 block leading-snug text-cream-100/80">
          {SESSION1_SLIDES_PDF ? card.bodyWithSlides : card.body}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-ink-950 transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8h10" />
          <path d="m9 4 4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}
