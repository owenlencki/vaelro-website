import SplitText from "../../ui/SplitText";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

const cardShadow =
  "shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]";

/** C: six everyday jobs as cards, three across on a laptop, one on a phone. */
export default function SavesTime() {
  const { savesTime } = marshfieldSession1;

  return (
    <section
      id="where-it-saves-time"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="where-it-saves-time-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {savesTime.eyebrow}
        </p>
        <h2
          id="where-it-saves-time-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={savesTime.heading} />
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-5">
          {savesTime.items.map((item) => (
            <li
              key={item.name}
              className={`rounded-2xl bg-cream-50 p-5 md:p-6 ${cardShadow}`}
            >
              <h3 className="font-serif text-xl font-bold text-ink-900">
                {item.name}
              </h3>
              <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
