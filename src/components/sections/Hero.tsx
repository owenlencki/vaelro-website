import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import SplitText from "../ui/SplitText";
import MagneticButton from "../ui/MagneticButton";
import { BOOKING_URL } from "../../lib/booking";
import { trackEvent } from "../../lib/analytics";
import { useLenisContext } from "../../hooks/useLenis";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import {
  ORB_COUNT,
  SERVICES,
  type OverlayNodes,
} from "../3d/services";

// Three.js loads in its own chunk so hero text paints first (LCP)
const OrbCarousel = lazy(() => import("../3d/OrbCarousel"));

const CYCLE_MS = 5000;
const RESUME_MS = 8000;

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

  // ---- Orb carousel state ------------------------------------------------
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseTimer = useRef<number | undefined>(undefined);
  const touchX = useRef<number | null>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const overlayNodes = useRef<OverlayNodes>({
    labels: new Array(ORB_COUNT).fill(null),
    ring: null,
    desc: null,
    dots: null,
  });

  const cycling = start && inView && !paused;

  // ---- Orb transition sequencer -------------------------------------
  // Moving between orbs closes the current one with its own reveal
  // mechanic first, re-slots the orbs, then opens the next one.
  const seqTimers = useRef<number[]>([]);
  const clearSeq = () => {
    seqTimers.current.forEach((t) => window.clearTimeout(t));
    seqTimers.current = [];
  };
  const later = (fn: () => void, ms: number) =>
    seqTimers.current.push(window.setTimeout(fn, ms));

  // Close: text fades (200ms) while halves rejoin (~450ms); the crack seals
  // during the drift. Move: the orbit spring (t100/f16) settles in ~600ms.
  const CLOSE_MS = reducedMotion ? 50 : 500;
  const MOVE_MS = reducedMotion ? 50 : 600;

  function goTo(next: number, openAfter: boolean) {
    clearSeq();
    const move = () => {
      setActive(next);
      if (openAfter) later(() => setOpen(true), MOVE_MS);
    };
    if (open) {
      setOpen(false);
      later(move, CLOSE_MS);
    } else {
      move();
    }
  }

  // Auto-cycle: close the current orb, advance, open the next. The timer
  // restarts on any state change, so it waits for the full open state.
  useEffect(() => {
    if (!cycling) return;
    const timer = window.setTimeout(() => {
      goTo((active + 1) % ORB_COUNT, true);
    }, CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [cycling, active, open]);

  useEffect(
    () => () => {
      window.clearTimeout(pauseTimer.current);
      clearSeq();
    },
    [],
  );

  /** Wrap user interactions: pause the auto-cycle, resume after 8s idle. */
  function interact(action: () => void) {
    setPaused(true);
    window.clearTimeout(pauseTimer.current);
    pauseTimer.current = window.setTimeout(
      () => setPaused(false),
      RESUME_MS,
    );
    action();
  }

  const selectOrb = (i: number) =>
    interact(() => {
      if (i === active) {
        clearSeq();
        setOpen((o) => !o);
      } else {
        goTo(i, false);
      }
    });

  const step = (dir: 1 | -1) =>
    interact(() => goTo((active + dir + ORB_COUNT) % ORB_COUNT, false));

  function onTouchStart(e: TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
  }

  // Arrow keys cycle the carousel while the hero is in view
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    if (!inView) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        typeof target.closest === "function" &&
        target.closest("input, textarea, select")
      ) {
        return;
      }
      stepRef.current(e.key === "ArrowLeft" ? -1 : 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [inView]);

  // ---- Hero content scroll parallax (unchanged) ---------------------------
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
      className="group relative flex min-h-svh items-center overflow-hidden bg-ink-900 max-md:min-h-[calc(100svh+160px)] max-md:items-start"
      aria-label="Intro"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Layer 1: interactive orb carousel in a particle field */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <OrbCarousel
            active={active}
            open={open}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            onOrbClick={selectOrb}
            overlay={overlayNodes}
          />
        </Suspense>
      </div>
      {/* Soft vignette so text stays readable over bright clusters */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,13,12,0.55)_100%)]"
        aria-hidden="true"
      />

      {/* Orb overlay: labels, description, progress ring, dots, arrows.
          Positions of labels/ring/desc are written imperatively by the 3D
          scene's projector, so they track the orbs at 60fps. */}
      <div className="pointer-events-none absolute inset-0 z-[5]">
        {/* Orb labels. On mobile only the active orb's label shows,
            below the single centered orb. */}
        {SERVICES.map((service, i) => (
          <button
            key={service.id}
            ref={(el) => {
              overlayNodes.current.labels[i] = el;
            }}
            type="button"
            onClick={() => selectOrb(i)}
            className={`invisible absolute top-0 left-0 min-h-9 px-3 font-mono tracking-[0.18em] uppercase transition-[color,opacity] duration-300 pointer-events-auto ${
              i === active ? "" : "max-md:hidden"
            } ${
              i === active
                ? "text-xs text-cream-100"
                : "text-[0.65rem] text-cream-100/45 hover:text-cream-100/80"
            } ${
              // The description title replaces the active label while open
              i === active && open ? "!pointer-events-none opacity-0" : ""
            }`}
          >
            {service.name}
          </button>
        ))}

        {/* Cycle progress ring around the active orb */}
        <div
          ref={(el) => {
            overlayNodes.current.ring = el;
          }}
          className="invisible absolute top-0 left-0"
          aria-hidden="true"
        >
          {cycling && !reducedMotion && (
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 100 100"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                stroke="rgba(245,240,232,0.1)"
                strokeWidth="1.5"
              />
              <motion.circle
                key={`${active}-${open}`}
                cx="50"
                cy="50"
                r="48"
                pathLength="1"
                stroke="rgba(212,116,59,0.75)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1"
                initial={{ strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
              />
            </svg>
          )}
        </div>

        {/* Description: hidden inside the planet, revealed by the crack.
            The projector centers it on the active orb (desktop, in the gap
            between the split halves) or places it below the orb (mobile).
            Fade-in waits for the 300ms crack phase so text appears as the
            halves part; it fades out before they rejoin. */}
        <div
          ref={(el) => {
            overlayNodes.current.desc = el;
          }}
          className="invisible absolute top-0 left-0 w-[min(260px,84vw)] text-center"
        >
          {/* Always mounted to avoid AnimatePresence exit coordination,
              which wedges under rapid cycle interruptions. */}
          <motion.div
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              y: reducedMotion ? 0 : open ? 0 : 10,
            }}
            transition={{
              duration: reducedMotion ? 0.15 : open ? 0.3 : 0.2,
              delay: open && !reducedMotion ? 0.35 : 0,
              ease: "easeOut",
            }}
            className="[text-shadow:0_1px_14px_rgba(13,13,12,0.9)]"
          >
            <motion.div
              key={active}
              initial={reducedMotion ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
            >
              <h3 className="font-serif text-[15px] font-bold text-white">
                {SERVICES[active].title}
              </h3>
              <p className="mx-auto mt-1 max-w-[240px] text-[11px] leading-relaxed text-white/55">
                {SERVICES[active].desc}
              </p>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  trackEvent("orb_learn_more", {
                    service: SERVICES[active].name,
                  });
                  scrollTo("#services", { offset: -88 });
                }}
                className={`mt-1.5 inline-flex min-h-8 items-center font-mono text-[9px] tracking-[0.15em] text-orange-400 uppercase transition-colors duration-200 hover:text-orange-300 ${
                  open ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                Learn more ↓
              </button>
            </motion.div>
          </motion.div>

          {/* Mobile dots: part of the below-orb stack */}
          <div className="pointer-events-auto mt-1 flex items-center justify-center md:hidden">
            {SERVICES.map((service, i) => (
              <button
                key={service.id}
                type="button"
                aria-label={`Show ${service.name}`}
                aria-current={i === active}
                onClick={() => selectOrb(i)}
                className="flex h-9 w-7 items-center justify-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-5 bg-orange-500"
                      : "w-2 bg-cream-100/30 hover:bg-cream-100/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Nav dots, below the orb arrangement (desktop; the mobile dots
            live in the description stack) */}
        <div
          ref={(el) => {
            overlayNodes.current.dots = el;
          }}
          className="invisible absolute top-0 left-0 flex items-center justify-center pointer-events-auto max-md:hidden"
        >
          {SERVICES.map((service, i) => (
            <button
              key={service.id}
              type="button"
              aria-label={`Show ${service.name}`}
              aria-current={i === active}
              onClick={() => selectOrb(i)}
              className="flex h-10 w-7 items-center justify-center"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-5 bg-orange-500"
                    : "w-2 bg-cream-100/30 hover:bg-cream-100/60"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Arrows on the sides of the orb area (desktop, subtle) */}
        <button
          type="button"
          aria-label="Previous service"
          onClick={() => step(-1)}
          className="pointer-events-auto absolute top-1/2 left-[53%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-100/15 text-cream-100/60 opacity-0 transition-[opacity,color,border-color] duration-300 group-hover:opacity-100 hover:border-cream-100/40 hover:text-white focus-visible:opacity-100 md:flex"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          aria-label="Next service"
          onClick={() => step(1)}
          className="pointer-events-auto absolute top-1/2 right-[2%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream-100/15 text-cream-100/60 opacity-0 transition-[opacity,color,border-color] duration-300 group-hover:opacity-100 hover:border-cream-100/40 hover:text-white focus-visible:opacity-100 md:flex"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Layer 2: HTML content. pointer-events-none lets clicks reach the
          orbs; the CTA row re-enables them for its buttons. */}
      <motion.div
        className="container-site pointer-events-none relative z-10 pt-24 pb-20 md:pt-28"
        style={
          reducedMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
      >
        <motion.p
          className="mb-6 font-mono text-xs tracking-[0.2em] text-orange-300 uppercase md:text-sm"
          {...fadeUp(0.2)}
        >
          Web & Automation Agency · Waupaca, WI
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

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-6">
          <motion.div {...fadeUp(1.3)}>
            <MagneticButton>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("booking_click", { location: "hero" })}
                className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
              >
                Book a Free Consultation
              </a>
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
