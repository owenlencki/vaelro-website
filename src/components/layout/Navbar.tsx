import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useLenisContext } from "../../hooks/useLenis";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import { useNow } from "../../hooks/useNow";
import { BOOKING_URL } from "../../lib/booking";
import { trackEvent } from "../../lib/analytics";
import { workshop } from "../../data/workshop";
import { getSeriesClock, getSeriesPhase } from "../../lib/workshop";
import logoCream from "../../assets/logos/logo-horizontal-cream.png";
import logoDark from "../../assets/logos/logo-horizontal-dark.png";

/**
 * Pages with no "Book a Call" button. The Chamber workshop is education only,
 * and the NFC tags on the tables open these two pages, so they carry no sales
 * button. Every other page keeps it.
 */
const NO_BOOKING_BUTTON = new Set(["/workshop", "/workshop/session-1"]);

/** Decorative marker on the Workshop item while the series is running. */
function LiveDot() {
  return (
    <span
      aria-hidden="true"
      className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange-500 align-middle"
    />
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { stop, start } = useLenisContext();
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;
  const hideBooking = NO_BOOKING_BUTTON.has(pathname);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));

  // Close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      start();
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, stop, start]);

  const linkColor = transparent
    ? "text-cream-100 hover:text-white"
    : "text-ink-900 hover:text-orange-600";

  // The dot marks the series as live. It disappears on its own once Session 3
  // is done; dropping it early is deleting the `dot` line below.
  const now = getSeriesClock(
    workshop.sessions,
    useNow(),
    workshop.forcedNextSession,
  );
  const seriesRunning = useMemo(
    () =>
      getSeriesPhase(workshop.sessions, now, workshop.stageOverride) !==
      "complete",
    [now],
  );
  // Real pages only, so every item is a crawlable link to its own URL.
  const links: Array<{ label: string; to: string; dot?: boolean }> = [
    { label: "Home", to: "/" },
    { label: "Web Design", to: "/web-design" },
    { label: "Automation", to: "/automation" },
    { label: "Workshop", to: "/workshop", dot: seriesRunning },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[55] h-[3px] origin-left bg-orange-500"
        style={{ scaleX: scrollYProgress }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          transparent
            ? "bg-transparent border-b border-transparent"
            : "bg-cream-100/85 backdrop-blur-md border-b border-cream-300/70"
        }`}
      >
        <nav
          aria-label="Main"
          className="container-site flex h-16 items-center justify-between gap-4 md:h-20"
        >
          {/* Logo lockup. Both variants render so the scroll transition
              swaps instantly with no refetch. */}
          <Link
            to="/"
            className="flex min-h-11 items-center"
            aria-label="Vaelro home"
          >
            <img
              src={logoCream}
              alt="Vaelro"
              width="791"
              height="200"
              className={`h-9 w-auto ${transparent ? "" : "hidden"}`}
            />
            <img
              src={logoDark}
              alt="Vaelro"
              width="791"
              height="200"
              className={`h-9 w-auto ${transparent ? "hidden" : ""}`}
            />
          </Link>

          {/* Desktop links. Six items need the room, so tablets get the
              menu button instead. */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`nav-link text-[0.95rem] font-semibold whitespace-nowrap ${linkColor}`}
              >
                {l.label}
                {l.dot && <LiveDot />}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* CTA: visible on every page but the workshop ones, including on
                mobile outside the menu. There, a phone drops it from the bar;
                from lg up it stays as an invisible placeholder (no focus, not
                read out), so the links sit exactly where they do elsewhere
                instead of jumping when you move between pages. */}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("booking_click", { location: "navbar" })}
              className={`inline-flex min-h-11 items-center rounded-full bg-orange-500 px-5 text-[0.95rem] font-bold whitespace-nowrap text-white transition-colors duration-200 hover:bg-orange-600 ${
                hideBooking ? "max-lg:hidden lg:invisible" : ""
              }`}
            >
              Book a Call
            </a>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden ${
                transparent ? "text-cream-100" : "text-ink-900"
              }`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={`h-[2px] w-6 bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[4.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-6 bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[4.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col justify-center bg-ink-900 px-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
          >
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={
                    reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    to={l.to}
                    aria-current={pathname === l.to ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2.5 font-serif text-4xl font-bold text-cream-100"
                  >
                    {l.label}
                    {l.dot && <LiveDot />}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="mt-10 font-mono text-sm text-cream-100/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              hello@vaelro.co · Waupaca, WI
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
