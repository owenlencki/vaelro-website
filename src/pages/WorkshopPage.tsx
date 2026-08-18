import { useMemo } from "react";
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
  getNextSession,
  getSeriesPhase,
  getSessionStatuses,
} from "../lib/workshop";

/**
 * The public home of the Chamber workshop series. Before the series it
 * confirms the details and sends people to Chamber registration; during it, it
 * is the attendee resource; after November 6 it flips to the Gameplan call.
 * Which of those you get is decided here, once, from the data file.
 */
export default function WorkshopPage() {
  // Pinned for the life of the page so every section agrees on "now".
  const now = useMemo(() => Date.now(), []);

  const phase = getSeriesPhase(
    workshop.sessions,
    now,
    workshop.stageOverride,
  );
  const statuses = getSessionStatuses(workshop.sessions, now);
  const nextSession = getNextSession(workshop.sessions, now);

  return (
    <>
      <WorkshopHero phase={phase} nextSession={nextSession} />
      <Outcomes />
      <SessionTimeline statuses={statuses} />
      <Speakers />
      <WhyBand />
      <Prompts />
      <Faq />
      <ChamberBand />
      <ClosingCta phase={phase} />
    </>
  );
}
