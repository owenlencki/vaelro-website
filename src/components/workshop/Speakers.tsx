import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Portrait from "./Portrait";
import { workshop } from "../../data/workshop";
import { fadeUp, staggerContainer } from "../../lib/animations";

export default function Speakers() {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="Who is leading it">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {workshop.speakersSection.eyebrow}
        </p>
        <h2 className="max-w-3xl font-serif text-title font-bold text-ink-900">
          <SplitText text={workshop.speakersSection.heading} />
        </h2>

        <motion.ul
          className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {workshop.speakers.map((speaker) => (
            <motion.li key={speaker.id} variants={fadeUp}>
              <div className="overflow-hidden rounded-2xl">
                <Portrait
                  speaker={speaker}
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
              </div>
              <h3 className="mt-5 font-serif text-heading font-bold text-ink-900">
                {speaker.name}
              </h3>
              <p className="mt-1 font-mono text-xs tracking-[0.18em] text-orange-600 uppercase">
                {speaker.role}
              </p>
              <p className="mt-4 leading-relaxed text-ink-600">{speaker.bio}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
