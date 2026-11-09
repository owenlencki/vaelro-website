import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import Portrait from "./Portrait";
import EmailText from "./EmailText";
import { workshop } from "../../data/workshop";
import { session3 } from "../../data/session3";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

/** Vertical offsets for the portrait strip, so it reads as a stagger. */
const PORTRAIT_STAGGER = ["mt-0", "mt-6 md:mt-10", "mt-12 md:mt-20"];

/**
 * The top of /workshop now that the series has wrapped: the thank you, the one
 * way to ask a question, and a jump down to the free versions. No dates, no
 * venue, and nothing to sign up for.
 */
export default function WorkshopHero() {
  const reducedMotion = usePrefersReducedMotion();
  const { hero } = workshop;

  return (
    <section className="bg-cream-100 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="container-site">
        <p className="mb-4 max-w-md font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {workshop.title}
        </p>
        <h1 className="max-w-4xl font-serif text-display font-bold text-balance text-ink-900">
          <SplitText text={hero.heading} />
        </h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-14">
          {/* Text column */}
          <div>
            <Reveal delay={0.3}>
              <p className="max-w-xl text-lead text-ink-600">
                <EmailText
                  text={hero.body}
                  className="nav-link font-semibold text-ink-900 hover:text-orange-600"
                />
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              {/* A real link (/workshop#session-3), so it also works with
                  JavaScript off; with it on, ScrollManager does the scroll. */}
              <Link
                to={{ hash: "#session-3" }}
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-ink-900 underline decoration-orange-500 underline-offset-4 transition-colors duration-200 hover:text-orange-700"
              >
                {session3.heroLink}
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
          </div>

          {/* Portrait strip: the three people who led the series */}
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
