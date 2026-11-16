import SessionHeader from "../components/workshop/session1/SessionHeader";
import SuperBowlTest from "../components/workshop/session1/SuperBowlTest";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import ThinkOfIt from "../components/workshop/marshfield/ThinkOfIt";
import SavesTime from "../components/workshop/marshfield/SavesTime";
import YouDecide from "../components/workshop/marshfield/YouDecide";
import Setup from "../components/workshop/marshfield/Setup";
import LearnToAsk from "../components/workshop/marshfield/LearnToAsk";
import Habits from "../components/workshop/marshfield/Habits";
import OnePrompt from "../components/workshop/marshfield/OnePrompt";
import WhatHappensNext from "../components/workshop/marshfield/WhatHappensNext";
import { marshfieldSession1 } from "../data/workshops/marshfield-session1";
import { people } from "../data/workshop";
import Seo from "../seo/Seo";

/**
 * The Marshfield Session 1 recap, for the people who were in the room on
 * November 17, built from the slideshow and modelled on the Waupaca Session 1
 * page (same header, same Super Bowl test band, same Copy button and sign-off
 * card). The attendee card on /workshop links here. It stays out of search
 * (noindex, so the build also leaves it out of the sitemap), but the link
 * still previews properly when someone texts it on.
 */
export default function MarshfieldSession1Page() {
  const page = marshfieldSession1;

  return (
    <>
      <Seo
        title={page.meta.title}
        description={page.meta.description}
        path={new URL(page.meta.canonical).pathname}
        robots="noindex, follow"
        socialTitle={page.header.title}
        image={{ url: page.meta.ogImage, alt: page.header.title }}
      />

      <SessionHeader
        page={{ header: page.header, photo: people.owen.photo[0] }}
      />
      <ThinkOfIt />
      <SuperBowlTest
        superBowl={page.superBowl}
        enlargeEvent="marshfield_superbowl_enlarge"
      />
      <SavesTime />
      <YouDecide />
      <Setup />
      <LearnToAsk />
      <Habits />
      <OnePrompt />
      <WhatHappensNext />
      {/* The sign-off card has no top padding of its own, and here it follows
          a dark band rather than a cream one. */}
      <div className="bg-cream-100 pt-14 md:pt-24">
        <SessionFooter footer={page.footer} />
      </div>
    </>
  );
}
