import Seo from "../seo/Seo";
import WorkshopHero from "../components/workshop/WorkshopHero";
import Session3 from "../components/workshop/Session3";
import AttendeeCard from "../components/workshop/AttendeeCard";
import ClosingCta from "../components/workshop/ClosingCta";
import { waupaca } from "../data/workshops/waupaca";
import { session3 } from "../data/session3";
import { buildWorkshopSchema } from "../lib/workshop";

const SCHEMA = buildWorkshopSchema(waupaca);

/**
 * The archive of the Waupaca Area Chamber series, which wrapped on November 6.
 * Until the Marshfield series this page was /workshop, and it moved here
 * intact: a thank you, then everything that was promised, free to copy (the
 * three free versions, the Tall Pines build, the prompts and the prompt card,
 * the Session 1 and 2 pages), and an email address for questions. It stays
 * indexable and in the sitemap. Old /workshop#session-3 and #prompt-N links
 * are forwarded here by the /workshop page.
 */
export default function WaupacaWorkshopPage() {
  return (
    <>
      <Seo
        title={waupaca.meta.title}
        description={waupaca.meta.description}
        path={new URL(waupaca.meta.canonical).pathname}
        schema={SCHEMA}
        socialTitle={waupaca.meta.ogTitle}
        socialDescription={waupaca.meta.ogDescription}
        image={{ url: waupaca.meta.ogImage, alt: waupaca.meta.ogTitle }}
      />

      <WorkshopHero
        eyebrow={waupaca.hero.eyebrow}
        heading={waupaca.hero.heading}
        body={waupaca.hero.body}
        jumpLink={{ label: session3.heroLink, to: { hash: "#session-3" } }}
        speakers={waupaca.speakers}
      />
      <Session3 />
      <AttendeeCard card={waupaca.attendeeCard} />
      <ClosingCta closing={waupaca.closing} />
    </>
  );
}
