import type { Transition, Variants } from "framer-motion";

export const easeStandard: [number, number, number, number] = [
  0.25, 0.1, 0.25, 1.0,
];

export const transitionStandard: Transition = {
  duration: 0.6,
  ease: easeStandard,
};

export const fadeUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: transitionStandard },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionStandard },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: transitionStandard },
};

export const slideFromLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: transitionStandard },
};

export const slideFromRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: transitionStandard },
};

/** Container that staggers its children's `hidden` → `visible` variants. */
export const staggerContainer = (
  stagger = 0.15,
  delayChildren = 0,
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
