import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RegisterCta from "./RegisterCta";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

interface StickyCtaProps {
  /** The hero's button. The bar shows only once this has scrolled away. */
  watch: RefObject<HTMLDivElement | null>;
}

/**
 * Phone-only bottom bar. It sits under the mobile menu overlay (z-30) so
 * opening the menu covers it, and the page carries matching bottom padding so
 * the closing section is never hidden behind it.
 */
export default function StickyCta({ watch }: StickyCtaProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = watch.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed right-0 bottom-0 left-0 z-20 border-t border-cream-300 bg-cream-100 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-6px_24px_rgba(26,26,26,0.10)] md:hidden"
          initial={reducedMotion ? { opacity: 0 } : { y: "100%" }}
          animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <RegisterCta location="sticky" className="w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
