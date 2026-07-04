import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LenisProvider, useLenisContext } from "./hooks/useLenis";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PageTransition from "./components/layout/PageTransition";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

const NAV_OFFSET = -88;

/** Scrolls to top on route change, or to the anchor when a hash is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useLenisContext();

  useEffect(() => {
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

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
