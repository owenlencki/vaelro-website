import SessionHeader from "../components/workshop/session1/SessionHeader";
import OneIdea from "../components/workshop/session1/OneIdea";
import SuperBowlTest from "../components/workshop/session1/SuperBowlTest";
import TryThis from "../components/workshop/session1/TryThis";
import Cautions from "../components/workshop/session1/Cautions";
import Homework from "../components/workshop/session1/Homework";
import BuiltShowcase from "../components/workshop/session1/BuiltShowcase";
import FeedbackForm from "../components/workshop/session1/FeedbackForm";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import { session1 } from "../data/session1";
import Seo from "../seo/Seo";

/**
 * The Session 1 resource page, for the people who were in the room on
 * September 25. The NFC tags and QR codes open /workshop, whose top card links
 * here. It stays out of search (noindex, so the build also leaves it out of
 * the sitemap) because /workshop is the page that should rank, but the link
 * still previews properly when someone texts it to a person who missed it.
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
      <OneIdea />
      <SuperBowlTest />
      <TryThis />
      <Cautions />
      <Homework />
      <BuiltShowcase />
      <FeedbackForm />
      <SessionFooter />
    </>
  );
}
