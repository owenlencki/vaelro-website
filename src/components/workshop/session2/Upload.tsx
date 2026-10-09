import SplitText from "../../ui/SplitText";
import { session2 } from "../../../data/session2";
import { PACKET_UPLOAD_URL } from "../../../data/workshop";
import { trackEvent } from "../../../lib/analytics";

/**
 * The reason the page exists, so it comes first, on the header's own
 * background, and nothing in it waits on a scroll reveal: the steps and then
 * the button, all in the first screen on a phone. The button opens the upload
 * form, which is a separate site.
 */
export default function Upload() {
  const { upload } = session2;

  // The fallback sentence lives whole in the data file; the address inside it
  // becomes the mailto link. If the two ever stop matching, it stays a
  // sentence.
  const [before, ...rest] = upload.fallbackLine.split(upload.fallbackEmail);
  const linked = rest.length > 0;

  return (
    <section
      id="upload"
      className="bg-cream-100 pt-4 pb-14 md:pt-6 md:pb-24"
      aria-labelledby="upload-heading"
    >
      <div className="container-site">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:mb-4 md:text-sm">
              {upload.eyebrow}
            </p>
            <h2
              id="upload-heading"
              className="font-serif text-title font-bold text-ink-900"
            >
              <SplitText text={upload.heading} />
            </h2>

            {/* A real ordered list, so the numbers are read out; the chips
                are the same numbers for the eye. */}
            <ol className="mt-5 space-y-2.5 md:mt-8 md:space-y-3">
              {upload.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-xs text-cream-100"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-[3px] leading-snug text-ink-900">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* On a phone this just follows the steps. On a laptop it becomes a
              card beside them, so the button is in the first screen there
              too instead of under four steps and a display-size title. */}
          <div className="mt-6 max-w-xl md:mt-8 lg:mt-0 lg:rounded-2xl lg:bg-cream-50 lg:p-8 lg:shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]">
            {/* Dark text on the orange, like the /workshop card's button, so
                the label clears 4.5:1. */}
            <a
              href={PACKET_UPLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("packet_upload_click", {
                  location: "session2_page",
                })
              }
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-orange-500 px-10 py-3 text-center text-lg leading-tight font-bold text-ink-950 shadow-[0_10px_40px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-400 sm:inline-flex sm:w-auto lg:flex lg:w-full"
            >
              {upload.buttonLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>

            <p className="mt-5 leading-relaxed text-ink-900">
              {upload.lateLine}
            </p>
            <p className="mt-2 leading-relaxed text-ink-600">
              {linked ? (
                <>
                  {before}
                  <a
                    href={`mailto:${upload.fallbackEmail}?subject=${encodeURIComponent(upload.fallbackSubject)}`}
                    className="font-semibold text-orange-700 underline decoration-orange-500/50 underline-offset-4 transition-colors duration-200 hover:text-orange-800 hover:decoration-orange-600"
                  >
                    {upload.fallbackEmail}
                  </a>
                  {rest.join(upload.fallbackEmail)}
                </>
              ) : (
                upload.fallbackLine
              )}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              {upload.privacy}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
