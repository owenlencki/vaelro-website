import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface ParallaxProps {
  children: ReactNode;
  /** Offset multiplier — higher = more movement. */
  speed?: number;
  className?: string;
}

/** Offsets children on the Y axis as they move through the viewport. */
export default function Parallax({
  children,
  speed = 0.3,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed * 120, speed * -120],
  );

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={reducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
