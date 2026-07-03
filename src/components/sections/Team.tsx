import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import Parallax from "../ui/Parallax";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import owenImg from "../../assets/team/owen.jpg";
import liamImg from "../../assets/team/liam.jpg";

const TEAM = [
  {
    name: "Owen Lencki",
    role: "Co-founder",
    photo: owenImg,
    alt: "Owen Lencki speaking at an event",
    bio: "Sales, strategy, client relationships, and website builds. College sophomore and D3 athlete at UW-Stevens Point who started Vaelro because local businesses deserve technology that actually works for them.",
  },
  {
    name: "Liam Bloedow",
    role: "Co-founder",
    photo: liamImg,
    alt: "Liam Bloedow explaining a system at a whiteboard",
    bio: "Automation architect and infrastructure lead. Builds the n8n workflows, manages deployments, and makes the systems run. Currently working with Higgsfield AI on next-generation video content.",
  },
];

export default function Team() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="The team">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          Who's Behind This
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text="Two founders. Zero account managers." />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-xl text-lead text-ink-600">
            When you work with Vaelro, you work with the two people who
            actually build your systems.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-10">
          {TEAM.map((member, i) => (
            <div key={member.name}>
              {/* Masked photo reveal + parallax. The observed wrapper stays
                  unclipped — a fully clip-pathed element never intersects,
                  so whileInView on the mask itself would deadlock. */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div
                  className="overflow-hidden rounded-2xl"
                  variants={{
                    hidden: reducedMotion
                      ? { opacity: 0 }
                      : { clipPath: "inset(0 0 100% 0)" },
                    visible: reducedMotion
                      ? { opacity: 1 }
                      : { clipPath: "inset(0 0 0% 0)" },
                  }}
                  transition={{
                    duration: 0.9,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-peach-100">
                  <Parallax speed={0.12} className="h-full">
                    <img
                      src={member.photo}
                      alt={member.alt}
                      loading="lazy"
                      className="h-[115%] w-full scale-110 object-cover object-center"
                    />
                  </Parallax>
                  </div>
                </motion.div>
              </motion.div>

              <div className="mt-6">
                <h3 className="font-serif text-heading font-bold text-ink-900">
                  <SplitText text={member.name} staggerDelay={0.12} />
                </h3>
                <Reveal delay={0.15}>
                  <p className="mt-1 font-mono text-xs tracking-[0.18em] text-orange-600 uppercase">
                    {member.role}
                  </p>
                  <p className="mt-4 max-w-md leading-relaxed text-ink-600">
                    {member.bio}
                  </p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
