import { motion } from "framer-motion";
import logoIcon from "../../assets/logos/logo-icon.png";

const LETTERS = "VAELRO".split("");

/**
 * First-visit intro overlay. Mount/unmount is controlled by HomePage via
 * AnimatePresence + sessionStorage; the exit slide-up lives here.
 */
export default function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-900"
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
