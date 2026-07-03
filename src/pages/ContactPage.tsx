import SplitText from "../components/ui/SplitText";
import Reveal from "../components/ui/Reveal";
import BookingEmbed from "../components/sections/BookingEmbed";
import ContactForm from "../components/sections/ContactForm";

const INFO = [
  { label: "Email", value: "hello@vaelro.co", href: "mailto:hello@vaelro.co" },
  { label: "Location", value: "Waupaca, WI" },
  {
    label: "Instagram",
    value: "@vaelro.co",
    href: "https://www.instagram.com/vaelro.co",
  },
  { label: "Response time", value: "We typically respond within 24 hours" },
];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-cream-100 pt-32 pb-10 md:pt-40 md:pb-14">
        <div className="container-site text-center">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
            Contact
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-display font-bold text-ink-900">
            <SplitText text="Let's talk about your business" />
          </h1>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-600">
              Book a free 30-minute consultation. No pitch — just a
              conversation about where we can help.
            </p>
          </Reveal>
        </div>
      </section>

      <BookingEmbed />
      <ContactForm />

      {/* Contact info */}
      <section className="bg-peach-50 py-12 md:py-20" aria-label="Contact info">
        <div className="container-site">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08}>
                <div>
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="nav-link mt-2 inline-flex min-h-11 items-center font-semibold text-ink-900 hover:text-orange-600"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 flex min-h-11 items-center font-semibold text-ink-900">
                      {item.value}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
