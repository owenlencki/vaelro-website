import SplitText from "../../ui/SplitText";
import { CopyButton } from "../session1/TryThis";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

const cardShadow =
  "shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]";

/**
 * H: the one prompt, set large on the same card as the Waupaca Session 1
 * page's featured prompt, with the site's Copy button under it.
 */
export default function OnePrompt() {
  const { onePrompt } = marshfieldSession1;
  const { prompt } = onePrompt;

  return (
    <section
      id="try-this-week"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="try-this-week-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {onePrompt.eyebrow}
        </p>
        <h2
          id="try-this-week-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={onePrompt.heading} />
        </h2>

        <div className={`mt-10 rounded-2xl bg-cream-50 p-6 md:mt-14 md:p-10 ${cardShadow}`}>
          <p className="max-w-4xl rounded-xl border-l-2 border-orange-500 bg-cream-100 px-5 py-5 font-serif text-heading leading-snug text-ink-900 md:px-7 md:py-6">
            &ldquo;{prompt.prompt}&rdquo;
          </p>
          {prompt.note && <p className="mt-3 text-ink-600">{prompt.note}</p>}

          <div className="mt-6">
            <CopyButton item={prompt} event="marshfield_session1_prompt_copy" />
          </div>
        </div>
      </div>
    </section>
  );
}
