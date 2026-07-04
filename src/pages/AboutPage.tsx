import SplitText from "../components/ui/SplitText";
import Reveal from "../components/ui/Reveal";
import Parallax from "../components/ui/Parallax";
import Team from "../components/sections/Team";
import Process from "../components/sections/Process";
import WhyVaelro from "../components/sections/WhyVaelro";
import togetherImg from "../assets/team/together.jpg";

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-cream-100 pt-32 pb-12 md:pt-40 md:pb-20">
        <div className="container-site">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
            About Vaelro
          </p>
          <h1 className="max-w-3xl font-serif text-display font-bold text-ink-900">
            <SplitText text="We started Vaelro because local businesses deserve better technology." />
          </h1>
          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-lead text-ink-600">
              Vaelro is a two-person web and automation agency based in
              Waupaca, Wisconsin. We build websites and systems for local
              businesses that want technology working for them, not against
              them.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12 overflow-hidden rounded-2xl md:mt-16">
              <div className="aspect-[16/8] overflow-hidden bg-peach-100">
                <Parallax speed={0.12} className="h-full">
                  <img
                    src={togetherImg}
                    alt="Owen and Liam talking through a project"
                    className="h-[115%] w-full scale-110 object-cover object-center"
                    fetchPriority="high"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Team />
      <Process />
      <WhyVaelro />
    </>
  );
}
