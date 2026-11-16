import { Link } from "react-router-dom";

interface ArchivedSeries {
  /** The archive page, e.g. "/workshop/waupaca". */
  path: string;
  archiveCard: { label: string; linkLabel: string };
}

interface PastWorkshopsProps {
  heading: string;
  series: ArchivedSeries[];
}

const cardShadow =
  "shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]";

/**
 * One card per finished series, newest first, each opening that series'
 * archive page. The whole card is the link.
 */
export default function PastWorkshops({ heading, series }: PastWorkshopsProps) {
  if (series.length === 0) return null;

  return (
    <section
      id="past-workshops"
      aria-labelledby="past-workshops-heading"
      className="bg-cream-100 py-10 md:py-14"
    >
      <div className="container-site">
        <h2
          id="past-workshops-heading"
          className="font-serif text-heading font-bold text-ink-900"
        >
          {heading}
        </h2>

        <ul className="mt-6 grid gap-5 md:grid-cols-2 md:gap-6">
          {series.map(({ path, archiveCard }) => (
            <li key={path}>
              <Link
                to={path}
                className={`group flex h-full flex-col rounded-2xl bg-cream-50 p-5 transition-transform duration-200 hover:-translate-y-0.5 md:p-7 ${cardShadow}`}
              >
                <p className="font-mono text-sm leading-relaxed tracking-[0.08em] text-orange-700 uppercase">
                  {archiveCard.label}
                </p>
                <p className="mt-3 inline-flex items-center gap-2 font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
                  <span className="underline decoration-orange-500/50 underline-offset-4 transition-colors duration-200 group-hover:decoration-orange-500">
                    {archiveCard.linkLabel}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10" />
                    <path d="m9 4 4 4-4 4" />
                  </svg>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
