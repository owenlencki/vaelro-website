import Reveal from "../ui/Reveal";

export interface Feature {
  title: string;
  body: string;
  /** Small mono label above the title. */
  label?: string;
}

interface FeatureCardsProps {
  items: Feature[];
  columns?: 2 | 3;
}

/** Cream cards in a grid, revealed left to right across each row. */
export default function FeatureCards({ items, columns = 3 }: FeatureCardsProps) {
  return (
    <ul
      className={`mt-12 grid gap-6 md:mt-16 ${
        columns === 2 ? "md:grid-cols-2 md:gap-8" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {items.map((item, i) => (
        <li key={item.title}>
          <Reveal delay={(i % columns) * 0.08} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-cream-300 bg-cream-50 p-7 shadow-[0_2px_12px_rgba(26,26,26,0.04)] md:p-8">
              {item.label && (
                <p className="mb-4 font-mono text-[0.7rem] tracking-[0.15em] text-orange-600 uppercase">
                  {item.label}
                </p>
              )}
              <h3 className="font-serif text-heading font-bold text-ink-900">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-600">{item.body}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
