import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { To } from "react-router-dom";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import Portrait from "./Portrait";
import EmailText from "./EmailText";
import type { Speaker } from "../../data/workshop";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

/** Vertical offsets for the portrait strip, so it reads as a stagger. */
const PORTRAIT_STAGGER = ["mt-0", "mt-6 md:mt-10", "mt-12 md:mt-20"];

interface WorkshopHeroProps {
  eyebrow: string;
  heading: string;
  /** Any email address in it becomes a mailto link. */
  body: string;
  /** A text link under the body that jumps down the page. */
  jumpLink?: { label: string; to: To };
  /** A portrait strip beside the text. Without it the text runs alone. */
  speakers?: Speaker[];
  /** One small line at the very bottom of the hero. */
  note?: ReactNode;
}

/**
 * The top of /workshop and of each archived series' page: eyebrow, heading,
 * a short body, and optionally a jump link, a portrait strip and a small
 * note. No dates, and nothing to sign up for: the sessions block below
 * carries the dates.
 */
export default function WorkshopHero({
  eyebrow,
  heading,
  body,
  jumpLink,
  speakers,
  note,
}: WorkshopHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const portraits = speakers ?? [];
  const hasPortraits = portraits.length > 0;

  return (
    <section className="bg-cream-100 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="container-site">
        <p className="mb-4 max-w-2xl font-mono text-xs tracking-[0.2em] text-balance text-orange-600 uppercase md:text-sm">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-serif text-display font-bold text-balance text-ink-900">
          <SplitText text={heading} />
        </h1>

        <div
          className={
            hasPortraits
              ? "mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14"
              : "mt-10"
          }
        >
          {/* Text column */}
          <div>
            <Reveal delay={0.3}>
              <p className="max-w-xl text-lead text-ink-600">
                <EmailText
                  text={body}
                  className="nav-link font-semibold text-ink-900 hover:text-orange-600"
                />
              </p>
            </Reveal>

            {jumpLink && (
              <Reveal delay={0.4}>
                {/* A real link (e.g. /workshop/waupaca#session-3), so it also
                    works with JavaScript off; with it on, ScrollManager does
                    the scroll. */}
                <Link
                  to={jumpLink.to}
                  className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-ink-900 underline decoration-orange-500 underline-offset-4 transition-colors duration-200 hover:text-orange-700"
                >
                  {jumpLink.label}
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M8 3v10" />
                    <path d="m4 9 4 4 4-4" />
                  </svg>
                </Link>
              </Reveal>
            )}
          </div>

          {/* Portrait strip: the people who led the series */}
          {hasPortraits && (
            <div
              className="grid grid-cols-3 gap-3 self-start md:gap-4"
              aria-hidden="true"
            >
              {portraits.map((speaker, i) => (
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
          )}
        </div>

        {note && (
          <div className="mt-10 border-t border-cream-300 pt-5 md:mt-14">
            {note}
          </div>
        )}
      </div>
    </section>
  );
}
