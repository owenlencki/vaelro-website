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
import {
  buildSessionEventsSchema,
  getSessionStatuses,
  isSession3Anchor,
} from "../lib/workshop";

const SCHEMA = buildSessionEventsSchema(currentSeries);

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

  // Links into the Session 3 block (#session-3, #prompt-3, #tall-pines...)
  // were shared while the Waupaca page was /workshop. Send them to the same
  // spot on /workshop/waupaca instead of the top of this page.
  const { hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSession3Anchor(hash)) {
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
              className="font-semibold whitespace-nowrap text-ink-900 underline decoration-orange-500 underline-offset-4 transition-colors duration-200 hover:text-orange-700"
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
