import { motion } from "framer-motion";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { fadeUp, staggerContainer } from "../../lib/animations";

interface Service {
  number: string;
  label: string;
  title: string;
  body: string;
  techLabel: string;
  tech: string[];
  dark?: boolean;
}

const SERVICES: Service[] = [
  {
    number: "01",
    label: "Custom Websites",
    title: "Websites That Actually Work",
    body: "Not templates. Not WordPress. Custom-built on modern infrastructure that loads in under 2 seconds, never gets hacked, and turns visitors into customers. You own everything — code, domain, hosting, data.",
    techLabel: "Tech",
    tech: ["React", "Tailwind", "Headless CMS", "Cloudflare"],
  },
  {
    number: "02",
    label: "AI Automation",
    title: "Stop Doing the Same Thing Twice",
    body: "We build workflows that handle follow-ups, scheduling, document processing, data entry, and the repetitive work your team wastes hours on every week. Custom-built, not off-the-shelf.",
    techLabel: "Tech",
    tech: ["n8n", "Custom Workflows", "CRM Integration", "Anthropic AI"],
    dark: true,
  },
  {
    number: "03",
    label: "AI Strategy & Consulting",
    title: "Know Exactly Where AI Fits",
    body: "Not sure where to start? We audit your operations, map where AI saves real time and money, and build a concrete roadmap. No buzzwords. No hype. Just a plan that pays for itself.",
    techLabel: "Deliverables",
    tech: ["AI Audit", "Implementation Roadmap", "ROI Analysis"],
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 bg-cream-100 py-12 md:py-24">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          What We Build
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text="Three ways we give you your time back" />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-xl text-lead text-ink-600">
            Every business is different. Every engagement starts with a
            conversation, not a package.
          </p>
        </Reveal>

        <motion.div
          className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8"
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {SERVICES.map((service) => (
            <motion.article
              key={service.number}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`group flex flex-col rounded-2xl border p-8 shadow-[0_2px_12px_rgba(26,26,26,0.04)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(26,26,26,0.1)] md:p-9 ${
                service.dark
                  ? "border-ink-700 bg-ink-900 text-cream-100 md:-translate-y-0 md:translate-y-6"
                  : "border-cream-300 bg-cream-50 text-ink-900"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className={`font-serif text-4xl font-bold ${
                    service.dark ? "text-orange-400" : "text-orange-500"
                  }`}
                >
                  {service.number}
                </span>
                <span
                  className={`font-mono text-[0.7rem] tracking-[0.15em] uppercase ${
                    service.dark ? "text-cream-100/60" : "text-muted"
                  }`}
                >
                  {service.label}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-heading font-bold">
                {service.title}
              </h3>

              <p
                className={`mt-4 grow leading-relaxed ${
                  service.dark ? "text-cream-100/80" : "text-ink-600"
                }`}
              >
                {service.body}
              </p>

              <div
                className={`mt-8 border-t pt-5 ${
                  service.dark ? "border-cream-100/15" : "border-cream-300"
                }`}
              >
                <span
                  className={`font-mono text-[0.65rem] tracking-[0.15em] uppercase ${
                    service.dark ? "text-cream-100/50" : "text-muted"
                  }`}
                >
                  {service.techLabel}
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-3 py-1 font-mono text-xs ${
                        service.dark
                          ? "border-cream-100/20 text-cream-100/80"
                          : "border-cream-300 bg-cream-100 text-ink-600"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
