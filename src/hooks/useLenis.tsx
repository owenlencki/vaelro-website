import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./useReducedMotion";

interface LenisContextValue {
  /** Smooth-scroll to a target (element, selector, or pixel offset). */
  scrollTo: (
    target: HTMLElement | string | number,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function useLenisContext() {
  return useContext(LenisContext);
}

/**
 * Initializes Lenis smooth scroll for the whole app. Disabled entirely when
 * the user prefers reduced motion — native scrolling takes over.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    if (import.meta.env.DEV) {
      // Handy for debugging scroll behavior from the console
      (window as unknown as Record<string, unknown>).__lenis = lenis;
    }

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const value: LenisContextValue = useMemo(() => ({
    scrollTo: (target, options) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset: options?.offset ?? 0,
          immediate: options?.immediate ?? false,
        });
        return;
      }
      // Native fallback (reduced motion)
      let top = 0;
      if (typeof target === "number") {
        top = target;
      } else {
        const el =
          typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
        if (!el) return;
        top = el.getBoundingClientRect().top + window.scrollY;
      }
      window.scrollTo({ top: top + (options?.offset ?? 0), behavior: "auto" });
    },
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }), []);

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  );
}
