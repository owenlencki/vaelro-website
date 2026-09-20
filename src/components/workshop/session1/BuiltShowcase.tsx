import { motion } from "framer-motion";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import type { SoftwareItem, WebsiteItem } from "../../../data/session1";
import { withBase } from "../../../lib/paths";
import { trackEvent } from "../../../lib/analytics";
import { fadeUp, staggerContainer } from "../../../lib/animations";

/** Small label above each half of the section, with a rule running off it. */
function SubHeading({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="font-mono text-[0.7rem] tracking-[0.18em] text-ink-900 uppercase md:text-xs">
        {children}
      </h3>
      <span className="h-px flex-1 bg-cream-300" aria-hidden="true" />
    </div>
  );
}

function ArrowOut() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.5 4.5h6v6" />
    </svg>
  );
}

function SoftwareCard({ item }: { item: SoftwareItem }) {
  return (
    <motion.figure
      variants={fadeUp}
      className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-[0_10px_30px_rgba(26,26,26,0.06)]"
    >
      {/* Fixed-ratio frame, so swapping the screenshot never shifts the page.
          16:9 is what a laptop screen capture already is, so the cover fit
          trims nothing and no dashboard card gets sliced at the edge. */}
      <div className="aspect-[16/9] overflow-hidden border-b border-cream-300 bg-ink-900">
        {item.image && (
          <img
            src={withBase(item.image)}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>
      <figcaption className="p-5 md:p-7">
        <p className="font-mono text-[0.65rem] tracking-[0.18em] text-orange-600 uppercase">
          {item.kind}
        </p>
        <h4 className="mt-2 font-serif text-heading font-bold text-ink-900">
          {item.name}
        </h4>
        <p className="mt-3 leading-relaxed text-ink-600">{item.body}</p>
        <p className="mt-4 border-t border-cream-300 pt-4 font-mono text-[0.7rem] leading-relaxed text-ink-900">
          {item.credit}
        </p>
      </figcaption>
    </motion.figure>
  );
}

function WebsiteCard({ site }: { site: WebsiteItem }) {
  return (
    <motion.li variants={fadeUp}>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("session1_site_click", { site_id: site.id })}
        className="group block overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 transition-colors duration-200 hover:border-orange-400"
      >
        <div className="aspect-[16/10] overflow-hidden border-b border-cream-300 bg-cream-200">
          {site.image && (
            <img
              src={withBase(site.image)}
              alt={site.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          )}
        </div>
        <div className="p-5">
          <p className="font-serif text-lg font-bold text-ink-900">
            {site.name}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[0.75rem] text-orange-600">
            {site.domain}
            <ArrowOut />
            <span className="sr-only"> (opens in a new tab)</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            {site.blurb}
          </p>
        </div>
      </a>
    </motion.li>
  );
}

/**
 * The eye candy: two pieces of real software and three live sites, all built
 * with AI. The point of the section is the screenshots, so the copy around
 * them stays out of the way.
 */
export default function BuiltShowcase() {
  const { built } = session1;

  return (
    <section
      id="what-we-built"
      className="bg-cream-100 py-12 md:py-20"
      aria-label="What we built"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {built.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={built.heading} />
        </h2>

        {/* Software */}
        <Reveal delay={0.1} className="mt-10 md:mt-14">
          <SubHeading>{built.softwareLabel}</SubHeading>
        </Reveal>
        <motion.div
          className="mt-6 grid gap-6 md:grid-cols-2 md:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {built.software.map((item) => (
            <SoftwareCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Websites */}
        <Reveal delay={0.1} className="mt-12 md:mt-16">
          <SubHeading>{built.websitesLabel}</SubHeading>
        </Reveal>
        <motion.ul
          className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {built.websites.map((site) => (
            <WebsiteCard key={site.id} site={site} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
