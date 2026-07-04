const ITEMS = [
  "More Time Back",
  "Websites That Convert",
  "Workflow Automation",
  "Local Service",
  "Modern Tech",
  "Clean Systems",
];

/** Dark horizontal ticker between the hero and services. Pure CSS animation. */
export default function Marquee() {
  return (
    <section
      className="relative border-y border-cream-100/10 bg-ink-900 py-8 md:py-10"
      aria-label="What Vaelro delivers"
    >
      <div className="flex overflow-hidden">
        <div className="marquee-track-left flex shrink-0 items-center whitespace-nowrap">
          {/* Content doubled for a seamless loop */}
          {[0, 1].map((copy) => (
            <span
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center"
            >
              {ITEMS.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="px-6 font-serif text-2xl font-bold text-cream-100 md:px-8 md:text-3xl">
                    {item}
                  </span>
                  <span
                    className="text-xl text-orange-500 md:text-2xl"
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
