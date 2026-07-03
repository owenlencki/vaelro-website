import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import { easeStandard } from "../../lib/animations";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

const offsets = {
  up: { x: 0, y: 30 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

/** Scroll-triggered reveal. Fires once. Falls back to a fade for reduced motion. */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const offset = reducedMotion ? { x: 0, y: 0 } : offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: easeStandard }}
    >
      {children}
    </motion.div>
  );
}
