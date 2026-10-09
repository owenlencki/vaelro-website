import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session2 } from "../../../data/session2";

/**
 * The page's dark band, where Session 1's had the Super Bowl test: what
 * becomes of the pages once they are sent in. The line about the summary
 * shows only while its string in the data file is non-empty.
 */
export default function WhatsNext() {
  const { next } = session2;

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
            <li key={step} className="border-t border-cream-100/15 pt-5">
              <span
                aria-hidden="true"
                className="font-mono text-sm tracking-[0.18em] text-orange-400"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-lead text-cream-100/90">{step}</p>
            </li>
          ))}
        </ol>

        {next.summaryLine && (
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl border-l-2 border-orange-500 pl-5 leading-relaxed text-cream-100/85 md:mt-14">
              {next.summaryLine}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
