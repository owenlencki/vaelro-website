import SplitText from "../../ui/SplitText";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";
import { PACKET_UPLOAD_URL } from "../../../data/workshop";
import { trackEvent } from "../../../lib/analytics";

/**
 * I: the dark band, as on the Waupaca Session 2 page. The three steps between
 * the sessions, then the upload reminder with its button and the line about
 * the summary.
 */
export default function WhatHappensNext() {
  const { next } = marshfieldSession1;

  return (
    <section
      id="what-happens-next"
      className="relative overflow-hidden bg-ink-900 bg-noise py-14 md:py-24"
      aria-labelledby="what-happens-next-heading"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          {next.eyebrow}
        </p>
        <h2
          id="what-happens-next-heading"
          className="max-w-3xl font-serif text-title font-bold text-cream-100"
        >
          <SplitText text={next.heading} />
        </h2>

        <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
          {next.steps.map((step, i) => (
            <li key={step.title} className="border-t border-cream-100/15 pt-5">
              <span
                aria-hidden="true"
                className="font-mono text-sm tracking-[0.18em] text-orange-400"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-xl leading-snug font-bold text-cream-100 md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-lead text-cream-100/85">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-ink-700 bg-ink-950/40 p-6 sm:max-w-2xl md:mt-16 md:p-8">
          <p className="text-lead text-cream-100/90">{next.upload.text}</p>
          {/* Dark text on the orange, so the label clears 4.5:1. */}
          <a
            href={PACKET_UPLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("packet_upload_click", { location: "marshfield_session1" })
            }
            className="mt-5 flex min-h-14 items-center justify-center rounded-full bg-orange-500 px-4 py-3 text-center text-lg leading-tight font-bold text-ink-950 transition-colors duration-200 hover:bg-orange-400 sm:inline-flex sm:px-8"
          >
            {next.upload.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="mt-5 leading-relaxed text-cream-100/80">{next.summary}</p>
        </div>
      </div>
    </section>
  );
}
