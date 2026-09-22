import type { ReactNode } from "react";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

interface TextSectionProps {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  surface?: "cream" | "peach";
  /** Anything that belongs under the text, like a grid of cards. */
  children?: ReactNode;
}

/** Heading on the left, a few paragraphs on the right; stacked on phones. */
export default function TextSection({
  eyebrow,
  title,
  paragraphs,
  surface = "cream",
  children,
}: TextSectionProps) {
  return (
    <section
      className={`py-12 md:py-24 ${surface === "peach" ? "bg-peach-50" : "bg-cream-100"}`}
      aria-label={eyebrow}
    >
      <div className="container-site">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <Reveal delay={0.15} className="space-y-5 lg:pt-11">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lead text-ink-600">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
        {children}
      </div>
    </section>
  );
}
