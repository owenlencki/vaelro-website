import type { ReactNode } from "react";
import { workshop } from "../../data/workshop";

/**
 * Wraps the venue in a link to its map. Two shapes, because the venue is
 * written two ways on this page: `children` links a whole phrase (the hero's
 * details row says "Chamber office, downtown Waupaca"), while `text` links only
 * the venue's name where it sits inside a longer sentence (the closing line and
 * the parking answer). Both fall back to plain text if mapUrl is ever cleared.
 */
export default function VenueLink({
  text,
  children,
  className,
}: {
  text?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { name, mapUrl } = workshop.venue;

  const anchor = (label: ReactNode) => (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
      <span className="sr-only"> (opens a map in a new tab)</span>
    </a>
  );

  if (children) return mapUrl ? anchor(children) : <>{children}</>;
  if (!text) return null;
  if (!mapUrl || !text.includes(name)) return <>{text}</>;

  const [before, ...rest] = text.split(name);
  return (
    <>
      {before}
      {anchor(name)}
      {rest.join(name)}
    </>
  );
}
