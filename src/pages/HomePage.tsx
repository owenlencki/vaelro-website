import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../components/layout/Preloader";
import Hero from "../components/sections/Hero";
import Marquee from "../components/sections/Marquee";
import Services from "../components/sections/Services";
import Portfolio from "../components/sections/Portfolio";
import SocialProof from "../components/sections/SocialProof";
import HomeCTA from "../components/sections/HomeCTA";

const PRELOADER_KEY = "vaelro-preloader-shown";

export default function HomePage() {
  // First visit only; skipped entirely for reduced motion
  const [loading, setLoading] = useState(
    () =>
      !sessionStorage.getItem(PRELOADER_KEY) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!loading) return;
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => {
      sessionStorage.setItem(PRELOADER_KEY, "1");
      setLoading(false);
      document.documentElement.style.overflow = "";
    }, 2000);
    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>
      <Hero start={!loading} />
      <Marquee />
      <Services />
      <Portfolio />
      <SocialProof />
      <HomeCTA />
    </>
  );
}
