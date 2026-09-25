import { useMemo } from "react";
import { useNow } from "../hooks/useNow";
import Seo from "../seo/Seo";
import WorkshopHero from "../components/workshop/WorkshopHero";
import Outcomes from "../components/workshop/Outcomes";
import SessionTimeline from "../components/workshop/SessionTimeline";
import Speakers from "../components/workshop/Speakers";
import WhyBand from "../components/workshop/WhyBand";
import Prompts from "../components/workshop/Prompts";
import Faq from "../components/workshop/Faq";
import ChamberBand from "../components/workshop/ChamberBand";
import ClosingCta from "../components/workshop/ClosingCta";
import { workshop } from "../data/workshop";
import {
  buildEventGraph,
  getNextSession,
  getSeriesClock,
  getSeriesPhase,
  getSessionStatuses,
} from "../lib/workshop";

/**
 * The public home of the Chamber workshop series. Chamber registration has
 * closed, so the page asks for nothing: while the series runs it is the
 * attendee resource (the Session 1 card, statuses, the next session), and
 * after November 6 it becomes the record of what happened. Which of those you
 * get is decided here, once, from the data file.
 */
export default function WorkshopPage() {
  // Pinned for the life of the page so every section agrees on "now", and
  // moved forward to forcedNextSession when that is set.
  const now = getSeriesClock(
    workshop.sessions,
    useNow(),
    workshop.forcedNextSession,
  );

  const phase = getSeriesPhase(
    workshop.sessions,
    now,
    workshop.stageOverride,
  );
  const statuses = getSessionStatuses(workshop.sessions, now);
  const nextSession = getNextSession(workshop.sessions, now);
  const eventGraph = useMemo(() => buildEventGraph(workshop), []);

  return (
    <>
      <Seo
        title={workshop.meta.title}
        description={workshop.meta.description}
        path={new URL(workshop.meta.canonical).pathname}
        schema={eventGraph}
        socialTitle={workshop.meta.ogTitle}
        socialDescription={workshop.meta.ogDescription}
        image={{ url: workshop.meta.ogImage, alt: workshop.meta.ogTitle }}
      />

      <WorkshopHero phase={phase} nextSession={nextSession} />
      <Outcomes />
      <SessionTimeline statuses={statuses} />
      <Speakers />
      <WhyBand />
      <Prompts />
      <Faq />
      <ChamberBand />
      <ClosingCta phase={phase} nextSession={nextSession} />
    </>
  );
}
