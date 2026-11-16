import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

/**
 * D: what AI is good at beside what stays yours, as two sets of tags (the
 * second set dark, because it is the one that matters), then the line about
 * how little of what we build runs on AI, on a dark card.
 */
export default function YouDecide() {
  const { youDecide } = marshfieldSession1;
  const columns = [
    { ...youDecide.goodAt, tag: "border border-cream-400 bg-cream-50 text-ink-900" },
    { ...youDecide.keepYours, tag: "bg-ink-900 text-cream-50" },
  ];

  return (
    <section
      id="you-decide"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="you-decide-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {youDecide.eyebrow}
        </p>
        <h2
          id="you-decide-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={youDecide.heading} />
        </h2>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
          {columns.map((column) => (
            <div key={column.label} className="border-t border-cream-400 pt-5">
              <h3 className="font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
                {column.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className={`rounded-full px-4 py-1.5 text-base ${column.tag}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="relative mt-12 overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-9 md:mt-16 md:px-12 md:py-12">
            <p className="relative max-w-3xl font-serif text-heading font-bold text-cream-100">
              {youDecide.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
