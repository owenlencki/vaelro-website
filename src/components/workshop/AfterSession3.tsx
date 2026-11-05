import { workshop } from "../../data/workshop";

/**
 * A short text block: everything from the series stays on this page, and the
 * one way to ask for help. Plain text on purpose, so the email address is
 * there to read and copy, with no button and no link. No scroll reveal, so it
 * reads the same with JavaScript off.
 */
export default function AfterSession3() {
  const { afterSession3 } = workshop;

  return (
    <section
      className="bg-peach-50 py-12 md:py-16"
      aria-labelledby="after-session-3-heading"
    >
      <div className="container-site">
        <h2
          id="after-session-3-heading"
          className="font-serif text-heading font-bold text-ink-900"
        >
          {afterSession3.heading}
        </h2>
        <p className="mt-4 max-w-3xl text-lead text-ink-600">{afterSession3.body}</p>
      </div>
    </section>
  );
}
