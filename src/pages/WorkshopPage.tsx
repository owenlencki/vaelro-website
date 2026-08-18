import { useMemo, useRef } from "react";
import { useExclusiveMeta } from "../hooks/useExclusiveMeta";
import WorkshopHero from "../components/workshop/WorkshopHero";
import Outcomes from "../components/workshop/Outcomes";
import SessionTimeline from "../components/workshop/SessionTimeline";
import Speakers from "../components/workshop/Speakers";
import WhyBand from "../components/workshop/WhyBand";
import Prompts from "../components/workshop/Prompts";
import Faq from "../components/workshop/Faq";
import ChamberBand from "../components/workshop/ChamberBand";
import ClosingCta from "../components/workshop/ClosingCta";
import StickyCta from "../components/workshop/StickyCta";
import { workshop } from "../data/workshop";
import {
  buildEventGraph,
  getNextSession,
  getSeriesPhase,
  getSessionStatuses,
} from "../lib/workshop";

/**
 * Head tags this page owns outright. index.html carries site defaults for each
 * of these, and both would otherwise sit in <head> at once.
 */
const OWNED_META = [
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property="og:type"]',
  'meta[property="og:url"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:image"]',
  'meta[property="og:image:width"]',
  'meta[property="og:image:height"]',
  'meta[property="og:site_name"]',
  'meta[name="twitter:card"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];

/**
 * The public home of the Chamber workshop series. Before the series it
 * confirms the details and sends people to Chamber registration; during it, it
 * is the attendee resource; after November 6 it stops asking for anything and
 * becomes the record of what happened. Which of those you get is decided here,
 * once, from the data file.
 */
export default function WorkshopPage() {
  // Pinned for the life of the page so every section agrees on "now".
  const now = useMemo(() => Date.now(), []);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  const phase = getSeriesPhase(
    workshop.sessions,
    now,
    workshop.stageOverride,
  );
  const statuses = getSessionStatuses(workshop.sessions, now);
  const nextSession = getNextSession(workshop.sessions, now);
  const eventGraph = useMemo(() => buildEventGraph(workshop), []);

  useExclusiveMeta(OWNED_META);

  return (
    <>
      {/* React 19 hoists these into <head>, the same way the case-study pages
          set their titles. Link-preview crawlers do not run JavaScript, so the
          static head for /workshop is separate, later work. */}
      <title>{workshop.meta.title}</title>
      <meta name="description" content={workshop.meta.description} />
      <link rel="canonical" href={workshop.meta.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={workshop.meta.canonical} />
      <meta property="og:title" content={workshop.meta.ogTitle} />
      <meta property="og:description" content={workshop.meta.ogDescription} />
      <meta property="og:image" content={workshop.meta.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Vaelro" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={workshop.meta.ogTitle} />
      <meta
        name="twitter:description"
        content={workshop.meta.ogDescription}
      />
      <meta name="twitter:image" content={workshop.meta.ogImage} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: eventGraph }}
      />

      {/* Bottom padding clears the phone-only sticky bar. */}
      <div className="max-md:pb-24">
        <WorkshopHero
          phase={phase}
          nextSession={nextSession}
          ctaRef={heroCtaRef}
        />
        <Outcomes />
        <SessionTimeline statuses={statuses} />
        <Speakers />
        <WhyBand />
        <Prompts />
        <Faq />
        <ChamberBand />
        <ClosingCta phase={phase} />
      </div>

      {phase !== "complete" && <StickyCta watch={heroCtaRef} />}
    </>
  );
}
