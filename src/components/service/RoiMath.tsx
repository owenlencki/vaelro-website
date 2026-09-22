import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export interface RoiRow {
  /** Operator shown before the value; the first row has none. */
  op?: "×" | "=";
  value: string;
  label: string;
}

interface RoiMathProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  /** Worked example, top to bottom. The "=" row is the result. */
  rows: RoiRow[];
  heading: string;
  caption: string;
}

/** The dark band on Automation: the payback math, written out like a receipt. */
export default function RoiMath({
  eyebrow,
  title,
  paragraphs,
  rows,
  heading,
  caption,
}: RoiMathProps) {
  return (
    <section className="relative bg-ink-900 bg-noise py-12 md:py-24" aria-label={eyebrow}>
      <div className="container-site relative">
        <SectionHeading eyebrow={eyebrow} title={title} tone="dark" />

        <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
          <Reveal delay={0.15} className="space-y-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lead text-cream-100/75">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.25}>
            <figure className="rounded-2xl border border-cream-100/10 bg-ink-800/60 p-6 md:p-8">
              <p className="font-mono text-[0.7rem] tracking-[0.18em] text-cream-100/50 uppercase">
                {heading}
              </p>
              <ol className="mt-6">
                {rows.map((row) => {
                  const total = row.op === "=";
                  return (
                    <li
                      key={row.label}
                      className={`grid grid-cols-[1.5rem_minmax(0,auto)_1fr] items-baseline gap-x-3 py-3 ${
                        total ? "mt-2 border-t border-cream-100/15 pt-5" : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="font-serif text-2xl text-cream-100/40"
                      >
                        {row.op}
                      </span>
                      <span
                        className={`font-serif font-bold ${
                          total
                            ? "text-4xl text-orange-400 md:text-5xl"
                            : "text-3xl text-cream-100 md:text-4xl"
                        }`}
                      >
                        {row.value}
                      </span>
                      <span className="font-mono text-xs tracking-[0.12em] text-cream-100/60 uppercase">
                        {row.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <figcaption className="mt-5 text-sm leading-relaxed text-cream-100/60">
                {caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
