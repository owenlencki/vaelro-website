import SplitText from "../../ui/SplitText";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

/**
 * A: the one way to think about it, then its five rules as a two-column list
 * of hairline-topped items, numbered the way the slide numbers them.
 */
export default function ThinkOfIt() {
  const { thinkOfIt } = marshfieldSession1;

  return (
    <section
      id="how-to-think-about-it"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="how-to-think-about-it-heading"
    >
      <div className="container-site">
        <p className="mb-5 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {thinkOfIt.eyebrow}
        </p>
        <h2
          id="how-to-think-about-it-heading"
          className="max-w-4xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={thinkOfIt.heading} />
        </h2>

        <ol className="mt-10 grid gap-x-12 gap-y-6 md:mt-14 md:grid-cols-2 md:gap-y-8">
          {thinkOfIt.points.map((point, i) => (
            <li key={point} className="flex gap-4 border-t border-cream-400 pt-5">
              <span
                aria-hidden="true"
                className="pt-1 font-mono text-sm tracking-[0.18em] text-orange-700"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
                {point}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
