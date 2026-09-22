import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import { useLenisContext } from "../../hooks/useLenis";

interface ServiceHeaderProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** In-page link beside the button, e.g. down to the work examples. */
  secondary?: { label: string; href: `#${string}` };
}

/** Top of a service page: the h1, one sentence, and the consultation button. */
export default function ServiceHeader({
  eyebrow,
  title,
  lead,
  secondary,
}: ServiceHeaderProps) {
  const { scrollTo } = useLenisContext();

  // A plain anchor, so it still jumps without JavaScript; with it, Lenis
  // eases the scroll and clears the fixed nav.
  function jump(e: MouseEvent<HTMLAnchorElement>) {
    if (!secondary) return;
    e.preventDefault();
    scrollTo(secondary.href, { offset: -88 });
  }

  return (
    <section className="bg-cream-100 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-serif text-display font-bold text-ink-900">
          <SplitText text={title} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-6 max-w-2xl text-lead text-ink-600">{lead}</p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <MagneticButton>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-[0_8px_30px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
              >
                Book a Free Consultation
              </Link>
            </MagneticButton>
            {secondary && (
              <a
                href={secondary.href}
                onClick={jump}
                className="nav-link inline-flex min-h-12 items-center gap-2 text-base font-semibold text-ink-900 hover:text-orange-600"
              >
                {secondary.label} <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
