import { motion } from "framer-motion";
import SplitText from "../../ui/SplitText";
import { session1 } from "../../../data/session1";
import { fadeUp, staggerContainer } from "../../../lib/animations";

export default function Takeaways() {
  const { takeaways } = session1;

  return (
    <section
      id="takeaways"
      className="bg-cream-100 py-12 md:py-20"
      aria-label="Key takeaways"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {takeaways.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={takeaways.heading} />
        </h2>

        <motion.ul
          className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-8"
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {takeaways.items.map((item, i) => (
            <motion.li
              key={item}
              variants={fadeUp}
              className="border-l-2 border-orange-500/60 pl-5"
            >
              <span
                className="font-mono text-[0.65rem] tracking-[0.18em] text-orange-600 tabular-nums"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-serif text-xl leading-snug font-bold text-ink-900">
                {item}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
