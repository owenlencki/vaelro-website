import { Link } from "react-router-dom";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { PromptCard } from "../session1/TryThis";
import { session2, SESSION2_PACKET_PDF } from "../../../data/session2";
import { withBase } from "../../../lib/paths";
import { trackEvent } from "../../../lib/analytics";

/**
 * Three prompts on Session 1's prompt cards (same card, same Copy button),
 * the note that goes with them, the quick math as a plain card with nothing
 * to tap, and the way back to Session 1. The blank packet download appears
 * between those once SESSION2_PACKET_PDF is set.
 */
export default function Resources() {
  const { resources } = session2;

  return (
    <section
      id="free-resources"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="free-resources-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {resources.eyebrow}
        </p>
        <h2
          id="free-resources-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={resources.heading} />
        </h2>
        <p className="mt-5 max-w-2xl text-lead text-ink-600">
          {resources.intro}
        </p>

        {/* These prompts run to three sentences, so the cards only go three
            across once there is room for that; until then they stack. */}
        <ul className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3 lg:gap-6">
          {resources.prompts.map((item) => (
            <PromptCard
              key={item.id}
              item={item}
              as="h3"
              copyEvent="session2_prompt_copy"
            />
          ))}
        </ul>
        <p className="mt-6 max-w-2xl leading-relaxed text-ink-600">
          {resources.note}
        </p>

        {/* Reads lighter than the prompt cards: a dashed outline, no button. */}
        <Reveal delay={0.1}>
          <div className="mt-10 max-w-2xl rounded-2xl border border-dashed border-orange-500 p-6 md:mt-14 md:p-7">
            <p className="font-mono text-xs tracking-[0.2em] text-orange-700 uppercase">
              {resources.quickMath.label}
            </p>
            <p className="mt-3 font-serif text-xl leading-snug text-ink-900">
              {resources.quickMath.text}
            </p>
          </div>
        </Reveal>

        {SESSION2_PACKET_PDF && (
          <div className="mt-10 md:mt-14">
            {/* Outlined, so "Upload my packet" stays the page's one orange
                button. Tight padding and a touch smaller on a phone: the
                label has to stay on one line at 375px. */}
            <a
              href={withBase(SESSION2_PACKET_PDF)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("session2_packet_download")}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-4 py-3 text-[0.95rem] font-bold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-cream-50 sm:w-auto sm:gap-2.5 sm:px-7 sm:text-base"
            >
              <DownloadMark />
              {resources.packet.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-600">
              {resources.packet.line}
            </p>
          </div>
        )}

        <div className="mt-8 md:mt-10">
          <Link
            to={resources.session1Link.to}
            className="group nav-link inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-900 hover:text-orange-700"
          >
            {resources.session1Link.label}
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
        </div>
      </div>
    </section>
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
