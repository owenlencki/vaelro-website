import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import type { SessionStatus, WorkshopSession } from "../../data/workshop";
import { formatSessionDateLine } from "../../lib/workshop";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface SessionTimelineProps {
  block: {
    eyebrow: string;
    heading: string;
    /** Where the sessions are, under the heading. */
    venueLine?: string;
    badges: Record<SessionStatus, string>;
  };
  sessions: WorkshopSession[];
  /** Written-out time for every session, e.g. "10:30 a.m. to noon". */
  time: string;
  /** One per session, from getSessionStatuses at the page's "now". */
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
      className="absolute top-1 left-0 flex h-[18px] w-[18px] items-center justify-center"
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

/**
 * The sessions as a vertical timeline on the dark band, each with its live
 * status. The statuses come from the dates alone (src/lib/workshop.ts), so
 * the badges move from "Next up" to "Today" to "Completed" on their own.
 */
export default function SessionTimeline({
  block,
  sessions,
  time,
  statuses,
}: SessionTimelineProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="sessions"
      className="relative overflow-hidden bg-ink-900 bg-noise py-12 md:py-24"
      aria-labelledby="sessions-heading"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          {block.eyebrow}
        </p>
        <h2
          id="sessions-heading"
          className="max-w-3xl font-serif text-title font-bold text-cream-100"
        >
          <SplitText text={block.heading} />
        </h2>
        {block.venueLine && (
          <p className="mt-4 max-w-2xl text-lead text-cream-100/80">
            {block.venueLine}
          </p>
        )}

        <ol className="relative mt-12 md:mt-16">
          {/* The rail the nodes sit on */}
          <span
            className="absolute top-2 bottom-2 left-[8px] w-px bg-cream-100/15"
            aria-hidden="true"
          />

          {sessions.map((session, i) => {
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
                        {block.badges[status]}
                      </span>
                      <span className="font-mono text-[0.7rem] tracking-[0.12em] text-cream-100/60 uppercase">
                        {formatSessionDateLine(session, time)}
                      </span>
                    </div>

                    <p className="mt-4 font-mono text-[0.7rem] tracking-[0.12em] text-orange-400 uppercase">
                      Session {session.number}
                    </p>
                    <h3 className="mt-1 font-serif text-heading font-bold text-cream-100">
                      {session.title}
                    </h3>
                    {session.blurb && (
                      <p className="mt-3 max-w-2xl leading-relaxed text-cream-100/80">
                        {session.blurb}
                      </p>
                    )}
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
