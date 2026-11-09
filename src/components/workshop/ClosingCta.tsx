import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import EmailText from "./EmailText";
import { workshop } from "../../data/workshop";

/**
 * The page's sign-off: one question and the one way to ask it. No button and
 * no dates; the series is over.
 */
export default function ClosingCta() {
  const { closing } = workshop;

  return (
    <section
      className="bg-cream-100 pb-16 md:pb-24"
      aria-labelledby="workshop-closing-heading"
    >
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-14 text-center md:px-12 md:py-20">
          {/* Warm glow behind the headline, same treatment as the Home CTA */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative">
            <h2
              id="workshop-closing-heading"
              className="mx-auto max-w-2xl font-serif text-title font-bold text-cream-100"
            >
              <SplitText text={closing.heading} />
            </h2>

            <Reveal delay={0.25}>
              <p className="mx-auto mt-5 max-w-2xl text-lead text-cream-100/80">
                <EmailText
                  text={closing.body}
                  className="nav-link font-semibold text-orange-300 hover:text-orange-200"
                />
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
