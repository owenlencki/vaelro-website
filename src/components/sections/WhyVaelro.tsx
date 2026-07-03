import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

/** Key phrase with an orange underline that draws on as it enters the viewport. */
function Highlight({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.span
      className="text-cream-50"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-orange-500), var(--color-orange-500))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 94%",
      }}
      initial={{ backgroundSize: reducedMotion ? "100% 0.14em" : "0% 0.14em" }}
      whileInView={{ backgroundSize: "100% 0.14em" }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      {children}
    </motion.span>
  );
}

const BLOCKS: Array<{
  number: string;
  heading: ReactNode;
  body: ReactNode;
}> = [
  {
    number: "01",
    heading: (
      <>
        You <Highlight>own everything</Highlight>.
      </>
    ),
    body: "Your domain, your code, your hosting, your data. No lock-in. No hostage games. Ever.",
  },
  {
    number: "02",
    heading: <>Built to last.</>,
    body: (
      <>
        Our sites load in <Highlight>under 2 seconds</Highlight>, cost dollars
        per month to host, and don't need constant security patches. No
        WordPress. No Wix.
      </>
    ),
  },
  {
    number: "03",
    heading: (
      <>
        We're <Highlight>10 minutes away</Highlight>.
      </>
    ),
    body: "When something breaks before a big event, you call us directly. Not a ticket queue. Not a chatbot. Us.",
  },
  {
    number: "04",
    heading: (
      <>
        We <Highlight>don't disappear</Highlight>.
      </>
    ),
    body: "Monthly support that keeps your systems running and improving. We're your tech team, not a one-and-done vendor.",
  },
];

export default function WhyVaelro() {
  return (
    <section
      className="relative bg-ink-900 bg-noise py-12 md:py-24"
      aria-label="Why Vaelro"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          Why Vaelro
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-cream-100">
          <SplitText text="What makes us different" />
        </h2>

        <div className="mt-14 flex flex-col md:mt-20">
          {BLOCKS.map((block, i) => (
            <Reveal key={block.number} delay={i * 0.08}>
              <div className="grid gap-4 border-t border-cream-100/10 py-10 md:grid-cols-[80px_1fr_1.2fr] md:gap-10 md:py-14">
                <span
                  className="font-serif text-xl font-bold text-orange-400/70"
                  aria-hidden="true"
                >
                  {block.number}
                </span>
                <h3 className="font-serif text-heading font-bold text-cream-100">
                  {block.heading}
                </h3>
                <p className="max-w-xl text-lead text-cream-100/75">
                  {block.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
