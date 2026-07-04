import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";

export default function SocialProof() {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="Client trust">
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-heading font-bold text-ink-900">
              We're just getting started. Ask our clients what it's like to
              work with us.
            </h2>
            <div className="mt-8 flex justify-center">
              <MagneticButton>
                <Link
                  to="/contact"
                  className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
                >
                  Get in touch
                </Link>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
