import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import logoIcon from "../../assets/logos/logo-icon.png";

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 bg-noise text-cream-100">
      <div className="container-site py-14 md:py-16">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <Link
              to="/"
              className="flex min-h-11 items-center gap-3"
              aria-label="Vaelro — home"
            >
              <img src={logoIcon} alt="" width="40" height="40" loading="lazy" />
              <span className="font-serif text-xl font-bold tracking-[0.12em]">
                VAELRO
              </span>
            </Link>

            <div className="flex flex-col gap-3 text-[0.95rem] sm:flex-row sm:items-center sm:gap-8">
              <span className="text-cream-100/70">Waupaca, WI</span>
              <a
                href="mailto:hello@vaelro.co"
                className="nav-link inline-flex min-h-11 items-center font-semibold text-cream-100 hover:text-orange-300"
              >
                hello@vaelro.co
              </a>
              <a
                href="https://www.instagram.com/vaelro.co"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link inline-flex min-h-11 items-center font-semibold text-cream-100 hover:text-orange-300"
              >
                @vaelro.co
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-cream-100/10 pt-6 text-sm text-cream-100/50">
            © 2026 Vaelro LLC
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
