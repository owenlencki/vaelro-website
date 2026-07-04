import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import ProjectCard from "../ui/ProjectCard";
import { projects, type ProjectCategory } from "../../data/projects";

const FILTERS: Array<{ label: string; categories: ProjectCategory[] | null }> =
  [
    { label: "All", categories: null },
    { label: "Client Work", categories: ["Client Work"] },
    { label: "Built by Vaelro", categories: ["Built by Vaelro"] },
  ];

export default function Portfolio() {
  const [active, setActive] = useState(0);
  const filter = FILTERS[active];
  const visible = filter.categories
    ? projects.filter((p) => filter.categories!.includes(p.category))
    : projects;

  return (
    <section
      id="portfolio"
      className="scroll-mt-24 bg-peach-50 py-12 md:py-24"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          Our Work
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text="What We've Built" />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-xl text-lead text-ink-600">
            Products, platforms, websites, and AI systems, built and running.
          </p>
        </Reveal>

        {/* Filter tabs */}
        <Reveal delay={0.3}>
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="mt-10 flex flex-wrap gap-1 border-b border-cream-300"
          >
            {FILTERS.map((f, i) => (
              <button
                key={f.label}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`relative min-h-11 px-4 pb-3 text-[0.95rem] font-semibold transition-colors duration-200 ${
                  active === i
                    ? "text-ink-900"
                    : "text-muted hover:text-ink-600"
                }`}
              >
                {f.label}
                {active === i && (
                  <motion.span
                    layoutId="portfolio-tab-underline"
                    className="absolute right-2 -bottom-px left-2 h-[2.5px] bg-orange-500"
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                  />
                )}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Project grid: each featured card spans 2 of 3 columns */}
        <motion.div
          layout
          className="mt-10 grid grid-flow-dense grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
