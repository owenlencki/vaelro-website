import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";

/**
 * The free Gameplan call, offered to the businesses that attend Session 3.
 * Text only: no button and no link, because the call is not something anyone
 * can request from this page.
 */
export default function GameplanBand() {
  const { gameplan } = workshop;

  return (
    <section className="bg-peach-50 py-12 md:py-24" aria-label="The Gameplan call">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {gameplan.eyebrow}
        </p>
        <h2 className="max-w-3xl font-serif text-title font-bold text-ink-900">
          <SplitText text={gameplan.heading} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-3xl text-lead text-ink-600">{gameplan.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
