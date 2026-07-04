import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import { BOOKING_URL } from "../../lib/booking";
import { trackEvent } from "../../lib/analytics";

/** Primary conversion moment: Google Calendar appointment scheduling. */
export default function BookingEmbed() {
  return (
    <section className="bg-cream-100 pb-8" aria-label="Book a consultation">
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-3xl border border-cream-300 bg-peach-50 px-6 py-12 text-center md:px-12 md:py-16">
            <h2 className="font-serif text-heading font-bold text-ink-900">
              Grab a time on our calendar
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-600">
              Free, 30 minutes, no obligation. We'll talk about your business
              and where we can actually help.
            </p>

            <div className="mt-8 flex justify-center">
              <MagneticButton>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("booking_click", { location: "contact_page" })
                  }
                  className="inline-flex min-h-14 items-center rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600"
                >
                  Book a Free Consultation
                </a>
              </MagneticButton>
            </div>

            <p className="mt-6 text-sm text-muted">
              Pick a time that works for you. You'll get a Google Meet link
              automatically.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
