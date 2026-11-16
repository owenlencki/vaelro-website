import SplitText from "../../ui/SplitText";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

/**
 * E: the one rule on a dark card first, so nobody scrolls past it, then the
 * switch to turn off in each tool, then the small print about names changing.
 */
export default function Setup() {
  const { setup } = marshfieldSession1;

  return (
    <section
      id="setup"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="setup-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {setup.eyebrow}
        </p>
        <h2
          id="setup-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={setup.heading} />
        </h2>

        <div
          role="note"
          className="mt-10 max-w-3xl rounded-2xl border-l-4 border-orange-500 bg-ink-900 p-5 md:mt-14 md:p-7"
        >
          <p className="font-serif text-xl leading-snug font-bold text-cream-50 md:text-2xl">
            {setup.rule}
          </p>
        </div>

        <ul className="mt-10 grid max-w-4xl gap-x-12 gap-y-6 md:grid-cols-2 md:gap-y-8">
          {setup.tools.map((tool) => (
            <li key={tool.name} className="border-t border-cream-300 pt-5">
              <h3 className="font-serif text-xl font-bold text-ink-900 md:text-2xl">
                {tool.name}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-600">{tool.text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-500">
          {setup.smallPrint}
        </p>
      </div>
    </section>
  );
}
