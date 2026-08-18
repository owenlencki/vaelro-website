import type { RefObject } from "react";
import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import Portrait from "./Portrait";
import RegisterCta from "./RegisterCta";
import { workshop } from "../../data/workshop";
import type { SeriesPhase, WorkshopSession } from "../../data/workshop";
import { formatDateRow, formatNextSessionLine } from "../../lib/workshop";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface WorkshopHeroProps {
  phase: SeriesPhase;
  nextSession?: WorkshopSession;
  /** Watched by the sticky bar so it only shows once this button scrolls off. */
  ctaRef?: RefObject<HTMLDivElement | null>;
}

/** Vertical offsets for the portrait strip, so it reads as a stagger. */
const PORTRAIT_STAGGER = ["mt-0", "mt-6 md:mt-10", "mt-12 md:mt-20"];

export default function WorkshopHero({
  phase,
  nextSession,
  ctaRef,
}: WorkshopHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { hero } = workshop;

  const detailRow = [
    { text: `${hero.detailLead} · ${workshop.time}` },
    { text: formatDateRow(workshop.sessions), muted: phase === "complete" },
    { text: hero.detailVenue },
    { text: `${hero.detailFree} · Limited to ${workshop.capacity} businesses` },
  ];

  const microcopy =
    phase === "complete"
      ? workshop.postSeries.microcopy
      : workshop.registration.isFinal
        ? hero.microcopyFinal
        : hero.microcopyPending;

  return (
    <section className="bg-cream-100 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="container-site">
        {/* The headline spans the full container so it breaks on the two lines
            the copy deck sets, rather than wherever a column edge lands. */}
        <p className="mb-4 max-w-md font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {hero.eyebrow}
        </p>
        <h1 className="font-serif text-display font-bold text-ink-900">
          {hero.headingLines.map((line, i) => (
            <span key={line} className="block">
              <SplitText text={line} delay={i * 0.14} />
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14">
          {/* Text column */}
          <div>
            <Reveal delay={0.3}>
              <p className="max-w-xl text-lead text-ink-600">
                {hero.subhead}
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-ink-600">
                {hero.trustLine}
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              {/* The event details as one plain mono row */}
              {/* Each separator travels with the item after it, so a wrap
                  never strands a slash at the end of a line. */}
              <div className="mt-8 flex flex-wrap items-center gap-y-2 font-mono text-[0.7rem] tracking-[0.14em] text-ink-600 uppercase md:text-xs">
                {detailRow.map((item, i) => (
                  <span
                    key={item.text}
                    className={`inline-flex items-center gap-3 ${
                      item.muted ? "text-muted" : ""
                    }`}
                  >
                    {i > 0 && (
                      <span aria-hidden="true" className="text-cream-400">
                        /
                      </span>
                    )}
                    {item.text}
                  </span>
                ))}
              </div>

              {phase === "in-progress" && nextSession && (
                <p className="mt-6 font-semibold text-orange-600">
                  {formatNextSessionLine(nextSession, workshop.time)}
                </p>
              )}

              <div ref={ctaRef} className="mt-7">
                <RegisterCta phase={phase} location="hero" />
              </div>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                {microcopy}
              </p>
            </Reveal>
          </div>

          {/* Portrait strip: the three people leading the series */}
          <div
            className="grid grid-cols-3 gap-3 self-start md:gap-4"
            aria-hidden="true"
          >
            {workshop.speakers.map((speaker, i) => (
              <motion.div
                key={speaker.id}
                className={PORTRAIT_STAGGER[i]}
                initial={
                  reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Portrait
                  speaker={speaker}
                  loading="eager"
                  sizes="(min-width: 1024px) 10rem, 30vw"
                  className="rounded-xl shadow-[0_10px_30px_rgba(26,26,26,0.1)]"
                />
                <p className="mt-2 font-mono text-[0.6rem] tracking-[0.12em] text-muted uppercase">
                  {speaker.name.split(" ")[0]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
