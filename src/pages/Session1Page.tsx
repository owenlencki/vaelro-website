import SessionHeader from "../components/workshop/session1/SessionHeader";
import BuiltShowcase from "../components/workshop/session1/BuiltShowcase";
import SuperBowlTest from "../components/workshop/session1/SuperBowlTest";
import Homework from "../components/workshop/session1/Homework";
import PromptBlock from "../components/workshop/session1/PromptBlock";
import Takeaways from "../components/workshop/session1/Takeaways";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import { session1 } from "../data/session1";
import Seo from "../seo/Seo";

/**
 * The Session 1 resource hub: unlisted, reached only by the QR code and the
 * NFC tags in the room on September 25. Nothing links here, so it carries
 * noindex, and the build leaves noindex pages out of the sitemap. The link
 * still previews properly when someone texts it to the person who missed it.
 */
export default function Session1Page() {
  return (
    <>
      <Seo
        title={session1.meta.title}
        description={session1.meta.description}
        path={new URL(session1.meta.canonical).pathname}
        robots="noindex, follow"
        socialTitle={session1.header.title}
        image={{ url: session1.meta.ogImage, alt: session1.header.title }}
      />

      <SessionHeader />
      <BuiltShowcase />
      <SuperBowlTest />
      <Homework />
      <PromptBlock />
      <Takeaways />
      <SessionFooter />
    </>
  );
}
