import SessionHeader from "../components/workshop/session2/SessionHeader";
import Upload from "../components/workshop/session2/Upload";
import WhatsNext from "../components/workshop/session2/WhatsNext";
import Resources from "../components/workshop/session2/Resources";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import { session2 } from "../data/session2";
import Seo from "../seo/Seo";

/**
 * The Session 2 resource page, for the people in the room on October 9 and
 * the ones who take their packet home. The card at the top of /workshop links
 * here. Uploading comes first because it is why the page exists; the free
 * prompts follow. Like the Session 1 page it stays out of search (noindex, so
 * the build also leaves it out of the sitemap), and it sells nothing: the
 * series is education until Session 3.
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
      <Upload />
      <WhatsNext />
      <Resources />
      <SessionFooter footer={session2.footer} />
    </>
  );
}
