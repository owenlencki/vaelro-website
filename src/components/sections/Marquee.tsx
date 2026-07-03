const ITEMS = [
  "Websites That Convert",
  "AI Automation",
  "Clean Systems",
  "More Time Back",
  "Local Service",
  "Modern Tech",
  "You Own Everything",
  "Built in Wisconsin",
];

function Row({
  direction,
  className,
}: {
  direction: "left" | "right";
  className: string;
}) {
  const track =
    direction === "left" ? "marquee-track-left" : "marquee-track-right";
  return (
    <div className="flex overflow-hidden">
      <div className={`flex shrink-0 items-center whitespace-nowrap ${track}`}>
        {/* Content doubled for a seamless loop */}
        {[0, 1].map((copy) => (
          <span key={copy} aria-hidden={copy === 1} className="flex items-center">
            {ITEMS.map((item) => (
              <span key={item} className="flex items-center">
                <span className={`px-6 md:px-8 ${className}`}>{item}</span>
                <span
                  className="text-orange-500 text-xl md:text-2xl"
                  aria-hidden="true"
                >
                  ·
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Dark horizontal ticker between the hero and services. Pure CSS animation. */
export default function Marquee() {
  return (
    <section
      className="relative border-y border-cream-100/10 bg-ink-900 py-8 md:py-10"
      aria-label="What Vaelro delivers"
    >
      <div className="flex flex-col gap-5">
        <Row
          direction="left"
          className="font-serif text-2xl font-bold text-cream-100 md:text-3xl"
        />
        <Row
          direction="right"
          className="font-serif text-2xl font-bold text-cream-100/25 md:text-3xl"
        />
      </div>
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink-900 to-transparent md:w-32"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink-900 to-transparent md:w-32"
        aria-hidden="true"
      />
    </section>
  );
}
