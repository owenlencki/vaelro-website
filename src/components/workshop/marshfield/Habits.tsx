import SplitText from "../../ui/SplitText";
import { marshfieldSession1 } from "../../../data/workshops/marshfield-session1";

/** G: the five habits, numbered, each a bold line and the how-to under it. */
export default function Habits() {
  const { habits } = marshfieldSession1;

  return (
    <section
      id="habits"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="habits-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {habits.eyebrow}
        </p>
        <h2
          id="habits-heading"
          className="max-w-3xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={habits.heading} />
        </h2>

        <ol className="mt-10 max-w-3xl md:mt-14">
          {habits.items.map((habit, i) => (
            <li
              key={habit.title}
              className="flex gap-4 border-t border-cream-300 py-5 md:gap-6"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-mono text-sm tracking-[0.18em] text-orange-700 md:text-base"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
                  {habit.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-ink-600 md:text-lg">
                  {habit.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
