import { useEffect, useRef, useState, type FormEvent } from "react";
import SplitText from "../../ui/SplitText";
import { session1 } from "../../../data/session1";
import { postToAppsScript } from "../../../lib/appsScript";
import { trackEvent } from "../../../lib/analytics";

const RATINGS = [1, 2, 3, 4, 5];

/** Field borders hold 3:1 against the field, so the boxes read as boxes. */
const fieldClasses =
  "w-full rounded-xl border border-cream-600 bg-cream-50 px-4 py-3 text-base text-ink-900 placeholder:text-muted focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40";
const labelClasses = "mb-2 block font-semibold text-ink-900";
const errorClasses = "mt-2 text-sm font-semibold text-orange-800";

type Phase = "editing" | "sending" | "sent" | "failed";

interface Answers {
  rating: number;
  octoberWish: string;
  referral: string;
  name: string;
  business: string;
}

/**
 * The answers as one block of text in the lead form's `notes` field. Only an
 * Apps Script deployment older than the feedback branch reads it: that version
 * files the response as a lead instead of losing it. The current one ignores
 * `need` and `notes` on feedback.
 */
function asLeadNotes(answers: Answers): string {
  const { feedback } = session1;
  return [
    `${feedback.rating.legend} ${answers.rating} out of 5`,
    `${feedback.octoberWish} ${answers.octoberWish || "(no answer)"}`,
    `${feedback.referral.label} ${answers.referral || "(no answer)"}`,
  ].join("\n");
}

/**
 * One short form, posted to the same Apps Script as the Contact page, which
 * files it in its own "Session 1 Feedback" tab. Only the rating is required;
 * name and business are optional, and it asks for no email.
 */
export default function FeedbackForm() {
  const { feedback } = session1;

  const [rating, setRating] = useState<number | null>(null);
  const [octoberWish, setOctoberWish] = useState("");
  const [referral, setReferral] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ rating?: string }>({});
  const [phase, setPhase] = useState<Phase>("editing");

  const firstRatingRef = useRef<HTMLInputElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);

  // The form is replaced by the thank-you line; move focus there so screen
  // readers announce it and the page scrolls it into view.
  useEffect(() => {
    if (phase === "sent") thanksRef.current?.focus();
  }, [phase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "sending") return;

    if (rating === null) {
      setErrors({ rating: feedback.rating.error });
      firstRatingRef.current?.focus();
      return;
    }
    setErrors({});

    setPhase("sending");
    const answers: Answers = {
      rating,
      octoberWish: octoberWish.trim(),
      referral: referral.trim(),
      name: name.trim(),
      business: business.trim(),
    };
    const ok = await postToAppsScript({
      form: "session1-feedback",
      ...answers,
      // The deployed Code.gs still has Email and "Send the free tools"
      // columns. The form no longer asks for either, so they go blank and the
      // row reads empty and "No"; the script accepts that without a redeploy.
      email: "",
      wantsTools: false,
      source: window.location.pathname,
      website_url: honeypot,
      need: "Session 1 feedback",
      notes: asLeadNotes(answers),
    });

    if (ok) {
      trackEvent("session1_feedback_submit", { rating });
      setPhase("sent");
    } else {
      trackEvent("session1_feedback_error");
      setPhase("failed");
    }
  }

  return (
    <section
      id="feedback"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="feedback-heading"
    >
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
            {feedback.eyebrow}
          </p>
          <h2
            id="feedback-heading"
            className="font-serif text-title font-bold text-ink-900"
          >
            <SplitText text={feedback.heading} />
          </h2>

          {phase === "sent" ? (
            <div className="mt-8 rounded-2xl bg-cream-50 px-6 py-10 shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)] md:px-10">
              <h3
                ref={thanksRef}
                tabIndex={-1}
                className="font-serif text-heading font-bold text-ink-900 focus-visible:outline-none"
              >
                {feedback.success}
              </h3>
            </div>
          ) : (
            <>
              <p className="mt-3 text-ink-600">{feedback.intro}</p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-8 flex flex-col gap-7 md:mt-10"
              >
                {/* The one required question */}
                <fieldset
                  aria-describedby={errors.rating ? "s1-rating-error" : undefined}
                >
                  <legend className="font-serif text-heading font-bold text-ink-900">
                    {feedback.rating.legend}
                  </legend>
                  <div className="mt-4 grid max-w-md grid-cols-5 gap-2 sm:gap-3">
                    {RATINGS.map((n, i) => (
                      <label key={n} className="block cursor-pointer">
                        <input
                          ref={i === 0 ? firstRatingRef : undefined}
                          type="radio"
                          name="rating"
                          value={n}
                          checked={rating === n}
                          onChange={() => {
                            setRating(n);
                            setErrors((prev) => ({ ...prev, rating: undefined }));
                          }}
                          aria-invalid={errors.rating ? true : undefined}
                          className="peer sr-only"
                        />
                        <span className="flex h-14 items-center justify-center rounded-xl border border-cream-600 bg-cream-50 font-serif text-xl font-bold text-ink-900 transition-colors duration-150 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-ink-950 peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream-100 hover:border-orange-500">
                          {n}
                          {n === 1 && <span className="sr-only">, {feedback.rating.low}</span>}
                          {n === 5 && <span className="sr-only">, {feedback.rating.high}</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div
                    className="mt-2 flex max-w-md justify-between text-sm text-ink-600"
                    aria-hidden="true"
                  >
                    <span>{feedback.rating.low}</span>
                    <span>{feedback.rating.high}</span>
                  </div>
                  {errors.rating && (
                    <p id="s1-rating-error" role="alert" className={errorClasses}>
                      {errors.rating}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label htmlFor="s1-october" className={labelClasses}>
                    {feedback.octoberWish}
                  </label>
                  <textarea
                    id="s1-october"
                    name="octoberWish"
                    rows={3}
                    value={octoberWish}
                    onChange={(e) => setOctoberWish(e.target.value)}
                    className={fieldClasses}
                  />
                </div>

                <div>
                  <label htmlFor="s1-referral" className={labelClasses}>
                    {feedback.referral.label}
                  </label>
                  <input
                    id="s1-referral"
                    name="referral"
                    type="text"
                    autoComplete="off"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    aria-describedby="s1-referral-helper"
                    className={fieldClasses}
                  />
                  <p id="s1-referral-helper" className="mt-2 text-sm text-ink-600">
                    {feedback.referral.helper}
                  </p>
                </div>

                <div className="grid gap-7 sm:grid-cols-2 sm:gap-5">
                  <div>
                    <label htmlFor="s1-name" className={labelClasses}>
                      {feedback.name}
                    </label>
                    <input
                      id="s1-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor="s1-business" className={labelClasses}>
                      {feedback.business}
                    </label>
                    <input
                      id="s1-business"
                      name="business"
                      type="text"
                      autoComplete="organization"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      className={fieldClasses}
                    />
                  </div>
                </div>

                {/* Honeypot: visually hidden, must stay empty. */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <label htmlFor="s1-website_url">Leave this field empty</label>
                  <input
                    id="s1-website_url"
                    name="website_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={phase === "sending"}
                    className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {phase === "sending" ? feedback.sendingLabel : feedback.submitLabel}
                  </button>
                  {phase === "failed" && (
                    <p role="alert" className={errorClasses}>
                      {feedback.failure}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-ink-600">{feedback.privacy}</p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
