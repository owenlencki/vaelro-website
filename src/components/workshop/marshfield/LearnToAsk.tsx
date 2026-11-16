import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { CopyButton } from "../session1/TryThis";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

/**
 * F: why the question matters, then the first prompt to try in the same
 * dashed card the Waupaca Session 1 page gives its bonus prompt.
 */
export default function LearnToAsk() {
  const { learnToAsk } = marshfieldSession1;

  return (
    <section
      id="learn-to-ask"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="learn-to-ask-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {learnToAsk.eyebrow}
        </p>
        <h2
          id="learn-to-ask-heading"
          className="max-w-3xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={learnToAsk.heading} />
        </h2>
        <p className="mt-5 max-w-2xl text-lead text-ink-600">{learnToAsk.body}</p>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-dashed border-orange-500 p-6 md:mt-14 md:flex-row md:items-center md:justify-between md:gap-10 md:p-7">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-orange-700 uppercase">
                {learnToAsk.tryFirstLabel}
              </p>
              <p className="mt-2 font-serif text-heading font-bold text-ink-900">
                &ldquo;{learnToAsk.prompt.prompt}&rdquo;
              </p>
              <p className="mt-2 max-w-xl leading-relaxed text-ink-600">
                {learnToAsk.after}
              </p>
            </div>
            <div className="shrink-0">
              <CopyButton
                item={learnToAsk.prompt}
                event="marshfield_session1_prompt_copy"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
