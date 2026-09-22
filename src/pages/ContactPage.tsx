import SplitText from "../components/ui/SplitText";
import Reveal from "../components/ui/Reveal";
import OrDivider from "../components/ui/OrDivider";
import BusinessNap from "../components/ui/BusinessNap";
import BookingEmbed from "../components/sections/BookingEmbed";
import ContactFlow from "../components/sections/ContactFlow";
import FaqSection from "../components/sections/FaqSection";
import { business } from "../data/business";
import { contactFaqs } from "../data/faqs";

const infoLabel =
  "font-mono text-[0.65rem] tracking-[0.18em] text-muted uppercase";

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
            <SplitText text="Let's Talk About Your Website" />
          </h1>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-6 max-w-xl text-lead text-ink-600">
              Book a free 30-minute consultation about your website or
              automation project. No pitch, just a conversation about where we
              can help.
            </p>
          </Reveal>
        </div>
      </section>

      <BookingEmbed />

      {/* Divider between the two ways in: book now, or tell us first */}
      <div className="bg-cream-100 py-10 md:py-14">
        <div className="container-site">
          <OrDivider className="mx-auto max-w-xl" />
        </div>
      </div>

      <ContactFlow />

      <FaqSection
        eyebrow="Straight Answers"
        title="Questions we hear a lot"
        faqs={contactFaqs}
      />

      {/* Contact info */}
      <section className="bg-peach-50 py-12 md:py-20" aria-label="Contact info">
        <div className="container-site">
          <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3 sm:gap-8">
            <Reveal>
              <p className={infoLabel}>Get in touch</p>
              <BusinessNap className="mt-3" />
            </Reveal>
            <Reveal delay={0.08}>
              <p className={infoLabel}>Follow</p>
              <ul className="mt-3">
                {business.social.map((profile) => (
                  <li key={profile.url}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link inline-flex min-h-11 items-center font-semibold text-ink-900 hover:text-orange-600 md:min-h-9"
                    >
                      {profile.handle ?? profile.label}
                      {profile.handle && (
                        <span className="sr-only"> on {profile.label}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.16}>
              <p className={infoLabel}>Response time</p>
              <p className="mt-3 font-semibold text-ink-900">
                We typically respond within 24 hours
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
