import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import type { SuperBowlShot } from "../../../data/session1";
import { withBase } from "../../../lib/paths";

function ShotCard({ shot }: { shot: SuperBowlShot }) {
  return (
    <li className="w-[72vw] shrink-0 snap-center sm:w-[46vw] md:w-auto">
      <p className="mb-3 font-mono text-[0.65rem] tracking-[0.18em] text-orange-400 uppercase">
        {shot.label}
      </p>
      {/* Phone-shaped frame, contain-fit: whatever the screenshot's own aspect
          turns out to be, the whole answer stays readable and nothing crops. */}
      <div
        className={`aspect-[9/16] overflow-hidden rounded-2xl border bg-ink-800 ${
          shot.image
            ? "border-ink-700"
            : "flex items-center justify-center border-dashed border-ink-600"
        }`}
      >
        {shot.image ? (
          <img
            src={withBase(shot.image)}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="px-4 text-center font-mono text-[0.7rem] tracking-[0.14em] text-cream-100/40 uppercase">
            {session1.superBowl.pendingLabel}
          </span>
        )}
      </div>
    </li>
  );
}

/**
 * The dark band in the middle of the page: three answers to one question, side
 * by side. On a phone they swipe horizontally rather than stacking, so the
 * "three different answers" point lands in one screen instead of three.
 */
export default function SuperBowlTest() {
  const { superBowl } = session1;

  return (
    <section
      id="super-bowl-test"
      className="relative overflow-hidden bg-ink-900 bg-noise py-14 md:py-24"
      aria-label="The Super Bowl test"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          {superBowl.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-cream-100">
          <SplitText text={superBowl.heading} />
        </h2>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-xl leading-relaxed text-cream-100/75">
            {superBowl.intro}
          </p>
        </Reveal>
      </div>

      {/* Bleeds to the screen edge on a phone so the row reads as swipeable,
          then becomes a plain three-across grid. The widths and insets restate
          .container-site rather than composing it: a class defined in
          @layer components has no md: variant to apply. */}
      <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-8 md:overflow-visible md:px-10">
        {superBowl.shots.map((shot) => (
          <ShotCard key={shot.id} shot={shot} />
        ))}
      </ul>

      <div className="container-site relative">
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl border-l-2 border-orange-500 pl-5 font-serif text-heading font-bold text-cream-100 md:mt-14">
            {superBowl.kicker}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
