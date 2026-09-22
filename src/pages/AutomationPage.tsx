import ServiceHeader from "../components/service/ServiceHeader";
import TextSection from "../components/service/TextSection";
import SectionHeading from "../components/ui/SectionHeading";
import FeatureCards, { type Feature } from "../components/service/FeatureCards";
import RoiMath from "../components/service/RoiMath";
import ServiceArea from "../components/service/ServiceArea";
import RelatedWork from "../components/service/RelatedWork";
import CrossLink from "../components/service/CrossLink";
import Reveal from "../components/ui/Reveal";
import Process, { type ProcessStep } from "../components/sections/Process";
import ConsultationCta from "../components/sections/ConsultationCta";
import Seo from "../seo/Seo";
import { serviceSchema } from "../seo/schema";

const SCHEMA = serviceSchema({
  name: "Business Automation",
  serviceType: "Business process automation",
  description:
    "Custom automation systems for small businesses in Waupaca County, Wisconsin: client intake, appointment scheduling, follow-up sequences, invoicing reminders, review requests, and reporting. Quoted with the payback math upfront.",
  path: "/automation",
});

const AUTOMATIONS: Feature[] = [
  {
    title: "Client intake",
    body: "New inquiries land in one place with everything you need, instead of scattered across email, texts, and voicemail.",
  },
  {
    title: "Appointment scheduling",
    body: "Customers book open times on their own, and reminders go out automatically, so fewer people forget.",
  },
  {
    title: "Follow-up sequences",
    body: "Leads, quotes, and past customers get a timely follow-up without anyone having to remember to send it.",
  },
  {
    title: "Invoicing reminders",
    body: "Polite reminders go out when payment is due, so you stop chasing invoices by hand.",
  },
  {
    title: "Review requests",
    body: "Happy customers get a well-timed ask for a review, which helps the next customer find you.",
  },
  {
    title: "Reporting",
    body: "The numbers you check every week, pulled together automatically and delivered on a schedule.",
  },
];

const STEPS: ProcessStep[] = [
  {
    title: "Free consultation",
    tagline: "Find the hours.",
    body: "We learn how your business runs and where the time goes, then tell you what is worth automating and what isn't.",
  },
  {
    title: "The math, upfront",
    tagline: "Know the payback.",
    body: "You get one price, with the time saved and the payback spelled out, before we build anything.",
  },
  {
    title: "Build and test",
    tagline: "Custom, not off the shelf.",
    body: "We build around the tools you already use, like your email, calendar, spreadsheets, and forms, and test it on your real work.",
  },
  {
    title: "Launch and support",
    tagline: "We stay on.",
    body: "We train your team, then stay on month to month to keep everything running and improving.",
  },
];

export default function AutomationPage() {
  return (
    <>
      <Seo
        title="Small Business Automation in Waupaca, WI | Vaelro"
        description="Custom automation systems that save hours every week. Client intake, scheduling, follow-ups, reporting. Built for Waupaca County small businesses."
        path="/automation"
        schema={SCHEMA}
      />
      <ServiceHeader
        eyebrow="Business Automation · Waupaca, WI"
        title="Business Automation That Actually Pays for Itself"
        lead="We build systems that take the repetitive work off your plate, from client intake and scheduling to follow-ups and reporting, so you and your team get hours back every week."
        secondary={{ label: "See it in practice", href: "#in-practice" }}
      />

      <TextSection
        eyebrow="The Problem"
        title="Where the week actually goes"
        paragraphs={[
          "Ask most small business owners where their time goes, and it isn't the work they're good at. It's everything around it: answering the same questions, typing the same information into three places, reminding customers about appointments, and pulling the numbers together at the end of the month.",
          "None of it is hard. It just never stops, and it adds up to hours every week that could go to customers, to growing the business, or to getting home on time.",
        ]}
      />

      <section className="bg-peach-50 py-12 md:py-24" aria-label="What we automate">
        <div className="container-site">
          <SectionHeading eyebrow="What We Automate" title="The busywork, handled" />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-lead text-ink-600">
              Custom-built workflows, not off-the-shelf software with another
              monthly fee. These are the ones we build most often.
            </p>
          </Reveal>
          <FeatureCards items={AUTOMATIONS} />
          <Reveal>
            <p className="mt-10 max-w-3xl leading-relaxed text-ink-600 md:mt-12">
              Where AI genuinely saves time, like drafting emails in your voice
              or pulling details out of documents, we build it in, and we build
              those tools to run without ongoing AI costs.
            </p>
          </Reveal>
        </div>
      </section>

      <RoiMath
        eyebrow="ROI First"
        title="If it won't pay for itself, we won't build it"
        paragraphs={[
          "Automation is only worth it when it saves more than it costs. So every project starts with the math. In the free consultation, we look at where your hours go, estimate what each fix would save, and put that number next to the price.",
          "If the numbers don't work, we'll tell you, and we won't sell it to you.",
        ]}
        heading="One repetitive task, one year"
        rows={[
          { value: "5", label: "hours a week" },
          { op: "×", value: "$40", label: "an hour of your time" },
          { op: "×", value: "52", label: "weeks a year" },
          { op: "=", value: "$10,400", label: "a year, for one task" },
        ]}
        caption="An example, not a promise. Your real numbers come out of the consultation."
      />

      <Process
        eyebrow="How It Works"
        title="Built around how you already work"
        steps={STEPS}
      />

      <TextSection
        eyebrow="What You Own"
        title="It's yours to keep"
        paragraphs={[
          "When we build a system for you, you get a perpetual license to use it. No per-user pricing, no subscription that climbs every year, and no losing it if you stop working with us.",
        ]}
      >
        <FeatureCards
          items={[
            {
              title: "Perpetual license",
              body: "Use what we build for as long as your business needs it.",
            },
            {
              title: "No per-seat fees",
              body: "Add people to your team without the bill going up.",
            },
            {
              title: "Month-to-month support",
              body: "Keep us on for changes and fixes, and stop whenever you want.",
            },
          ]}
        />
      </TextSection>

      <RelatedWork
        id="in-practice"
        eyebrow="In Practice"
        title="Automation we've built for local businesses"
        slugs={["udoni-salan-real-estate", "715-harvest-fest"]}
        quoteFrom="udoni-salan-real-estate"
      />

      <ServiceArea
        title="Business automation across Waupaca County"
        body="We are based in Waupaca and build automation for businesses across the county and central Wisconsin. We can sit down with you in person, see how the work actually gets done, and build around that."
      />

      <CrossLink
        eyebrow="Starting with a website?"
        title="Get the front door right first"
        body="For most customers, your website is the first thing they see. We build fast, mobile-first sites that you own completely."
        to="/web-design"
        label="See website design"
      />

      <ConsultationCta
        heading="Find out what's worth automating"
        body="Book a free 30-minute consultation. We'll look at where your hours go and tell you honestly what is worth automating, and what isn't."
      />
    </>
  );
}
