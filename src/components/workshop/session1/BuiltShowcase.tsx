import { Link } from "react-router-dom";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import type { SoftwareItem, WebsiteItem } from "../../../data/session1";
import { withBase } from "../../../lib/paths";
import { trackEvent } from "../../../lib/analytics";

type ShowcaseItem = (SoftwareItem & { site?: never }) | (WebsiteItem & { site: true });

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
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
  );
}

/**
 * One piece of work, linking to its case study. Software and websites share
 * the card; only the software carries the line about who built it.
 */
function WorkCard({ item }: { item: ShowcaseItem }) {
  const { built } = session1;

  return (
    <li className="w-[84vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none">
      <Link
        to={`/work/${item.slug}`}
        onClick={() => trackEvent("session1_work_click", { slug: item.slug })}
        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {/* Fixed 16:9 frame, so a missing or swapped screenshot never shifts
            the page. The dashboards are laptop captures and fit it exactly,
            with no edge sliced off; the site captures lose a sliver at the
            bottom, below their hero. */}
        <div className="aspect-[16/9] overflow-hidden bg-ink-900">
          {item.image && (
            <img
              src={withBase(item.image)}
              alt={item.alt}
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="font-mono text-[0.7rem] tracking-[0.16em] text-orange-700 uppercase">
            {item.site ? built.websiteKind : item.kind}
          </p>
          <h3 className="mt-2 font-serif text-xl font-bold text-ink-900 md:text-2xl">
            {item.name}
          </h3>
          <p className="mt-2 leading-relaxed text-ink-600">
            {item.site ? item.blurb : item.body}
          </p>
          {!item.site && (
            <p className="mt-4 border-t border-cream-300 pt-4 font-mono text-[0.75rem] leading-relaxed text-ink-900">
              {item.credit}
            </p>
          )}
          <p className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-orange-700">
            {built.caseStudyLabel}
            <Arrow />
          </p>
        </div>
      </Link>
    </li>
  );
}

/**
 * Two pieces of software and two websites, all built with AI, each opening its
 * case study. A swipe row on a phone keeps the section short; from tablet up
 * it is a two-by-two grid.
 */
export default function BuiltShowcase() {
  const { built } = session1;
  const items: ShowcaseItem[] = [
    ...built.software,
    ...built.websites.map((site) => ({ ...site, site: true as const })),
  ];

  return (
    <section
      id="what-we-built"
      className="bg-cream-200 py-14 md:py-24"
      aria-labelledby="what-we-built-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {built.eyebrow}
        </p>
        <h2
          id="what-we-built-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={built.heading} />
        </h2>
      </div>

      {/* Bleeds to the screen edge on a phone so the row reads as swipeable.
          The insets restate .container-site, which has no md: variant. */}
      <ul className="mt-10 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-2 md:gap-8 md:overflow-visible md:px-10">
        {items.map((item) => (
          <WorkCard key={item.id} item={item} />
        ))}
      </ul>

      <div className="container-site">
        <Reveal delay={0.1}>
          <Link
            to={built.moreTo}
            className="group nav-link mt-8 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink-900 hover:text-orange-700 md:mt-10"
          >
            {built.moreLabel}
            <Arrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
