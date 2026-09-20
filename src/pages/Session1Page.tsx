import { useExclusiveMeta } from "../hooks/useExclusiveMeta";
import SessionHeader from "../components/workshop/session1/SessionHeader";
import BuiltShowcase from "../components/workshop/session1/BuiltShowcase";
import SuperBowlTest from "../components/workshop/session1/SuperBowlTest";
import Homework from "../components/workshop/session1/Homework";
import PromptBlock from "../components/workshop/session1/PromptBlock";
import Takeaways from "../components/workshop/session1/Takeaways";
import SessionFooter from "../components/workshop/session1/SessionFooter";
import { session1 } from "../data/session1";

/** Head tags this page owns outright; index.html carries site defaults. */
const OWNED_META = [
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property="og:url"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
];

/**
 * The Session 1 resource hub: unlisted, reached only by the QR code and the
 * NFC tags in the room on September 25. Nothing links here, so it carries
 * noindex and stays out of public/sitemap.xml -- the link still previews
 * properly when someone texts it to the person who missed it.
 */
export default function Session1Page() {
  useExclusiveMeta(OWNED_META);

  return (
    <>
      <title>{session1.meta.title}</title>
      <meta name="description" content={session1.meta.description} />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href={session1.meta.canonical} />
      <meta property="og:url" content={session1.meta.canonical} />
      <meta property="og:title" content={session1.header.title} />
      <meta property="og:description" content={session1.meta.description} />
      <meta property="og:image" content={session1.meta.ogImage} />
      <meta name="twitter:title" content={session1.header.title} />
      <meta name="twitter:description" content={session1.meta.description} />

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
