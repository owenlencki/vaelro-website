import { Link } from "react-router-dom";
import { workshop } from "../../data/workshop";
import type { SeriesPhase } from "../../data/workshop";
import { trackEvent } from "../../lib/analytics";

export type CtaLocation = "hero" | "closing" | "sticky";

interface RegisterCtaProps {
  phase: SeriesPhase;
  /** Sent to GA4 as the `location` param, matching the site's booking_click. */
  location: CtaLocation;
  className?: string;
}

const baseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-orange-600";

/**
 * The page's primary button. Registration lives with the Chamber, so before
 * the series this is an external link that announces the new tab; once the
 * series has wrapped it becomes the internal Gameplan call CTA.
 */
export default function RegisterCta({
  phase,
  location,
  className,
}: RegisterCtaProps) {
  const classes = `${baseClasses} ${className ?? ""}`;
  const track = () => trackEvent("workshop_register_click", { location });

  if (phase === "complete") {
    return (
      <Link to={workshop.postSeries.ctaHref} onClick={track} className={classes}>
        {workshop.postSeries.ctaLabel}
      </Link>
    );
  }

  return (
    <a
      href={workshop.registration.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      className={classes}
    >
      {workshop.registration.label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
