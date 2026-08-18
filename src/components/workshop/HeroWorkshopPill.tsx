import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { workshop } from "../../data/workshop";
import {
  getNextSession,
  getPillCopy,
  getSeriesPhase,
} from "../../lib/workshop";
import { trackEvent } from "../../lib/analytics";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

/**
 * The tease that lives above the Home hero's eyebrow line. It is a link, not a
 * second button: it must not compete with "Book a Free Consultation" or push
 * that CTA out of the first viewport on a phone, which is why the short string
 * takes over under 640px.
 */
export default function HeroWorkshopPill() {
  const reducedMotion = usePrefersReducedMotion();

  const copy = useMemo(() => {
    const now = Date.now();
    const phase = getSeriesPhase(
      workshop.sessions,
      now,
      workshop.stageOverride,
    );
    return getPillCopy(
      workshop.pill,
      phase,
      getNextSession(workshop.sessions, now),
    );
  }, []);

  return (
    <Link
      to="/workshop"
      onClick={() => trackEvent("workshop_pill_click")}
      className="group/pill pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-orange-500/40 bg-ink-950/40 px-4 py-3 text-[13px] font-medium text-cream-100 backdrop-blur-md transition-colors duration-200 hover:border-orange-400/80 md:text-sm"
    >
      {/* Slow pulse, decorative, still under reduced motion */}
      <motion.span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full bg-orange-500"
        animate={reducedMotion ? undefined : { opacity: [1, 0.35, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="hidden sm:inline">{copy.full}</span>
      <span className="sm:hidden">{copy.short}</span>
      <span
        aria-hidden="true"
        className="shrink-0 transition-transform duration-200 group-hover/pill:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
