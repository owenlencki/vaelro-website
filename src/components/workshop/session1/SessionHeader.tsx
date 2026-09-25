import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1, SESSION1_SLIDES_PDF } from "../../../data/session1";
import { workshop } from "../../../data/workshop";
import { withBase } from "../../../lib/paths";
import { trackEvent } from "../../../lib/analytics";

const casey = workshop.speakers.find((speaker) => speaker.id === "casey");

/**
 * Deliberately thin. Whoever is reading this is usually on a phone at their
 * table, so the header confirms they are in the right place and gets out of
 * the way. The slides button appears once SESSION1_SLIDES_PDF is set.
 */
export default function SessionHeader() {
  const { header } = session1;

  return (
    <header className="bg-cream-100 pt-28 pb-12 md:pt-36 md:pb-16">
      <div className="container-site">
        <p className="font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {header.date}
        </p>
        <h1 className="mt-4 font-serif text-title font-bold text-ink-900 md:text-display">
          <SplitText text={header.title} />
        </h1>

        <Reveal delay={0.25}>
          <div className="mt-6 flex max-w-xl items-center gap-4">
            {/* Decorative: the sentence beside it names him. */}
            {casey && (
              <img
                src={withBase(casey.photo[0].src)}
                alt=""
                width={56}
                height={56}
                decoding="async"
                className="h-14 w-14 shrink-0 rounded-full bg-peach-100 object-cover object-top"
              />
            )}
            <p className="leading-relaxed text-ink-600">{header.speaker}</p>
          </div>

          {SESSION1_SLIDES_PDF && (
            <a
              href={withBase(SESSION1_SLIDES_PDF)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("session1_slides_download")}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-orange-500 px-7 py-3 font-bold text-white transition-colors duration-200 hover:bg-orange-600"
            >
              <DownloadMark />
              {header.slidesLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </Reveal>
      </div>
    </header>
  );
}

function DownloadMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 3.5v9" />
      <path d="m6 9 4 4 4-4" />
      <path d="M4 16.5h12" />
    </svg>
  );
}
