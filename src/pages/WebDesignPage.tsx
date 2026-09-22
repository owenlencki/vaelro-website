import ServiceHeader from "../components/service/ServiceHeader";
import TextSection from "../components/service/TextSection";
import OwnershipBand from "../components/service/OwnershipBand";
import SectionHeading from "../components/ui/SectionHeading";
import FeatureCards from "../components/service/FeatureCards";
import ServiceArea from "../components/service/ServiceArea";
import RelatedWork from "../components/service/RelatedWork";
import CrossLink from "../components/service/CrossLink";
import Process, { type ProcessStep } from "../components/sections/Process";
import WhyVaelro, {
  Highlight,
  type WhyBlock,
} from "../components/sections/WhyVaelro";
import ConsultationCta from "../components/sections/ConsultationCta";
import Seo from "../seo/Seo";
import { serviceSchema } from "../seo/schema";

const SCHEMA = serviceSchema({
  name: "Custom Website Design",
  serviceType: "Web design",
  description:
    "Custom, mobile-first websites for small businesses in Waupaca County, Wisconsin. Flat-rate pricing starting at $500, launched in 1 to 2 weeks, and owned completely by the client: domain, hosting, code, CMS, and analytics.",
  path: "/web-design",
  priceFrom: 500,
});

const STEPS: ProcessStep[] = [
  {
    title: "Free consultation",
    tagline: "You talk. We listen.",
    body: "A 30-minute conversation about your business, your customers, and what your site needs to do. No pitch.",
  },
  {
    title: "Flat-rate quote",
    tagline: "The math, upfront.",
    body: "One price, in writing, with the ROI math shown: what the site costs and what it needs to bring in to pay for itself. No hourly billing.",
  },
  {
    title: "Built and launched fast",
    tagline: "Live in 1 to 2 weeks.",
    body: "Most business websites go live in 1 to 2 weeks. You review everything before launch, and we handle the domain, hosting, and setup.",
  },
];

const PROMISES: WhyBlock[] = [
  {
    heading: (
      <>
        You <Highlight>own everything</Highlight>.
      </>
    ),
    body: "Your domain, hosting, code, content editor, and analytics are all in your name, with admin access from day one.",
  },
  {
    heading: (
      <>
        <Highlight>Transparent</Highlight> pricing.
      </>
    ),
    body: "Websites start at $500. You see the full price, and the math behind it, before any work starts.",
  },
  {
    heading: (
      <>
        <Highlight>Month-to-month</Highlight> support.
      </>
    ),
    body: "Keep us on month to month for updates, fixes, and new pages, and stop whenever you want. No long-term contract.",
  },
  {
    heading: (
      <>
        <Highlight>No lock-in</Highlight>. Ever.
      </>
    ),
    body: "No transfer fees and no holding your site hostage. If you ever leave, everything goes with you.",
  },
];

export default function WebDesignPage() {
  return (
    <>
      <Seo
        title="Custom Website Design in Waupaca, WI | Vaelro"
        description="Affordable custom websites for Waupaca County businesses. Fast, mobile-first sites you own completely. No lock-in, no templates. Free consultation."
        path="/web-design"
        schema={SCHEMA}
      />
      <ServiceHeader
        eyebrow="Web Design · Waupaca, WI"
        title="Custom Website Design for Waupaca County Businesses"
        lead="Fast, mobile-first websites for local businesses, designed from scratch and owned by you: the domain, the hosting, and every line of code."
        secondary={{ label: "See sites we've built", href: "#recent-work" }}
      />

      <TextSection
        eyebrow="The Problem"
        title="Most small business websites aren't bringing in business"
        paragraphs={[
          "People look you up before they call, stop in, or buy. Usually on a phone, usually in a hurry. If your site takes forever to load, hides your phone number, or still lists last year's hours, they move on to the next result.",
          "Across rural Wisconsin, a lot of good businesses are stuck with exactly that: a template someone set up years ago, a login nobody remembers, and a site that hasn't brought in a lead since launch day. The business isn't the problem. The website just isn't doing its job.",
        ]}
      />

      <OwnershipBand
        eyebrow="What We Build"
        title="Fast, mobile-first websites you own completely"
        lead="Every site we build starts with your business, not a theme. We design for the phone first, because that is where most of your customers will see it, and the site works on every screen from an old phone to a desktop monitor."
        stats={[
          {
            label: "Load time",
            value: "Under 2s",
            body: "Sites that load in under 2 seconds, so visitors stay long enough to call.",
          },
          {
            label: "Every device",
            value: "Mobile-first",
            body: "Mobile-first design that works on every device, from phones to desktops.",
          },
          {
            label: "Ownership",
            value: "100% yours",
            body: "Admin access to everything from day one, and a site you can update yourself.",
          },
        ]}
        owned={[
          "Your domain",
          "Your hosting",
          "The code",
          "The content editor",
          "Your analytics",
        ]}
        ownedNote="It is all registered to you, not us. If you ever decide to leave, you take the whole site with you."
      />

      <section className="bg-cream-100 py-12 md:py-24" aria-label="Why Vaelro">
        <div className="container-site">
          <SectionHeading
            eyebrow="Why Vaelro"
            title="Not a DIY builder. Not a big-city agency."
          />
          <FeatureCards
            columns={2}
            items={[
              {
                label: "Versus doing it yourself",
                title: "Done for you, and done right",
                body: "Website builders promise a site in an afternoon. Then the afternoon turns into weekends, the template looks like everyone else's, and there is nobody to call when something breaks. We handle the design, the words on the page, and the setup, and you can reach us directly.",
              },
              {
                label: "Versus a big-city agency",
                title: "Faster, more affordable, and personal",
                body: "Agencies in Milwaukee or Chicago can build a good site. They also take months, bill like it, and hand you off to an account manager. We move faster, cost less, and you work with the two people actually building your site.",
              },
            ]}
          />
        </div>
      </section>

      <Process
        eyebrow="How It Works"
        title="From first call to launch in three steps"
        steps={STEPS}
      />

      <WhyVaelro
        eyebrow="The Fine Print"
        title="Our promises, in plain English"
        blocks={PROMISES}
      />

      <ServiceArea
        title="Local web design across Waupaca County"
        body="We are based in Waupaca and build websites for businesses across the county and central Wisconsin. Local means we can meet in person, learn how your business actually runs, and pick up the phone when you need something."
      />

      <RelatedWork
        id="recent-work"
        eyebrow="Recent Work"
        title="Local websites we've built"
        slugs={["health-fitness-headquarters", "chicken-shack", "715-harvest-fest"]}
        quoteFrom="715-harvest-fest"
      />

      <CrossLink
        eyebrow="Need more than a website?"
        title="Put your website to work behind the scenes"
        body="Inquiries that route themselves, reminders that go out on time, and follow-ups nobody has to remember. Automation takes a good website further."
        to="/automation"
        label="See business automation"
      />

      <ConsultationCta
        heading="Let's build a website that brings in customers"
        body="Book a free 30-minute consultation. We'll look at what you have now, talk through what your site should do, and give you a flat-rate quote."
      />
    </>
  );
}
