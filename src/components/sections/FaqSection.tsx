import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import type { FaqItem } from "../../data/faqs";

interface FaqSectionProps {
  eyebrow: string;
  title: string;
  faqs: FaqItem[];
}

/** Plain stacked questions and answers on hairlines, like the workshop FAQ. */
export default function FaqSection({ eyebrow, title, faqs }: FaqSectionProps) {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label={eyebrow}>
      <div className="container-site">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <Reveal delay={0.15}>
          <dl className="mt-12 grid gap-x-12 md:mt-16 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-t border-cream-300 py-6 first:border-t-0 md:[&:nth-child(2)]:border-t-0"
              >
                <dt className="font-serif text-lg font-bold text-ink-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 leading-relaxed text-ink-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
