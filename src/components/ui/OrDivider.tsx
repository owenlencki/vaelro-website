import { motion, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

/** Matches the --ease-out-expo token in index.css. */
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface OrDividerProps {
  className?: string;
}

/**
 * "or" rule between two alternative actions. The lines draw outward from the
 * badge the first time it scrolls into view. Falls back to a fade for reduced motion.
 */
export default function OrDivider({ className = "" }: OrDividerProps) {
  const reducedMotion = usePrefersReducedMotion();

  const line: Variants = {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: reducedMotion ? 0.4 : 1.1,
        delay: reducedMotion ? 0 : 0.15,
        ease: easeOutExpo,
      },
    },
  };

  const badge: Variants = {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reducedMotion ? 0.4 : 0.6, ease: easeOutExpo },
    },
  };

  return (
    <motion.div
      className={`flex items-center gap-4 md:gap-6 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.span
        aria-hidden="true"
        variants={line}
        className="h-px flex-1 origin-right bg-gradient-to-l from-cream-400 to-transparent"
      />
      <motion.span
        variants={badge}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-peach-50 font-serif text-lg leading-none font-medium text-orange-700"
      >
        or
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={line}
        className="h-px flex-1 origin-left bg-gradient-to-r from-cream-400 to-transparent"
      />
    </motion.div>
  );
}
