import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

const STEPS = [
  {
    number: "1",
    title: "Discovery",
    tagline: "You talk. We listen.",
    body: "A 30-minute conversation about your business, pain points, and what's costing you time. No pitch — just questions.",
  },
  {
    number: "2",
    title: "Build",
    tagline: "We design and build.",
    body: "Custom website, automation system, or both. You see progress, give feedback, and approve before anything goes live.",
  },
  {
    number: "3",
    title: "Launch & Support",
    tagline: "We deploy and stay.",
    body: "We launch, train your team, and stay on as your tech partner. Monthly support keeps everything running and improving.",
  },
];

export default function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // The connecting line draws as the steps scroll through the viewport
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.7", "end 0.55"],
  });
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  return (
    <section className="bg-peach-50 py-12 md:py-24" aria-label="How it works">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          How It Works
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text="Three steps. No mystery." />
        </h2>

        <div ref={trackRef} className="relative mt-16 md:mt-20">
          {/* Connecting line — draws on scroll (left rail on mobile, center on md+) */}
          <svg
            className="absolute top-0 left-[27px] h-full w-[3px] md:left-1/2 md:-translate-x-1/2"
            viewBox="0 0 3 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="1.5"
              y1="0"
              x2="1.5"
              y2="100"
              stroke="var(--color-cream-300)"
              strokeWidth="3"
            />
            <motion.line
              x1="1.5"
              y1="0"
              x2="1.5"
              y2="100"
              stroke="var(--color-orange-500)"
              strokeWidth="3"
              style={{ pathLength: reducedMotion ? 1 : pathLength }}
            />
          </svg>

          <ol className="relative flex flex-col gap-14 md:gap-24">
            {STEPS.map((step, i) => {
              const alignRight = i % 2 === 1;
              return (
                <li key={step.number} className="md:grid md:grid-cols-2">
                  <Reveal
                    delay={0.1}
                    direction={
                      reducedMotion ? "up" : alignRight ? "right" : "left"
                    }
                    className={
                      alignRight ? "md:col-start-2 md:pl-16" : "md:pr-16"
                    }
                  >
                    <div
                      className={`relative flex gap-6 pl-16 md:pl-0 ${
                        alignRight
                          ? ""
                          : "md:flex-row-reverse md:text-right"
                      }`}
                    >
                      {/* Number chip sits on the line */}
                      <motion.span
                        className="absolute top-0 left-0 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-cream-50 font-serif text-xl font-bold md:static md:h-16 md:w-16 md:shrink-0 md:text-2xl"
                        initial={{
                          scale: reducedMotion ? 1 : 0.6,
                          borderColor: "var(--color-cream-300)",
                          color: "var(--color-muted)",
                        }}
                        whileInView={{
                          scale: 1,
                          borderColor: "var(--color-orange-500)",
                          color: "var(--color-orange-600)",
                        }}
                        viewport={{ once: true, amount: 1 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        aria-hidden="true"
                      >
                        {step.number}
                      </motion.span>

                      <div>
                        <h3 className="font-serif text-heading font-bold text-ink-900">
                          {step.title}
                        </h3>
                        <p className="mt-1 font-semibold text-orange-600">
                          {step.tagline}
                        </p>
                        <p className="mt-3 max-w-md leading-relaxed text-ink-600">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
