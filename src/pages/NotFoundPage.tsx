import { Link } from "react-router-dom";
import MagneticButton from "../components/ui/MagneticButton";
import logoDark from "../assets/logos/logo-horizontal-dark.png";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-svh items-center bg-cream-100 pt-24 pb-16">
      <div className="container-site text-center">
        <img
          src={logoDark}
          alt="Vaelro"
          width="791"
          height="200"
          className="mx-auto h-10 w-auto"
        />
        <p className="mt-10 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          404
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl font-serif text-display font-bold text-ink-900">
          Page not found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lead text-ink-600">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-10 flex justify-center">
          <MagneticButton>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
            >
              Back to home
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
