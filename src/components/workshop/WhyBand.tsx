import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";

/**
 * One wide text block in the cream alt tone. Renders nothing until the copy
 * deck's paragraphs are in the data file, so the page never shows an empty
 * band waiting for content.
 */
export default function WhyBand() {
  const { whyBand } = workshop;
  if (whyBand.body.length === 0) return null;

  return (
    <section className="bg-peach-50 py-12 md:py-24" aria-label="Why we are doing this">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {whyBand.eyebrow}
        </p>
        <h2 className="max-w-3xl font-serif text-title font-bold text-ink-900">
          <SplitText text={whyBand.heading} />
        </h2>
        <Reveal delay={0.15}>
          <div className="mt-8 max-w-3xl space-y-5">
            {whyBand.body.map((paragraph) => (
              <p key={paragraph} className="text-lead text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
