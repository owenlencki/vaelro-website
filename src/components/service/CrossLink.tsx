import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

interface CrossLinkProps {
  eyebrow: string;
  title: string;
  body: string;
  to: string;
  /** Link text. Describe the destination; it is also the anchor text crawlers read. */
  label: string;
}

/**
 * Points from one service page to the other. The whole card is clickable, but
 * the link itself is just the label, so its accessible name stays short.
 */
export default function CrossLink({ eyebrow, title, body, to, label }: CrossLinkProps) {
  return (
    <section className="bg-cream-100 pb-16 md:pb-24" aria-label={eyebrow}>
      <div className="container-site">
        <Reveal>
          <div className="group relative flex flex-col gap-6 rounded-3xl border border-cream-300 bg-cream-50 px-6 py-10 shadow-[0_4px_20px_rgba(26,26,26,0.06)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(26,26,26,0.12)] md:flex-row md:items-center md:justify-between md:gap-10 md:px-12 md:py-12">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-orange-600 uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-heading font-bold text-ink-900">
                {title}
              </h2>
              <p className="mt-2 max-w-xl leading-relaxed text-ink-600">{body}</p>
            </div>
            <Link
              to={to}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 font-semibold text-orange-600 after:absolute after:inset-0 after:rounded-3xl group-hover:text-orange-700"
            >
              {label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
