import { useLayoutEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader, {
  PRELOADER_ATTR,
  markPreloaderSeen,
  wantsPreloader,
} from "../components/layout/Preloader";
import Hero from "../components/sections/Hero";
import Marquee from "../components/sections/Marquee";
import Services from "../components/sections/Services";
import WorkFan from "../components/sections/WorkFan";
import SocialProof from "../components/sections/SocialProof";
import ConsultationCta from "../components/sections/ConsultationCta";

declare global {
  interface Window {
    /** Failsafe timer set by the inline preloader script in index.html. */
    __vaelroPreloader?: number;
  }
}

export default function HomePage() {
  // The static HTML always carries the preloader. CSS keeps it hidden unless
  // <html data-preloader> is set, which the inline script in index.html does
  // before first paint on a first visit. So the server and hydration renders
  // agree, and this effect only decides what happens next.
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const root = document.documentElement;
    window.clearTimeout(window.__vaelroPreloader);

    if (!root.hasAttribute(PRELOADER_ATTR)) {
      // Already seen this session, reduced motion, or the failsafe fired.
      // Arriving here by client-side navigation on a first visit still gets it.
      if (!wantsPreloader()) {
        setLoading(false);
        return;
      }
      root.setAttribute(PRELOADER_ATTR, "");
    }

    const timer = window.setTimeout(() => {
      markPreloaderSeen();
      setLoading(false);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
      root.removeAttribute(PRELOADER_ATTR);
    };
  }, []);

  return (
    <>
      <AnimatePresence
        onExitComplete={() =>
          document.documentElement.removeAttribute(PRELOADER_ATTR)
        }
      >
        {loading && <Preloader />}
      </AnimatePresence>
      <Hero start={!loading} />
      <Marquee />
      <Services />
      <WorkFan />
      <SocialProof />
      <ConsultationCta />
    </>
  );
}
