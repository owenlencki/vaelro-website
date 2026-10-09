import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

interface FooterCopy {
  eyebrow: string;
  line: string;
  email: string;
  /** Subject line of the email the address opens. */
  emailSubject?: string;
}

/**
 * The page's sign-off: when and where the next session is, and the address
 * to write to. The site footer below it carries everything else. It reads
 * Session 1's copy unless a later session's page hands it its own.
 */
export default function SessionFooter({
  footer = session1.footer,
}: {
  footer?: FooterCopy;
}) {
  const subject = footer.emailSubject ?? "Workshop Session 1";

  return (
    <section
      className="bg-cream-100 pb-16 md:pb-24"
      aria-labelledby="next-session-heading"
    >
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 bg-noise px-6 py-12 text-center md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
              {footer.eyebrow}
            </p>
            <h2
              id="next-session-heading"
              className="mx-auto mt-4 max-w-2xl font-serif text-title font-bold text-cream-100"
            >
              <SplitText text={footer.line} />
            </h2>

            <Reveal delay={0.25}>
              <a
                href={`mailto:${footer.email}?subject=${encodeURIComponent(subject)}`}
                className="nav-link mt-6 inline-flex min-h-11 items-center font-semibold text-orange-300 hover:text-orange-200"
              >
                {footer.email}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
