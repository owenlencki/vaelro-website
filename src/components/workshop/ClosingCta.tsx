import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import RegisterCta from "./RegisterCta";
import { workshop } from "../../data/workshop";
import type { SeriesPhase } from "../../data/workshop";

interface ClosingCtaProps {
  phase: SeriesPhase;
}

export default function ClosingCta({ phase }: ClosingCtaProps) {
  const wrapped = phase === "complete";
  const heading = wrapped
    ? workshop.postSeries.closingHeading
    : workshop.closing.heading;
  const detailLine = wrapped
    ? workshop.postSeries.closingDetailLine
    : workshop.closing.detailLine;

  return (
    <section
      className="bg-cream-100 pb-16 md:pb-24"
      aria-label="Reserve your seat"
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
                {detailLine}
              </p>

              <div className="mt-9 flex justify-center">
                <MagneticButton>
                  <RegisterCta
                    phase={phase}
                    location="closing"
                    className="shadow-[0_10px_40px_rgba(212,116,59,0.4)]"
                  />
                </MagneticButton>
              </div>

              {!wrapped && (
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
