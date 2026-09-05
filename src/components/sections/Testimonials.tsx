import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";
import { fadeUp, staggerContainer } from "../../lib/animations";
import { projects, type WorkCategory } from "../../data/projects";

/**
 * Service line shown on each card, so a visitor sees both halves of what we
 * do represented in the proof. Keyed off the project's own category, so a
 * new testimonial in projects.ts picks up the right tag with no edits here.
 */
const SERVICE_LINE: Record<WorkCategory, string> = {
  Website: "Website",
  "Custom tool": "Automation",
  Platform: "Platform",
};

/** Every project carrying a real client quote, in the work order. */
const quoted = projects.filter((p) => p.testimonial);

export default function Testimonials() {
  if (quoted.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-cream-100 py-12 md:py-24"
      aria-label="Client testimonials"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          In Their Words
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text="What our clients say" />
        </h2>

        <motion.div
          className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {quoted.map((project) => {
            const t = project.testimonial!;
            return (
              <motion.figure
                key={project.slug}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex h-full flex-col rounded-2xl border border-cream-300 bg-cream-50 p-8 shadow-[0_2px_12px_rgba(26,26,26,0.04)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(26,26,26,0.1)] md:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-mono text-[0.65rem] tracking-[0.15em] text-orange-700 uppercase">
                    {SERVICE_LINE[project.category]}
                  </span>
                  <span
                    aria-hidden="true"
                    className="-mt-3 font-serif text-5xl leading-none text-peach-300 select-none"
                  >
                    &ldquo;
                  </span>
                </div>

                <blockquote className="mt-5 grow leading-relaxed text-ink-600">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-7 border-t border-cream-300 pt-5">
                  <span className="block font-serif text-lg font-bold text-ink-900">
                    {t.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {t.role}
                  </span>
                  <Link
                    to={`/work/${project.slug}`}
                    className="nav-link mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    See the project <span aria-hidden="true">→</span>
                  </Link>
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-lead text-ink-600 md:mt-14">
            Same team on both: the site people see and the tool your office
            runs on.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
