import { motion } from "framer-motion";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import { fadeUp, staggerContainer } from "../../../lib/animations";

/**
 * The five pillars, as a numbered list rather than a card grid: the ask is to
 * pick one, and a list reads like a thing you choose from.
 */
export default function Homework() {
  const { homework } = session1;

  return (
    <section
      id="homework"
      className="bg-cream-100 py-12 md:py-20"
      aria-label="Your homework for October 9"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {homework.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={homework.heading} />
        </h2>

        <motion.ol
          className="mt-10 border-t border-cream-300 md:mt-14"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {homework.pillars.map((pillar, i) => (
            <motion.li
              key={pillar.id}
              variants={fadeUp}
              className="flex items-baseline gap-4 border-b border-cream-300 py-5 md:gap-8 md:py-6"
            >
              <span
                className="font-mono text-[0.7rem] text-orange-600 tabular-nums"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-1 flex-col gap-1 md:flex-row md:items-baseline md:gap-8">
                <h3 className="font-serif text-xl font-bold text-ink-900 md:w-44 md:shrink-0">
                  {pillar.name}
                </h3>
                <p className="leading-relaxed text-ink-600">{pillar.examples}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl border-l-2 border-orange-500 pl-5 font-serif text-heading font-bold text-ink-900 md:mt-10">
            {homework.instruction}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
