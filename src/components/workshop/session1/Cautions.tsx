import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

/**
 * Four cautions as a plain two-by-two of hairline-topped items (the prompts
 * above are cards, so these deliberately are not), then the one rule on a
 * dark card: the single thing on the page worth remembering under pressure.
 */
export default function Cautions() {
  const { cautions } = session1;

  return (
    <section
      id="cautions"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="cautions-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {cautions.eyebrow}
        </p>
        <h2
          id="cautions-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={cautions.heading} />
        </h2>

        <ul className="mt-10 grid gap-x-12 gap-y-8 md:mt-14 md:grid-cols-2 md:gap-y-10">
          {cautions.items.map((caution) => (
            <li key={caution.id} className="border-t border-cream-400 pt-5">
              <h3 className="font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
                {caution.title}
              </h3>
              <p className="mt-2 max-w-md leading-relaxed text-ink-600">
                {caution.body}
              </p>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="relative mt-12 overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-9 md:mt-16 md:px-12 md:py-12">
            <div className="relative">
              <p className="font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
                {cautions.rule.label}
              </p>
              <p className="mt-4 max-w-3xl font-serif text-heading font-bold text-cream-100 md:text-title">
                {cautions.rule.text}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
