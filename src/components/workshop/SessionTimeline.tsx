import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";
import type { SessionStatus, WorkshopSession } from "../../data/workshop";
import { formatSessionDateLine } from "../../lib/workshop";
import { withBase } from "../../lib/paths";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface SessionTimelineProps {
  statuses: SessionStatus[];
}

/** Dark text on light orange, so the live badges clear 4.5:1 on the band. */
const badgeClasses: Record<SessionStatus, string> = {
  next: "bg-orange-400 text-ink-950",
  today: "bg-orange-400 text-ink-950",
  upcoming: "border border-cream-100/30 text-cream-100/80",
  completed: "border border-cream-100/20 text-cream-100/70",
};

function TimelineNode({
  status,
  reducedMotion,
}: {
  status: SessionStatus;
  reducedMotion: boolean;
}) {
  const live = status === "next" || status === "today";

  return (
    <span
      className="absolute top-1 left-0 flex h-[18px] w-[18px] items-center justify-center md:left-0"
      aria-hidden="true"
    >
      {/* Gentle pulse on the session the visitor should care about */}
      {live && !reducedMotion && (
        <motion.span
          className="absolute inset-0 rounded-full bg-orange-500"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2.1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span
        className={`relative h-[18px] w-[18px] rounded-full border-2 ${
          live
            ? "border-orange-500 bg-orange-500"
            : status === "completed"
              ? "border-cream-100/40 bg-cream-100/40"
              : "border-cream-100/35 bg-ink-900"
        }`}
      />
    </span>
  );
}

function Recap({ session }: { session: WorkshopSession }) {
  const { recap } = session;
  if (!recap) return null;

  return (
    <div className="mt-6 border-t border-cream-100/10 pt-6">
      <p className="font-mono text-[0.65rem] tracking-[0.18em] text-orange-400 uppercase">
        {workshop.series.recapLabel}
      </p>
      <ul className="mt-3 space-y-2">
        {recap.lines.map((line) => (
          <li key={line} className="leading-relaxed text-cream-100/80">
            {line}
          </li>
        ))}
      </ul>
      {recap.photo && (
        <div className="mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-ink-800">
          <img
            src={withBase(recap.photo)}
            alt={recap.photoAlt ?? ""}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {recap.link && (
        <a
          href={recap.link.href}
          className="nav-link mt-4 inline-flex min-h-11 items-center font-semibold text-orange-400 hover:text-orange-300"
        >
          {recap.link.label}
        </a>
      )}
    </div>
  );
}

/**
 * The three sessions as a vertical timeline. Card shell, padding, and rhythm
 * are identical whether or not a recap exists, so filling one in after a
 * session appends inside the card instead of reshaping the section.
 */
export default function SessionTimeline({ statuses }: SessionTimelineProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="sessions"
      className="relative overflow-hidden bg-ink-900 bg-noise py-12 md:py-24"
      aria-label="The series"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          {workshop.series.eyebrow}
        </p>
        <h2 className="max-w-3xl font-serif text-title font-bold text-cream-100">
          <SplitText text={workshop.series.heading} />
        </h2>

        <ol className="relative mt-12 md:mt-16">
          {/* The rail the nodes sit on */}
          <span
            className="absolute top-2 bottom-2 left-[8px] w-px bg-cream-100/15"
            aria-hidden="true"
          />

          {workshop.sessions.map((session, i) => {
            const status = statuses[i];
            return (
              <li key={session.slug} className="relative pb-8 pl-10 last:pb-0">
                <TimelineNode status={status} reducedMotion={reducedMotion} />
                <Reveal delay={0.05}>
                  <article className="rounded-2xl border border-ink-700 bg-ink-950/40 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.12em] uppercase ${badgeClasses[status]}`}
                      >
                        {workshop.series.badges[status]}
                      </span>
                      <span className="font-mono text-[0.7rem] tracking-[0.12em] text-cream-100/60 uppercase">
                        {formatSessionDateLine(session, workshop.time)}
                      </span>
                    </div>

                    <h3 className="mt-4 font-serif text-heading font-bold text-cream-100">
                      {session.title}
                    </h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-cream-100/80">
                      {session.blurb}
                    </p>
                    <p className="mt-4 font-mono text-[0.7rem] tracking-[0.12em] text-orange-400 uppercase">
                      {session.leaders}
                    </p>

                    <Recap session={session} />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
