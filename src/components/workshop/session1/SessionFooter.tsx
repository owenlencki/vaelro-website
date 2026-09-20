import { Link } from "react-router-dom";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

/**
 * The page's sign-off. The site footer below it already carries the logo,
 * the email, and the Instagram handle, so this stays a single line and a
 * route back to the series page.
 */
export default function SessionFooter() {
  const { footer } = session1;

  return (
    <section className="bg-cream-100 pb-16 md:pb-24" aria-label="See you October 9">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-12 text-center md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-xl font-serif text-title font-bold text-cream-100">
              <SplitText text={footer.heading} />
            </h2>

            <Reveal delay={0.25}>
              <Link
                to={footer.linkTo}
                className="nav-link mt-6 inline-flex min-h-11 items-center font-semibold text-orange-300 hover:text-orange-200"
              >
                {footer.linkLabel}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
