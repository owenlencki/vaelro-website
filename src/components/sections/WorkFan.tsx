import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import { withBase } from "../../lib/paths";
import { fanOrder, featuredProjects, type Project } from "../../data/projects";

// Fan geometry, one place to tune. STEP_X is a fraction of card width, so the
// math handles 5 to 9 cards at any breakpoint without edits.
const FAN = {
  STEP_DEG: 8,
  STEP_X_RATIO: 0.55,
  DROP_Y: 14,
  HOVER_SCALE: 1.07,
  HOVER_LIFT: -18,
  // Hover pushes scale with card width (96px and 40px on the 260px desktop
  // card) so every neighbor of a hovered card keeps at least ~45% of its
  // width visible at each breakpoint; fixed pixels would over-push the
  // smaller md cards.
  NEIGHBOR_PUSH_RATIO: 0.37,
  OUTER_PUSH_RATIO: 0.154,
  DURATION_MS: 420,
  EASING: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

// The fan needs hover, a real pointer, and room; everything else (touch and
// narrow viewports) gets the scroll-snap strip. Capability query, not UA sniffing.
const FAN_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";

/**
 * matchMedia as state. Initialized synchronously in the useState initializer
 * so the first paint renders the correct layout (no fan/strip flash), then
 * subscribes for changes.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

type LabelAlign = "left" | "center" | "right";

/**
 * Card image plus the always-visible label scrim. Shared by fan and strip.
 * In the fan the label anchors to the corner the higher-z neighbor can't
 * cover: left of center bottom-left, right of center bottom-right, center
 * card centered. The strip always uses bottom-left.
 */
function CardFace({
  project,
  align = "left",
}: {
  project: Project;
  align?: LabelAlign;
}) {
  if (!project.images) return null;
  // The name is width-capped so long names wrap inside the corner the
  // neighboring card can't cover, instead of running a single line into it.
  const textAlign =
    align === "right"
      ? "ml-auto text-right"
      : align === "center"
        ? "mx-auto text-center"
        : "";
  const chipAlign =
    align === "right"
      ? "justify-end"
      : align === "center"
        ? "justify-center"
        : "";
  return (
    <>
      <img
        src={withBase(project.images.card)}
        alt={project.images.alt}
        width={720}
        height={1200}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Scrim: transparent at ~45% of card height down to 78% ink at the
          bottom, so the label clears 4.5:1 over the busiest screenshot
          content (worst case: pure white behind the name row). */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-ink-900/0 to-ink-900/78"
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p
          className={`max-w-[80%] font-serif text-base leading-snug font-semibold text-cream-100 ${textAlign}`}
        >
          {project.name}
        </p>
        <div className={`mt-2 flex flex-wrap gap-1.5 ${chipAlign}`}>
          <span className="rounded-full border border-cream-100/30 bg-ink-900/40 px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.12em] text-cream-100 uppercase">
            {project.category}
          </span>
          {project.badge && (
            <span className="rounded-full bg-cream-100 px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.12em] text-ink-900 uppercase">
              {project.badge}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/** Pointer-device layout: cards fanned from a common pivot below the row. */
function Fan({
  cards,
  reducedMotion,
}: {
  cards: Project[];
  reducedMotion: boolean;
}) {
  const isXl = useMediaQuery("(min-width: 1280px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [active, setActive] = useState<number | null>(null);

  const cardW = isXl ? 260 : isLg ? 220 : 160;
  const cardH = Math.round((cardW * 5) / 3);
  const stepX = FAN.STEP_X_RATIO * cardW;
  const neighborPush = FAN.NEIGHBOR_PUSH_RATIO * cardW;
  const outerPush = FAN.OUTER_PUSH_RATIO * cardW;
  // Distance from a card's center to its 50% 120% rotation pivot.
  const pivotDist = 0.7 * cardH;
  const n = cards.length;
  const minRank = Math.min(...cards.map((c) => c.rank));
  const center = cards.findIndex((p) => p.rank === minRank);

  return (
    <div className="relative mt-12 md:mt-16" style={{ height: cardH + 120 }}>
      {cards.map((p, i) => {
        const d = i - center;
        const ad = Math.abs(d);
        // Rest pose: rotate/spread/drop outward from the center card.
        let rotate = d * FAN.STEP_DEG;
        let x = d * stepX;
        let y = 48 + ad * FAN.DROP_Y;
        let scale = 1;
        let z = n - ad;
        if (active !== null && !reducedMotion) {
          if (i === active) {
            // Straightening about the low pivot swings the visual center
            // toward the middle by pivotDist*sin(restRotate); compensate so
            // the card straightens in place over its rest footprint instead
            // of sliding onto its neighbor.
            x += pivotDist * Math.sin((rotate * Math.PI) / 180);
            rotate = 0;
            y += FAN.HOVER_LIFT;
            scale = FAN.HOVER_SCALE;
          } else {
            const push =
              Math.abs(i - active) === 1 ? neighborPush : outerPush;
            x += (i < active ? -1 : 1) * push;
          }
        }
        // Under reduced motion, hover/focus still brings the card to the top
        // (transforms stay at rest; the focus ring comes from :focus-visible).
        if (active === i) z = n + 1;
        return (
          <Link
            key={p.slug}
            to={`/work/${p.slug}`}
            aria-label={`View case study: ${p.name}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="absolute top-0 left-1/2 block overflow-hidden rounded-2xl bg-cream-200 shadow-[0_12px_32px_rgba(26,26,26,0.16)] will-change-transform"
            style={{
              width: cardW,
              height: cardH,
              marginLeft: -cardW / 2,
              zIndex: z,
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
              transformOrigin: "50% 120%",
              transition: reducedMotion
                ? "none"
                : `transform ${FAN.DURATION_MS}ms ${FAN.EASING}`,
            }}
          >
            <CardFace
              project={p}
              align={i === center ? "center" : i < center ? "left" : "right"}
            />
          </Link>
        );
      })}
    </div>
  );
}

/** Touch / narrow layout: rank-ordered scroll-snap strip, pure CSS scroll. */
function Strip({ cards }: { cards: Project[] }) {
  return (
    <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map((p) => (
        <Link
          key={p.slug}
          to={`/work/${p.slug}`}
          aria-label={`View case study: ${p.name}`}
          className="relative block aspect-[3/5] w-[72vw] max-w-[320px] flex-none snap-center overflow-hidden rounded-2xl bg-cream-200 shadow-[0_10px_28px_rgba(26,26,26,0.14)]"
        >
          <CardFace project={p} />
        </Link>
      ))}
    </div>
  );
}

export default function WorkFan() {
  const fanLayout = useMediaQuery(FAN_QUERY);
  const reducedMotion = usePrefersReducedMotion();

  return (
    // The peach surface belongs to the fan. In strip mode the section uses
    // the page background so the light sections meet with no tone seam
    // above the strip on mobile.
    <section
      id="work"
      className={`scroll-mt-24 py-12 md:py-24 ${
        fanLayout ? "bg-peach-50" : "bg-cream-100"
      }`}
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          Our Work
        </p>
        <h2 className="max-w-3xl text-title text-ink-900">
          <span className="block font-sans font-extrabold tracking-tight uppercase">
            <SplitText text="What We've Built" />
          </span>
          <span className="block font-serif font-normal">
            <SplitText text="for businesses like yours" delay={0.2} />
          </span>
        </h2>

        {fanLayout ? (
          <Fan cards={fanOrder(featuredProjects)} reducedMotion={reducedMotion} />
        ) : (
          <Strip cards={featuredProjects} />
        )}

        {/* No CTA button here: SocialProof directly below carries the
            proof-to-action CTA, and two stacked buttons read badly on mobile. */}
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xl text-center text-lead text-ink-600 md:mt-14">
            Real work for real businesses. Click any card to see what we
            built and why.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
