import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

/**
 * The five pillars as cards to pick from, then the ask. Unnumbered: they are
 * five places to look, not five steps. On a two-column phone-landscape or
 * tablet layout the fifth card spans the row rather than sitting alone.
 */
export default function Homework() {
  const { homework } = session1;

  return (
    <section
      id="homework"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="homework-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {homework.eyebrow}
        </p>
        <h2
          id="homework-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={homework.heading} />
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-5">
          {homework.pillars.map((pillar) => (
            <li
              key={pillar.id}
              className="rounded-2xl bg-cream-50 p-5 shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)] sm:last:col-span-2 md:p-6 lg:last:col-span-1"
            >
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {pillar.name}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-600">
                {pillar.examples}
              </p>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl border-l-2 border-orange-500 pl-5 font-serif text-heading font-bold text-ink-900 md:mt-14">
            {homework.instruction}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
