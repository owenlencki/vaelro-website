import { workshop } from "../../data/workshop";
import { trackEvent } from "../../lib/analytics";

export type CtaLocation = "hero" | "closing" | "sticky";

interface RegisterCtaProps {
  /** Sent to GA4 as the `location` param. */
  location: CtaLocation;
  className?: string;
}

const baseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white transition-colors duration-200 hover:bg-orange-600";

/**
 * The page's primary button: an external link to Chamber registration that
 * announces the new tab. Once the series has wrapped there is nothing to
 * register for, so callers stop rendering this rather than swapping its label.
 */
export default function RegisterCta({ location, className }: RegisterCtaProps) {
  const classes = `${baseClasses} ${className ?? ""}`;
  const track = () => trackEvent("workshop_register_click", { location });

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
