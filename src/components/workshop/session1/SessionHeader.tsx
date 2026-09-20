import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";

/**
 * Deliberately thin. Whoever is reading this scanned a code in the room, so
 * the header confirms they are in the right place and gets out of the way.
 */
export default function SessionHeader() {
  const { header } = session1;

  return (
    <header className="bg-cream-100 pt-28 pb-10 md:pt-36 md:pb-6">
      <div className="container-site">
        <p className="font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {header.eyebrow}
        </p>
        <h1 className="mt-4 font-serif text-title font-bold text-ink-900 md:text-display">
          <SplitText text={header.title} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-4 max-w-xl text-lead text-ink-600">
            {header.subtitle}
          </p>
          <div
            className="mt-8 h-px w-16 bg-orange-500/60"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </header>
  );
}
