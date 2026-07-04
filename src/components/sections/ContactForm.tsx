import { useState, type FormEvent } from "react";
import Reveal from "../ui/Reveal";
import { trackEvent } from "../../lib/analytics";

/**
 * Backup contact form, wired to Netlify Forms. Submissions land in the
 * Netlify dashboard (Forms tab). A hidden mirror of this form lives in
 * index.html so Netlify's build bot can register it.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    const formData = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    formData.forEach((value, key) => body.append(key, value.toString()));

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
      trackEvent("form_submission", { form: "contact" });
      setSent(true);
    } catch {
      setError(true);
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-muted focus-visible:border-orange-500";

  return (
    <section className="bg-cream-100 py-12 md:py-20" aria-label="Contact form">
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-heading font-bold text-ink-900">
              Or send us a message
            </h2>
            <p className="mt-2 text-ink-600">
              Prefer to book directly? Use the button above. Otherwise, drop us
              a note and we'll get back to you.
            </p>

            {sent ? (
              <div
                className="mt-8 rounded-2xl border border-orange-300 bg-orange-50 p-8 text-center"
                role="status"
              >
                <p className="font-serif text-xl font-bold text-ink-900">
                  Message sent. We typically respond within 24 hours.
                </p>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-5"
              >
                <input type="hidden" name="form-name" value="contact" />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-sm font-semibold text-ink-900"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-sm font-semibold text-ink-900"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@business.com"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-sm font-semibold text-ink-900"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us a little about your business and what you need."
                    className={inputClasses}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center rounded-full bg-ink-900 px-8 py-3 font-bold text-cream-100 transition-colors duration-200 hover:bg-ink-800"
                  >
                    Send Message
                  </button>
                  {error && (
                    <p className="mt-3 text-sm text-ink-600" role="alert">
                      Something went wrong sending your message. Please email
                      us directly at hello@vaelro.co.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
