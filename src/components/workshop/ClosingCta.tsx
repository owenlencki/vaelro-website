import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import VenueLink from "./VenueLink";
import { workshop } from "../../data/workshop";
import type { SeriesPhase, WorkshopSession } from "../../data/workshop";
import { formatNextSessionLine } from "../../lib/workshop";

interface ClosingCtaProps {
  phase: SeriesPhase;
  nextSession?: WorkshopSession;
}

/**
 * The page's sign-off. Chamber registration has closed, so there is no button:
 * while the series runs it names the next session (the same line the hero
 * shows) and offers the two email links; once it wraps, it says thanks.
 */
export default function ClosingCta({ phase, nextSession }: ClosingCtaProps) {
  const running = phase !== "complete" && nextSession !== undefined;
  const heading = running
    ? formatNextSessionLine(nextSession, workshop.time)
    : workshop.postSeries.closingHeading;
  const detailLine = running
    ? workshop.closing.detailLine
    : workshop.postSeries.closingBody;

  return (
    <section
      className="bg-cream-100 pb-16 md:pb-24"
      aria-label={running ? "Next session" : "Thanks for coming"}
    >
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-14 text-center md:px-12 md:py-20">
          {/* Warm glow behind the headline, same treatment as the Home CTA */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-serif text-title font-bold text-cream-100">
              <SplitText text={heading} />
            </h2>

            <Reveal delay={0.25}>
              <p className="mx-auto mt-5 max-w-2xl text-cream-100/80">
                <VenueLink
                  text={detailLine}
                  className="nav-link font-semibold text-orange-300 hover:text-orange-200"
                />
              </p>

              {running && (
                <div className="mt-9 flex flex-col items-center gap-3">
                  {workshop.closing.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="nav-link inline-flex min-h-11 items-center text-center text-sm font-semibold text-cream-100/80 hover:text-cream-100"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
