import SessionHeader from "../components/workshop/session2/SessionHeader";
import WhatsNext from "../components/workshop/session2/WhatsNext";
import Resources from "../components/workshop/session2/Resources";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import { session2 } from "../data/session2";
import Seo from "../seo/Seo";

/**
 * The Session 2 resource page, for the people who were in the room on October
 * 9 and the ones who took their packet home. The card under the timeline on
 * /workshop links here. Packet uploads are closed, so it says what comes next
 * (Session 3) and offers the free prompts. Like the Session 1 page it stays
 * out of search (noindex, so the build also leaves it out of the sitemap), and
 * it sells nothing.
 */
export default function Session2Page() {
  return (
    <>
      <Seo
        title={session2.meta.title}
        description={session2.meta.description}
        path={new URL(session2.meta.canonical).pathname}
        robots="noindex, follow"
        socialTitle={session2.header.title}
        image={{ url: session2.meta.ogImage, alt: session2.header.title }}
      />

      <SessionHeader />
      <WhatsNext />
      <Resources />
      <SessionFooter footer={session2.footer} />
    </>
  );
}
