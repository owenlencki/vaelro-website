import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";
import { fadeUp, staggerContainer } from "../../lib/animations";

/** Stepped three-across on desktop so it does not read as three equal cards. */
const STEP = ["md:mt-0", "md:mt-12", "md:mt-24"];

/**
 * What the room told us, in general terms. The three problems are plain text
 * from the data file; no business or person is named anywhere in this section.
 */
export default function WhatWeHeard() {
  const { whatWeHeard } = workshop;

  return (
    <section
      className="bg-cream-100 pb-12 md:pb-24"
      aria-label="What we heard from local businesses"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {whatWeHeard.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={whatWeHeard.heading} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lead text-ink-600">
            {whatWeHeard.body}
          </p>
        </Reveal>

        <motion.ul
          className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {whatWeHeard.items.map((item, i) => (
            <motion.li
              key={item.tag}
              variants={fadeUp}
              className={`border-l-2 border-orange-500/60 pl-5 ${STEP[i]}`}
            >
              <p className="font-mono text-[0.65rem] tracking-[0.18em] text-orange-600 uppercase">
                {item.tag}
              </p>
              <p className="mt-3 font-serif text-xl leading-snug font-bold text-ink-900">
                {item.text}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <Reveal delay={0.15}>
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted md:mt-20">
            {whatWeHeard.footer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
