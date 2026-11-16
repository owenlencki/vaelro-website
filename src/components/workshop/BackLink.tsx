import { Link } from "react-router-dom";

interface BackLinkProps {
  label: string;
  to: string;
  className?: string;
}

/** A quiet "back to the series" text link at the top of a session page. */
export default function BackLink({ label, to, className = "" }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={`group inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:text-orange-700 ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13 8H3" />
        <path d="m7 4-4 4 4 4" />
      </svg>
      <span className="underline decoration-cream-400 underline-offset-4 transition-colors duration-200 group-hover:decoration-orange-500">
        {label}
      </span>
    </Link>
  );
}
