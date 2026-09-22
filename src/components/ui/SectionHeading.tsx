import SplitText from "./SplitText";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  tone?: "light" | "dark";
  className?: string;
}

/** The mono eyebrow and serif h2 every section opens with. */
export default function SectionHeading({
  eyebrow,
  title,
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <p
        className={`mb-4 font-mono text-xs tracking-[0.2em] uppercase md:text-sm ${
          dark ? "text-orange-400" : "text-orange-600"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`max-w-2xl font-serif text-title font-bold ${
          dark ? "text-cream-100" : "text-ink-900"
        }`}
      >
        <SplitText text={title} />
      </h2>
    </div>
  );
}
