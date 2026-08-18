import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";
import { resolveFaqAnswer } from "../../lib/workshop";
import VenueLink from "./VenueLink";

/** Plain stacked question and answer on hairlines. No accordion by design. */
export default function Faq() {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="Straight answers">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {workshop.faqSection.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={workshop.faqSection.heading} />
        </h2>

        <Reveal delay={0.15}>
          <dl className="mt-12 grid gap-x-12 md:mt-16 md:grid-cols-2">
            {workshop.faqs.map((faq) => (
              <div
                key={faq.id}
                className="border-t border-cream-300 py-6 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
              >
                <dt className="font-serif text-lg font-bold text-ink-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 leading-relaxed text-ink-600">
                  <VenueLink
                    text={resolveFaqAnswer(faq, workshop.venue)}
                    className="nav-link font-semibold text-orange-600 hover:text-orange-700"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
