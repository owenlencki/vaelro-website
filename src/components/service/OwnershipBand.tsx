import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

interface Stat {
  label: string;
  value: string;
  body: string;
}

interface OwnershipBandProps {
  eyebrow: string;
  title: string;
  lead: string;
  stats: Stat[];
  /** Everything the client owns, one short noun phrase each. */
  owned: string[];
  ownedNote: string;
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The dark band on Web Design: what the site does, and what the client owns. */
export default function OwnershipBand({
  eyebrow,
  title,
  lead,
  stats,
  owned,
  ownedNote,
}: OwnershipBandProps) {
  return (
    <section className="relative bg-ink-900 bg-noise py-12 md:py-24" aria-label={eyebrow}>
      <div className="container-site relative">
        <SectionHeading eyebrow={eyebrow} title={title} tone="dark" />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lead text-cream-100/75">{lead}</p>
        </Reveal>

        <ul className="mt-12 grid gap-10 border-t border-cream-100/10 pt-10 md:mt-16 md:grid-cols-3">
          {stats.map((stat, i) => (
            <li key={stat.label}>
              <Reveal delay={i * 0.08}>
                <p className="font-mono text-[0.7rem] tracking-[0.18em] text-cream-100/50 uppercase">
                  {stat.label}
                </p>
                <p className="mt-3 font-serif text-4xl font-bold text-orange-400 md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 leading-relaxed text-cream-100/75">{stat.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-2xl border border-cream-100/10 bg-ink-800/60 p-6 md:mt-16 md:p-8">
            <p className="font-mono text-[0.7rem] tracking-[0.18em] text-cream-100/50 uppercase">
              In your name, from day one
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {owned.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 px-4 py-2 font-semibold text-cream-100"
                >
                  <span className="text-orange-400">
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-2xl leading-relaxed text-cream-100/75">
              {ownedNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
