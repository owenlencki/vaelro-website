import { Link } from "react-router-dom";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";

export default function HomeCTA() {
  return (
    <section
      className="relative overflow-hidden bg-ink-900 bg-noise py-20 md:py-32"
      aria-label="Book a consultation"
    >
      {/* Warm glow behind the headline */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-title font-bold text-cream-100">
          <SplitText text="Ready to stop doing everything manually?" />
        </h2>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-xl text-lead text-cream-100/80">
            Book a free 30-minute consultation. We'll map out exactly where
            your business can save time and get more customers.
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <div className="mt-10 flex justify-center">
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex min-h-14 items-center rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(212,116,59,0.4)] transition-colors duration-200 hover:bg-orange-600"
              >
                Book Your Free Consultation
              </Link>
            </MagneticButton>
          </div>
          <p className="mt-8 font-mono text-sm text-cream-100/60">
            hello@vaelro.co · Waupaca, WI
          </p>
        </Reveal>
      </div>
    </section>
  );
}
