import Reveal from "../components/ui/Reveal";

export default function PrivacyPage() {
  return (
    <section className="bg-cream-100 pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          Privacy
        </p>
        <h1 className="max-w-3xl font-serif text-title font-bold text-ink-900">
          Privacy Policy
        </h1>
        <Reveal delay={0.2}>
          <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-ink-600">
            <p>
              Vaelro LLC ("we", "us") operates vaelro.co. We collect your name
              and email when you submit our contact form. We use this
              information only to respond to your inquiry.
            </p>
            <p>
              We use Google Analytics to understand how visitors use our site.
              We do not sell, rent, or share your personal information with
              third parties.
            </p>
            <p>
              For questions, contact{" "}
              <a
                href="mailto:hello@vaelro.co"
                className="nav-link font-semibold text-ink-900 hover:text-orange-600"
              >
                hello@vaelro.co
              </a>
              .
            </p>
            <p className="text-sm text-muted">Last updated July 2026.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
