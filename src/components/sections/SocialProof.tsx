import { motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import AnimatedCounter from "../ui/AnimatedCounter";
import {
  testimonials,
  testimonialsArePlaceholders,
} from "../../data/testimonials";
import { scaleIn, staggerContainer } from "../../lib/animations";

const CLIENTS = [
  "Waypoint Financial Solutions",
  "Indian Crossing Casino",
  "715 Harvest Fest",
  "United Country Real Estate",
  "CK Aviation",
  "Huck & Finn",
];

const STATS = [
  { target: 6, suffix: "+", label: "Local Businesses Served" },
  { target: 5, suffix: "", label: "AI Systems in Production" },
  { target: 2, suffix: "", label: "Software Products Built" },
];

export default function SocialProof() {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="Client trust">
      <div className="container-site">
        {/* Client bar */}
        <Reveal>
          <p className="text-center font-mono text-xs tracking-[0.2em] text-muted uppercase">
            Trusted by local businesses
          </p>
          <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {CLIENTS.map((client, i) => (
              <li key={client} className="flex items-center gap-3">
                <span className="font-serif text-base text-ink-600 italic md:text-lg">
                  {client}
                </span>
                {i < CLIENTS.length - 1 && (
                  <span className="text-orange-400" aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-10 text-center sm:grid-cols-3 md:mt-20">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  className="font-serif text-5xl font-bold text-orange-500 md:text-6xl"
                />
                <p className="mt-3 font-semibold text-ink-600">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16 md:mt-24">
          <h2 className="text-center font-serif text-heading font-bold text-ink-900">
            What working with us is like
          </h2>

          <motion.div
            className="mt-10 grid gap-6 md:grid-cols-3"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((t, i) => (
              <motion.figure
                key={i}
                variants={scaleIn}
                className="flex flex-col rounded-2xl border border-cream-300 bg-peach-50 p-7"
              >
                {t.rating && (
                  <div
                    className="text-orange-500"
                    role="img"
                    aria-label={`${t.rating} out of 5 stars`}
                  >
                    {"★".repeat(t.rating)}
                    <span className="text-cream-300">
                      {"★".repeat(5 - t.rating)}
                    </span>
                  </div>
                )}
                <blockquote className="mt-4 grow font-serif text-[1.05rem] leading-relaxed text-ink-900 italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-cream-300 pt-4">
                  <span className="block font-bold text-ink-900">{t.name}</span>
                  <span className="text-sm text-muted">{t.business}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

          {testimonialsArePlaceholders && (
            <Reveal delay={0.2}>
              <p className="mt-8 text-center font-mono text-xs text-muted">
                Placeholder reviews shown — real client reviews coming soon.
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
