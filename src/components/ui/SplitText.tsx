import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface SplitTextProps {
  text: string;
  splitBy?: "word" | "char";
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  /** Gate the animation on external state (e.g. wait for the preloader). */
  start?: boolean;
}

/**
 * Splits text by word or character and reveals each unit from below its
 * overflow-hidden mask. Fires once when it enters the viewport.
 */
export default function SplitText({
  text,
  splitBy = "word",
  delay = 0,
  staggerDelay = 0.08,
  duration = 0.55,
  className,
  start = true,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reducedMotion = usePrefersReducedMotion();
  const active = inView && start;

  const units =
    splitBy === "word" ? text.split(" ") : Array.from(text.replace(/ /g, " "));

  if (reducedMotion) {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {units.map((unit, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.13em] -mb-[0.13em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            animate={active ? { y: "0%" } : {}}
            transition={{
              duration,
              delay: delay + i * staggerDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {unit}
          </motion.span>
          {splitBy === "word" && i < units.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
