import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";
import BusinessNap from "../ui/BusinessNap";
import { business } from "../../data/business";
import logoCream from "../../assets/logos/logo-horizontal-cream.png";

/** Every public page, in nav order. The footer is where they all link. */
const PAGES = [
  { label: "Home", to: "/" },
  { label: "Web Design", to: "/web-design" },
  { label: "Automation", to: "/automation" },
  { label: "Workshop", to: "/workshop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const columnLabel =
  "font-mono text-[0.65rem] tracking-[0.18em] text-cream-100/50 uppercase";
const columnLink =
  "nav-link inline-flex min-h-11 items-center font-semibold text-cream-100 hover:text-orange-300 md:min-h-9";

export default function Footer() {
  return (
    <footer className="relative bg-ink-950 bg-noise text-cream-100">
      <div className="container-site py-14 md:py-16">
        <Reveal>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-[0.95rem] lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:gap-x-10">
            <div className="col-span-2 lg:col-span-1">
              <Link
                to="/"
                className="flex min-h-11 w-fit items-center"
                aria-label="Vaelro home"
              >
                <img
                  src={logoCream}
                  alt="Vaelro"
                  width="791"
                  height="200"
                  loading="lazy"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-xs leading-relaxed text-cream-100/70">
                Custom websites and business automation for small businesses in
                Waupaca County and central Wisconsin.
              </p>
            </div>

            <nav aria-label="Footer">
              <p className={columnLabel}>Pages</p>
              <ul className="mt-3">
                {PAGES.map((page) => (
                  <li key={page.to}>
                    <Link to={page.to} className={columnLink}>
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className={columnLabel}>Follow</p>
              <ul className="mt-3">
                {business.social.map((profile) => (
                  <li key={profile.url}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={columnLink}
                    >
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <p className={columnLabel}>Contact</p>
              <BusinessNap tone="dark" className="mt-3" />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-cream-100/10 pt-6 text-sm text-cream-100/50 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 {business.name}. All rights reserved.</span>
            <Link
              to="/privacy"
              className="nav-link inline-flex min-h-11 w-fit items-center text-cream-100/50 hover:text-cream-100"
            >
              Privacy Policy
            </Link>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
