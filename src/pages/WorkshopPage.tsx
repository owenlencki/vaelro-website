import Seo from "../seo/Seo";
import WorkshopHero from "../components/workshop/WorkshopHero";
import Session3 from "../components/workshop/Session3";
import AttendeeCard from "../components/workshop/AttendeeCard";
import ClosingCta from "../components/workshop/ClosingCta";
import { workshop } from "../data/workshop";
import { buildWorkshopSchema } from "../lib/workshop";

const SCHEMA = buildWorkshopSchema(workshop);

/**
 * The public home of the Chamber workshop series, which wrapped on November 6.
 * The URL is printed on the table cards, so it stays /workshop. The page asks
 * for nothing: a thank you, then everything that was promised, free to copy
 * (the three free versions, the Tall Pines build, the prompts and the prompt
 * card, the Session 1 and 2 pages), and an email address for questions.
 */
export default function WorkshopPage() {
  return (
    <>
      <Seo
        title={workshop.meta.title}
        description={workshop.meta.description}
        path={new URL(workshop.meta.canonical).pathname}
        schema={SCHEMA}
        socialTitle={workshop.meta.ogTitle}
        socialDescription={workshop.meta.ogDescription}
        image={{ url: workshop.meta.ogImage, alt: workshop.meta.ogTitle }}
      />

      <WorkshopHero />
      <Session3 />
      <AttendeeCard />
      <ClosingCta />
    </>
  );
}
