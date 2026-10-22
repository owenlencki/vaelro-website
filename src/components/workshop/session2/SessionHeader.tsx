import SplitText from "../../ui/SplitText";
import { session2 } from "../../../data/session2";

/**
 * Thinner than Session 1's header: it says where you are and stops, with
 * tighter padding, no portrait, and no reveal.
 */
export default function SessionHeader() {
  const { header } = session2;

  return (
    <header className="bg-cream-100 pt-24 pb-6 md:pt-36 md:pb-10">
      <div className="container-site">
        <p className="font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {header.date}
        </p>
        <h1 className="mt-3 font-serif text-title font-bold text-ink-900 md:mt-4 md:text-display">
          <SplitText text={header.title} />
        </h1>
        <p className="mt-3 leading-relaxed text-ink-600 md:mt-6">
          {header.line}
        </p>
      </div>
    </header>
  );
}
