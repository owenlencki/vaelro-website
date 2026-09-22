import { Link } from "react-router-dom";
import SplitText from "../components/ui/SplitText";
import Reveal from "../components/ui/Reveal";
import Parallax from "../components/ui/Parallax";
import TextSection from "../components/service/TextSection";
import FeatureCards from "../components/service/FeatureCards";
import Team from "../components/sections/Team";
import Process from "../components/sections/Process";
import WhyVaelro from "../components/sections/WhyVaelro";
import ConsultationCta from "../components/sections/ConsultationCta";
import togetherImg from "../assets/team/together.jpg";

const inlineLink = "nav-link font-semibold text-ink-900 hover:text-orange-600";

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-cream-100 pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="container-site">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
            About Vaelro
          </p>
          <h1 className="max-w-4xl font-serif text-display font-bold text-ink-900">
            <SplitText text="Two Builders. One Mission. Better Websites for Waupaca County." />
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-lead text-ink-600">
              Vaelro is a two-person{" "}
              <Link to="/web-design" className={inlineLink}>
                web design
              </Link>{" "}
              and{" "}
              <Link to="/automation" className={inlineLink}>
                automation
              </Link>{" "}
              studio in Waupaca, Wisconsin. We build websites and systems for
              local businesses that want technology working for them, not
              against them.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12 overflow-hidden rounded-2xl md:mt-16">
              <div className="aspect-[16/8] overflow-hidden bg-peach-100">
                <Parallax speed={0.12} className="h-full">
                  <img
                    src={togetherImg}
                    alt="Owen Lencki and Liam Bloedow, the co-founders of Vaelro in Waupaca, WI, talking through a project"
                    className="h-[115%] w-full scale-110 object-cover object-center"
                    fetchPriority="high"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TextSection
        eyebrow="Our Story"
        title="Why we started Vaelro"
        paragraphs={[
          "We're Owen Lencki and Liam Bloedow, and we both grew up in Waupaca. At college, Owen studying marketing at UW-Stevens Point and Liam at UW-Madison, we kept seeing the same thing back home: good local businesses stuck with websites nobody had touched in years, and owners spending their evenings on paperwork that software should have handled.",
          "The businesses weren't the problem. Nobody nearby was building this kind of technology for them, and the agencies that could were charging big-city prices and moving on after launch.",
          "So we started Vaelro. We believe a Waupaca plumber deserves a website as good as a Milwaukee law firm's: as fast, as polished, and as good at bringing in customers, without the big-city price tag or the months of waiting.",
        ]}
      >
        <FeatureCards
          items={[
            {
              label: "Commitment 01",
              title: "You own everything",
              body: "Your domain, hosting, code, and content are in your name from day one. If you ever leave, it all goes with you.",
            },
            {
              label: "Commitment 02",
              title: "Transparent pricing",
              body: "Every project gets a flat-rate quote with the math shown upfront, before any work starts.",
            },
            {
              label: "Commitment 03",
              title: "Honest scoping",
              body: "If something isn't worth building, we'll tell you, even when that means a smaller project for us.",
            },
          ]}
        />
      </TextSection>

      <Team />
      <Process />
      <WhyVaelro />
      <ConsultationCta
        heading="Let's talk about your business"
        body="Book a free 30-minute consultation. No pitch deck and no pressure, just a straight answer about where we can help."
      />
    </>
  );
}
