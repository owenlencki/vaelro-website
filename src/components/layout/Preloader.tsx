import { motion } from "framer-motion";
import logoIcon from "../../assets/logos/logo-icon.png";

const LETTERS = "VAELRO".split("");

/**
 * Set on <html> while the preloader shows. The inline script in index.html
 * sets it before first paint when a first visit lands on Home; HomePage sets
 * it on a first visit that arrives by client-side navigation. index.css shows
 * the overlay and locks scrolling only while it is present.
 */
export const PRELOADER_ATTR = "data-preloader";

/** sessionStorage key. index.html's inline script reads the same key. */
const SEEN_KEY = "vaelro-preloader-shown";

/** First visit this session, with motion allowed. Browser only. */
export function wantsPreloader(): boolean {
  try {
    return (
      !sessionStorage.getItem(SEEN_KEY) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage blocked: the preloader just plays again next visit.
  }
}

/**
 * First-visit intro overlay. Mount/unmount is controlled by HomePage via
 * AnimatePresence; the exit slide-up lives here.
 */
export default function Preloader() {
  return (
    <motion.div
      className="preloader fixed inset-0 z-[70] flex-col items-center justify-center bg-ink-900"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <motion.img
        src={logoIcon}
        alt=""
        width="72"
        height="72"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="mt-6 flex overflow-hidden">
        {LETTERS.map((letter, i) => (
          <motion.span
            key={i}
            className="font-serif text-3xl font-bold tracking-[0.25em] text-cream-100"
            initial={{ y: "120%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.5,
              delay: 0.25 + i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="mt-8 h-[2px] w-40 origin-left bg-orange-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
