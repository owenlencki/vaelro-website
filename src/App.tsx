import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LenisProvider, useLenisContext } from "./hooks/useLenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageTransition from "./components/layout/PageTransition";
import HomePage from "./pages/HomePage";
import WebDesignPage from "./pages/WebDesignPage";
import AutomationPage from "./pages/AutomationPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy so Home's bundle doesn't grow with the case-study pages.
const WorkDetailPage = lazy(() => import("./pages/WorkDetailPage"));
// Same reason: /workshop is a standalone landing page for the Chamber series.
const WorkshopPage = lazy(() => import("./pages/WorkshopPage"));
// The Session 1 attendee page, opened from the card on /workshop. Only people
// who were in the room need it, so it stays out of the main bundle.
const Session1Page = lazy(() => import("./pages/Session1Page"));
// The Session 2 attendee page, lazy for the same reason.
const Session2Page = lazy(() => import("./pages/Session2Page"));

const NAV_OFFSET = -88;

/**
 * Deep links into the Session 3 block on /workshop (#session-3, #prompt-1 to
 * #prompt-12). These are the only anchors that get the patient scroll below;
 * every other anchor keeps the plain one in ScrollManager.
 */
function isSession3Anchor(hash: string): boolean {
  return hash === "#session-3" || hash.startsWith("#prompt-");
}

/**
 * /workshop is lazy, so on a cold load the target may not exist at 500ms, and
 * Lenis may still hold the shorter page height it measured first. Keep looking
 * for the target for a few seconds, re-measure before scrolling, then correct
 * once if layout shifted it while the smooth scroll ran. Returns the cleanup.
 */
function scrollToSession3Anchor(
  hash: string,
  scrollTo: ReturnType<typeof useLenisContext>["scrollTo"],
): () => void {
  const id = decodeURIComponent(hash.slice(1));
  const timers: number[] = [];
  let tries = 0;
  const find = () => {
    const el = document.getElementById(id);
    if (el) {
      scrollTo(el, { offset: NAV_OFFSET, resize: true });
      timers.push(
        window.setTimeout(() => {
          // Look it up again: hydrating a lazy page can swap the node.
          const now = document.getElementById(id);
          if (!now) return;
          const drift = now.getBoundingClientRect().top + NAV_OFFSET;
          if (Math.abs(drift) > 4) {
            scrollTo(now, { offset: NAV_OFFSET, immediate: true, resize: true });
          }
        }, 1500),
      );
    } else if (++tries < 30) {
      timers.push(window.setTimeout(find, 100));
    }
  };
  timers.push(window.setTimeout(find, 500));
  return () => timers.forEach((t) => clearTimeout(t));
}

/** Scrolls to top on route change, or to the anchor when a hash is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useLenisContext();

  useEffect(() => {
    if (hash && isSession3Anchor(hash)) {
      return scrollToSession3Anchor(hash, scrollTo);
    }
    if (hash) {
      // Wait for the page transition so the target exists and has settled
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) scrollTo(el, { offset: NAV_OFFSET });
      }, 500);
      return () => clearTimeout(timer);
    }
    scrollTo(0, { immediate: true });
  }, [pathname, hash, scrollTo]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/web-design"
          element={
            <PageTransition>
              <WebDesignPage />
            </PageTransition>
          }
        />
        <Route
          path="/automation"
          element={
            <PageTransition>
              <AutomationPage />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="/work/:slug"
          element={
            <PageTransition>
              <Suspense fallback={null}>
                <WorkDetailPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/workshop"
          element={
            <PageTransition>
              {/* Full-viewport hold in the page background, no spinner */}
              <Suspense fallback={<div className="min-h-svh bg-cream-100" />}>
                <WorkshopPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/workshop/session-1"
          element={
            <PageTransition>
              <Suspense fallback={<div className="min-h-svh bg-cream-100" />}>
                <Session1Page />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/workshop/session-2"
          element={
            <PageTransition>
              <Suspense fallback={<div className="min-h-svh bg-cream-100" />}>
                <Session2Page />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <PrivacyPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * The whole site. The router comes from the entry point: BrowserRouter in the
 * browser (src/main.tsx), StaticRouter when prerendering (src/entry-server.tsx).
 */
export default function App() {
  return (
    <LenisProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <AnimatedRoutes />
      </main>
      <Footer />
    </LenisProvider>
  );
}
