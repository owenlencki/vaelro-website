import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { business } from "../../data/business";

interface ServiceAreaProps {
  title: string;
  body: string;
}

/** Where we work, with the towns from src/data/business.ts as chips. */
export default function ServiceArea({ title, body }: ServiceAreaProps) {
  return (
    <section className="bg-cream-100 py-12 md:py-24" aria-label="Service area">
      <div className="container-site">
        <div className="rounded-3xl border border-cream-300 bg-peach-50 px-6 py-12 md:px-12 md:py-16">
          <SectionHeading eyebrow="Service Area" title={title} />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-lead text-ink-600">{body}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Towns we serve">
              {business.serviceTowns.map((town) => (
                <li
                  key={town}
                  className="rounded-full border border-cream-300 bg-cream-50 px-4 py-2 font-semibold text-ink-900"
                >
                  {town}
                </li>
              ))}
              <li className="px-2 py-2 text-ink-600">
                and surrounding communities
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
