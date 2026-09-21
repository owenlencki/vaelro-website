import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import type { SuperBowlShot } from "../../../data/session1";
import { withBase } from "../../../lib/paths";
import { trackEvent } from "../../../lib/analytics";

/**
 * The three screenshots are real captures of whole conversations, and their
 * aspect ratios run from nearly square to very tall. Each one therefore sets
 * its own height rather than fitting a shared frame: a shared frame would
 * letterbox the square one into a mostly-empty box and shrink the tall ones
 * to about 40% of native. At full card width the tall two render near 60-75%
 * instead, which is the difference between readable and not. The cards align
 * at the top and the frame is a link to the full-size file, since the widest
 * capture is still only a third of native size on a phone.
 */
function ShotCard({ shot }: { shot: SuperBowlShot }) {
  const { superBowl } = session1;

  return (
    <li className="w-[88vw] shrink-0 snap-center sm:w-[54vw] md:w-auto">
      <p className="mb-3 font-mono text-[0.65rem] tracking-[0.18em] text-orange-400 uppercase">
        {shot.label}
      </p>

      {shot.image ? (
        <a
          href={withBase(shot.image)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("session1_superbowl_enlarge", { shot_id: shot.id })}
          className="group block"
        >
          {/* The border hugs each capture rather than boxing it, so the one
              short screenshot does not read as a half-empty frame. */}
          <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 transition-colors duration-200 group-hover:border-orange-500/60">
            <img
              src={withBase(shot.image)}
              alt={shot.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <p className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-cream-100/45 uppercase transition-colors duration-200 group-hover:text-orange-400">
            {superBowl.enlargeLabel}
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4.5 11.5 11.5 4.5" />
              <path d="M5.5 4.5h6v6" />
            </svg>
            <span className="sr-only"> (opens in a new tab)</span>
          </p>
        </a>
      ) : (
        <div className="flex aspect-[3/5] items-center justify-center rounded-2xl border border-dashed border-ink-600 bg-ink-950">
          <span className="px-4 text-center font-mono text-[0.7rem] tracking-[0.14em] text-cream-100/40 uppercase">
            {superBowl.pendingLabel}
          </span>
        </div>
      )}
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
      <ul className="mt-10 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-6 pb-2 md:mx-auto md:mt-14 md:grid md:max-w-[1200px] md:grid-cols-3 md:gap-8 md:overflow-visible md:px-10">
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
