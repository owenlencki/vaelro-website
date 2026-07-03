import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import SplitText from "../ui/SplitText";
import MagneticButton from "../ui/MagneticButton";
import { useLenisContext } from "../../hooks/useLenis";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";

// Three.js loads in its own chunk so hero text paints first (LCP)
const ParticleNetwork = lazy(() => import("../3d/ParticleNetwork"));

interface HeroProps {
  /** False while the preloader is covering the page. */
  start: boolean;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768,
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

export default function Hero({ start }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const { scrollTo } = useLenisContext();

  // Hero content parallaxes up and fades as you scroll into the marquee
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: start ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1.0] as const },
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh items-center overflow-hidden bg-ink-900"
      aria-label="Intro"
    >
      {/* Layer 1 — 3D constellation */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <ParticleNetwork isMobile={isMobile} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      {/* Soft vignette so text stays readable over bright clusters */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,13,12,0.55)_100%)]"
        aria-hidden="true"
      />

      {/* Layer 2 — HTML content */}
      <motion.div
        className="container-site relative z-10 pt-24 pb-20 md:pt-28"
        style={reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-6 font-mono text-xs tracking-[0.2em] text-orange-300 uppercase md:text-sm"
          {...fadeUp(0.2)}
        >
          AI-Powered Agency · Waupaca, WI
        </motion.p>

        <h1 className="max-w-4xl font-serif text-display font-bold text-cream-100 [text-shadow:0_2px_24px_rgba(13,13,12,0.5)]">
          <SplitText
            text="We Build the Systems That Run Your Business"
            splitBy="word"
            delay={0.5}
            staggerDelay={0.08}
            start={start}
          />
        </h1>

        <motion.p
          className="mt-6 max-w-xl text-lead text-cream-100/85"
          {...fadeUp(1.1)}
        >
          Custom websites and AI automation for small businesses that want
          more time, more customers, and less chaos.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <motion.div {...fadeUp(1.3)}>
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
              >
                Book a Free Consultation
              </Link>
            </MagneticButton>
          </motion.div>

          <motion.div {...fadeUp(1.4)}>
            <button
              type="button"
              onClick={() => scrollTo("#portfolio", { offset: -88 })}
              className="nav-link inline-flex min-h-12 items-center gap-2 text-base font-semibold text-cream-100/90 hover:text-white"
            >
              See Our Work <span aria-hidden="true">↓</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
