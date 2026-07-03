import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useLenisContext } from "../../hooks/useLenis";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import logoIcon from "../../assets/logos/logo-icon.png";
import type { MouseEvent } from "react";

const NAV_OFFSET = -88;

export default function Navbar() {
  const { pathname } = useLocation();
  const { scrollTo, stop, start } = useLenisContext();
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !menuOpen;

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

  function handleAnchor(e: MouseEvent, id: string) {
    if (isHome) {
      e.preventDefault();
      setMenuOpen(false);
      scrollTo(`#${id}`, { offset: NAV_OFFSET });
    }
  }

  const linkColor = transparent
    ? "text-cream-100 hover:text-white"
    : "text-ink-900 hover:text-orange-600";

  const anchorLinks = [
    { label: "Services", id: "services" },
    { label: "Work", id: "portfolio" },
  ];
  const pageLinks = [
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
          {/* Wordmark */}
          <Link
            to="/"
            className="flex min-h-11 items-center gap-2.5"
            aria-label="Vaelro — home"
          >
            <img src={logoIcon} alt="" width="34" height="34" />
            <span
              className={`font-serif text-lg font-bold tracking-[0.12em] ${
                transparent ? "text-cream-100" : "text-ink-900"
              }`}
            >
              VAELRO
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {anchorLinks.map((l) => (
              <Link
                key={l.id}
                to={`/#${l.id}`}
                onClick={(e) => handleAnchor(e, l.id)}
                className={`nav-link text-[0.95rem] font-semibold ${linkColor}`}
              >
                {l.label}
              </Link>
            ))}
            {pageLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`nav-link text-[0.95rem] font-semibold ${linkColor}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* CTA — always visible, including on mobile outside the menu */}
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center rounded-full bg-orange-500 px-5 text-[0.95rem] font-bold text-white transition-colors duration-200 hover:bg-orange-600"
            >
              Book a Call
            </Link>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className={`flex h-11 w-11 flex-col items-center justify-center gap-[7px] md:hidden ${
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
            className="fixed inset-0 z-30 flex flex-col justify-center bg-ink-900 px-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
          >
            <ul className="flex flex-col gap-2">
              {[
                ...anchorLinks.map((l) => ({
                  label: l.label,
                  to: `/#${l.id}`,
                  id: l.id,
                })),
                ...pageLinks.map((l) => ({ ...l, id: undefined })),
              ].map((l, i) => (
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
                    onClick={(e) => {
                      if (l.id) handleAnchor(e, l.id);
                      else setMenuOpen(false);
                    }}
                    className="block py-3 font-serif text-4xl font-bold text-cream-100"
                  >
                    {l.label}
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
