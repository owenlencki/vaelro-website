import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../seo/Seo";
import WorkshopHero from "../components/workshop/WorkshopHero";
import SessionTimeline from "../components/workshop/SessionTimeline";
import SeriesLeader from "../components/workshop/SeriesLeader";
import AttendeeCard from "../components/workshop/AttendeeCard";
import PastWorkshops from "../components/workshop/PastWorkshops";
import ClosingCta from "../components/workshop/ClosingCta";
import { currentSeries, pastSeries } from "../data/workshops";
import { waupaca } from "../data/workshops/waupaca";
import { useNow } from "../hooks/useNow";
import { buildSessionEventsSchema, getSessionStatuses } from "../lib/workshop";

const SCHEMA = buildSessionEventsSchema(currentSeries);

/**
 * Anchors that exist only on the Waupaca page, from links shared while it
 * was /workshop (#session-3, #prompt-1 to #prompt-12, and the section ids in
 * Session3.tsx). A visitor who opens one of those old links lands on the same
 * spot of /workshop/waupaca instead of the top of this page.
 */
const WAUPACA_ANCHOR =
  /^#(session-3|free-versions|catch-it-once|one-log|never-drop-a-follow-up|tall-pines|free-prompts|prompts?-[\w-]+|downloads)$/;

/**
 * The Workshops tab. The URL is printed on the table cards, so it stays
 * /workshop. It leads with the current series (Marshfield): what it is, the
 * two sessions with their live statuses, who leads them, and the card for
 * people who were in the room. Then the finished series, each on its own
 * archive page, and an email address for questions. Registration ran through
 * the Chamber, so the page asks no one to sign up and has no Book a Call
 * button.
 */
export default function WorkshopPage() {
  const series = currentSeries;
  // Pinned for the life of the page so every section agrees on "now".
  const now = useNow();
  const statuses = useMemo(
    () => getSessionStatuses(series.sessions, now),
    [series.sessions, now],
  );

  const { hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (WAUPACA_ANCHOR.test(hash)) {
      navigate({ pathname: waupaca.path, hash }, { replace: true });
    }
  }, [hash, navigate]);

  return (
    <>
      <Seo
        title={series.meta.title}
        description={series.meta.description}
        path={new URL(series.meta.canonical).pathname}
        schema={SCHEMA}
        socialTitle={series.meta.ogTitle}
        socialDescription={series.meta.ogDescription}
        image={{ url: series.meta.ogImage, alt: series.meta.ogTitle }}
      />

      <WorkshopHero
        eyebrow={series.hero.eyebrow}
        heading={series.hero.heading}
        body={series.hero.body}
        note={
          <p className="text-base leading-relaxed text-ink-600">
            {series.waupacaNote.text}{" "}
            <Link
              to={waupaca.path}
              className="inline-flex min-h-11 items-center font-semibold text-ink-900 underline decoration-orange-500 underline-offset-4 transition-colors duration-200 hover:text-orange-700"
            >
              {series.waupacaNote.linkLabel}
            </Link>
          </p>
        }
      />
      <SessionTimeline
        block={series.sessionsBlock}
        sessions={series.sessions}
        time={series.time}
        statuses={statuses}
      />
      <SeriesLeader
        eyebrow={series.leader.eyebrow}
        speaker={series.leader.speaker}
      />
      <AttendeeCard card={series.attendeeCard} />
      <PastWorkshops
        heading={series.pastWorkshops.heading}
        series={pastSeries}
      />
      <ClosingCta closing={series.closing} />
    </>
  );
}
