import Reveal from "../ui/Reveal";
import Portrait from "./Portrait";
import type { Speaker } from "../../data/workshop";

interface SeriesLeaderProps {
  eyebrow: string;
  speaker: Speaker;
}

/**
 * The one person leading a series: portrait beside name, role and bio. On a
 * phone the portrait sits above the text at a modest size.
 */
export default function SeriesLeader({ eyebrow, speaker }: SeriesLeaderProps) {
  return (
    <section
      id="leader"
      className="bg-cream-100 py-12 md:py-24"
      aria-labelledby="leader-heading"
    >
      <div className="container-site">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:items-center md:gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <div className="w-40 overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(26,26,26,0.1)] sm:w-auto">
            <Portrait
              speaker={speaker}
              sizes="(min-width: 1024px) 17rem, (min-width: 640px) 13rem, 10rem"
            />
          </div>

          <Reveal>
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
              {eyebrow}
            </p>
            <h2
              id="leader-heading"
              className="font-serif text-title font-bold text-ink-900"
            >
              {speaker.name}
            </h2>
            <p className="mt-2 font-mono text-xs tracking-[0.18em] text-orange-700 uppercase">
              {speaker.role}
            </p>
            <p className="mt-5 max-w-xl text-lead text-ink-600">{speaker.bio}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
