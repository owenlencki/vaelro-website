import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

/**
 * The line to keep if you keep nothing else, set as the page's one big
 * typographic moment. The Super Bowl test right after it is the proof.
 */
export default function OneIdea() {
  const { idea } = session1;

  return (
    <section
      id="the-one-idea"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="the-one-idea-heading"
    >
      <div className="container-site">
        <p className="mb-5 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {idea.eyebrow}
        </p>
        <Reveal>
          <h2
            id="the-one-idea-heading"
            className="max-w-4xl font-serif text-title font-bold text-ink-900"
          >
            {idea.lead} <span className="text-orange-700">{idea.rest}</span>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}
