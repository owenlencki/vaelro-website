import { useState, type FormEvent } from "react";
import Reveal from "../ui/Reveal";

/**
 * Backup contact form. Currently logs to the console.
 * Owen: wire the submit handler to the n8n webhook when it's ready.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    // TODO(owen): POST this payload to the n8n webhook
    console.log("Contact form submission:", payload);
    setSent(true);
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
                  Message sent. Thanks!
                </p>
                <p className="mt-2 text-ink-600">
                  We typically respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
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
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
