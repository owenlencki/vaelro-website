import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/useReducedMotion";
import { easeStandard } from "../../lib/animations";
import { trackEvent } from "../../lib/analytics";

/* ---------------------------------------------------------------------------
   Config — swap these for the real values at wiring time.
   Local dev uses Cloudflare's public Turnstile TEST site key (always passes).
--------------------------------------------------------------------------- */
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxM3e_0MyXn4R88l5CsrGjoYNcDReD0Q2wFSjbp3OVcANuTnC7WJi98bp-YdkFFGZOWlg/exec";
const TURNSTILE_SITE_KEY = "0x4AAAAAAD4pofYBKt9UoZuo";

const BOOKING_URL = "https://calendar.app.google/Ay64rzC4bx9jqRNG9";

/* ---------------------------------------------------------------------------
   Question data. All copy is final and verbatim from spec.
--------------------------------------------------------------------------- */
type QId =
  | "need"
  | "websiteSituation"
  | "busywork"
  | "headache"
  | "urgency"
  | "budget";
type OptId = "A" | "B" | "C" | "D";
type StepId = QId | "contact";

interface Option {
  id: OptId;
  label: string;
  sub?: string;
}
interface Question {
  id: QId;
  question: string;
  subtext?: string;
  options: Option[];
}

const QUESTIONS: Record<QId, Question> = {
  need: {
    id: "need",
    question: "What brings you in?",
    options: [
      {
        id: "A",
        label: "We need a website",
        sub: "A new one, or a fix for one that isn't working",
      },
      {
        id: "B",
        label: "Too much busywork",
        sub: "Paperwork, follow-ups, and repeat tasks are eating the day",
      },
      { id: "C", label: "Both" },
      {
        id: "D",
        label: "Not sure yet",
        sub: "Something needs to change. I want a straight answer about what.",
      },
    ],
  },
  websiteSituation: {
    id: "websiteSituation",
    question: "What's the website situation today?",
    options: [
      {
        id: "A",
        label: "We don't have one",
        sub: "People find us by word of mouth, if they find us",
      },
      {
        id: "B",
        label: "We have one, but it's outdated",
        sub: "It doesn't look like the business we actually are",
      },
      {
        id: "C",
        label: "We can't update it ourselves",
        sub: "Every little change means calling someone and waiting",
      },
      {
        id: "D",
        label: "It looks fine but does nothing",
        sub: "It's not bringing in calls or customers",
      },
    ],
  },
  busywork: {
    id: "busywork",
    question: "What eats the most time in a normal week?",
    options: [
      { id: "A", label: "Answering the same questions over and over" },
      { id: "B", label: "Quotes, invoices, and paperwork" },
      { id: "C", label: "Following up with leads and customers" },
      { id: "D", label: "Honestly, all of it" },
    ],
  },
  headache: {
    id: "headache",
    question: "What's the biggest headache in the business right now?",
    options: [
      { id: "A", label: "Not enough new customers finding us" },
      { id: "B", label: "Too much time spent on manual work" },
      { id: "C", label: "We look smaller online than we really are" },
      { id: "D", label: "Hard to say. That's why I'm filling this out." },
    ],
  },
  urgency: {
    id: "urgency",
    question: "How soon do you want this handled?",
    options: [
      {
        id: "A",
        label: "Yesterday",
        sub: "It's costing us money right now",
      },
      { id: "B", label: "In the next month or two" },
      { id: "C", label: "Sometime this year" },
      { id: "D", label: "Just looking for now" },
    ],
  },
  budget: {
    id: "budget",
    question: "What kind of budget feels comfortable?",
    subtext:
      "Not a quote, and nothing is locked in. It just tells us which kind of solution to bring to the conversation.",
    options: [
      { id: "A", label: "$5,000 or more" },
      { id: "B", label: "$1,000 to $5,000" },
      { id: "C", label: "Under $1,000" },
      { id: "D", label: "I'd rather talk it through first" },
    ],
  },
};

type Answers = Partial<Record<QId, OptId>>;

/** Build the ordered question ids for the current branch (need drives it). */
function buildFlow(need: OptId | undefined): QId[] {
  if (!need) return ["need"];
  const middle: QId[] =
    need === "A"
      ? ["websiteSituation"]
      : need === "B"
        ? ["busywork"]
        : need === "C"
          ? ["websiteSituation", "busywork"]
          : ["headache"];
  return ["need", ...middle, "urgency", "budget"];
}

/* ---------------------------------------------------------------------------
   Turnstile typing
--------------------------------------------------------------------------- */
declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const TURNSTILE_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.turnstile) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = TURNSTILE_SRC;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", () => resolve(), { once: true });
    document.head.appendChild(s);
  });
}

/* ---------------------------------------------------------------------------
   Styling helpers
--------------------------------------------------------------------------- */
const optionBase =
  "block w-full rounded-2xl border p-4 text-left transition-colors duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 md:p-5";
const optionIdle =
  "border-cream-300 bg-cream-50 hover:border-orange-300 hover:bg-peach-50";
const optionSelected = "border-orange-500 bg-orange-50";

const fieldClasses =
  "w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-ink-900 placeholder:text-muted focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40";

const primaryBtn =
  "inline-flex min-h-14 items-center justify-center rounded-full bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-[0_10px_40px_rgba(212,116,59,0.35)] transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60";

/* ---------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------- */
type Phase = "entry" | "flow" | "confirmation" | "failure";

export default function ContactFlow() {
  const reducedMotion = usePrefersReducedMotion();

  const [phase, setPhase] = useState<Phase>("entry");
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Contact fields
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<"idle" | "sending">("idle");

  // Turnstile
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileToken = useRef("");
  const turnstileRendered = useRef(false);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const steps: StepId[] = useMemo(() => {
    return [...buildFlow(answers.need), "contact"];
  }, [answers.need]);

  const total = steps.length;
  const currentStep = steps[stepIndex];
  const isQuestion = currentStep !== "contact";
  const activeQuestion = isQuestion
    ? QUESTIONS[currentStep as QId]
    : undefined;

  /* Focus the step heading whenever the visible step changes. */
  useEffect(() => {
    if (phase === "flow" || phase === "confirmation" || phase === "failure") {
      // Delay so the entering element is mounted.
      const t = window.setTimeout(() => headingRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [phase, stepIndex]);

  /* -------------------- navigation -------------------- */
  const goForward = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const goBack = useCallback(() => {
    setDirection(-1);
    if (stepIndex === 0) {
      setPhase("entry");
    } else {
      setStepIndex((i) => Math.max(i - 1, 0));
    }
  }, [stepIndex]);

  const start = () => {
    trackEvent("form_start");
    setDirection(1);
    setStepIndex(0);
    setPhase("flow");
  };

  const selectOption = (qid: QId, optId: OptId, stepNumber: number) => {
    setAnswers((prev) => {
      // Changing the top-level need invalidates the branch-specific answers.
      if (qid === "need" && prev.need !== optId) {
        return { need: optId };
      }
      return { ...prev, [qid]: optId };
    });
    trackEvent("form_step_complete", {
      step: stepNumber,
      question_id: qid,
      answer_id: optId,
    });
    // Auto-advance after a short beat so the selected state is visible.
    window.setTimeout(goForward, 300);
  };

  /* -------------------- Turnstile lifecycle -------------------- */
  useEffect(() => {
    if (currentStep !== "contact" || phase !== "flow") return;
    let cancelled = false;
    loadTurnstileScript().then(() => {
      if (cancelled || !turnstileRef.current || !window.turnstile) return;
      if (turnstileRendered.current) return;
      window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        callback: (token) => {
          turnstileToken.current = token;
        },
        "expired-callback": () => {
          turnstileToken.current = "";
        },
        "error-callback": () => {
          turnstileToken.current = "";
        },
      });
      turnstileRendered.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, [currentStep, phase]);

  /* -------------------- submit -------------------- */
  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = phone.replace(/\D/g, "");

    if (!name.trim()) errs.name = "We need this one to reach you.";
    if (!business.trim()) errs.business = "We need this one to reach you.";
    if (!email.trim()) errs.email = "We need this one to reach you.";
    else if (!emailRe.test(email.trim()))
      errs.email = "That email doesn't look right. Mind double-checking?";
    if (!phone.trim()) errs.phone = "We need this one to reach you.";
    else if (phoneDigits.length < 10)
      errs.phone = "That number doesn't look right. Mind double-checking?";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const labelFor = (qid: QId): string => {
    const a = answers[qid];
    if (!a) return "";
    return QUESTIONS[qid].options.find((o) => o.id === a)?.label ?? "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState === "sending") return;
    if (!validate()) return;

    setSubmitState("sending");

    const payload = {
      name: name.trim(),
      business: business.trim(),
      email: email.trim(),
      phone: phone.trim(),
      need: labelFor("need"),
      websiteSituation: labelFor("websiteSituation"),
      busywork: labelFor("busywork"),
      headache: labelFor("headache"),
      urgency: labelFor("urgency"),
      budget: labelFor("budget"),
      notes: notes.trim(),
      source: window.location.pathname,
      website_url: honeypot,
      token: turnstileToken.current,
    };

    try {
      // Plain-text body + no JSON content-type header avoids a CORS preflight.
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        redirect: "follow",
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) {
        trackEvent("form_submit");
        setDirection(1);
        setPhase("confirmation");
      } else {
        throw new Error("Server rejected the submission");
      }
    } catch {
      trackEvent("form_error");
      setDirection(1);
      setPhase("failure");
    } finally {
      setSubmitState("idle");
    }
  };

  /* -------------------- motion props -------------------- */
  const dist = reducedMotion ? 0 : 40;
  const stepTransition = {
    duration: reducedMotion ? 0.15 : 0.25,
    ease: easeStandard,
  };

  /* -------------------- confirmation summary -------------------- */
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const summary = useMemo(() => {
    const need = answers.need;
    if (!need) return "";
    const needPhrase: Record<OptId, string> = {
      A: "You're looking for a website",
      B: "You want the busywork off your plate",
      C: "You're looking at a website and getting busywork off your plate",
      D: "You want a straight read on what to fix first",
    };
    const urgencyPhrase: Record<OptId, string> = {
      A: "and you want it handled now",
      B: "and you'd like it handled in the next month or two",
      C: "sometime this year",
      D: "and you're exploring for now",
    };
    const middle: string[] = [];
    (["websiteSituation", "busywork", "headache"] as QId[]).forEach((qid) => {
      const l = labelFor(qid);
      if (l) middle.push(l.toLowerCase());
    });
    const situationClause = middle.length ? `, ${middle.join(" and ")}` : "";
    const urg = answers.urgency ? urgencyPhrase[answers.urgency] : "";
    return `${needPhrase[need]}${situationClause}, ${urg}.`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  /* -------------------- keyboard nav for radiogroup -------------------- */
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const handleRadioKeys = (
    e: KeyboardEvent<HTMLDivElement>,
    q: Question,
    stepNumber: number,
  ) => {
    const opts = q.options;
    const currentId = answers[q.id];
    const currentIdx = currentId
      ? opts.findIndex((o) => o.id === currentId)
      : -1;
    if (["ArrowDown", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const next = (currentIdx + 1 + opts.length) % opts.length;
      optionRefs.current[next]?.focus();
      setAnswers((prev) => ({ ...prev, [q.id]: opts[next].id }));
    } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      const prevIdx = (currentIdx - 1 + opts.length) % opts.length;
      optionRefs.current[prevIdx]?.focus();
      setAnswers((prev) => ({ ...prev, [q.id]: opts[prevIdx].id }));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentId) selectOption(q.id, currentId, stepNumber);
    }
  };

  /* ---------------------------------------------------------------------- */
  const headingId = "contactflow-heading";

  // One screen key per visible screen. Driving a single AnimatePresence child
  // by this key is the reliable pattern — multiple conditional children can
  // strand an exit under mode="wait" and never mount the next screen.
  const screenKey =
    phase === "entry"
      ? "entry"
      : phase === "confirmation"
        ? "confirmation"
        : phase === "failure"
          ? "failure"
          : currentStep;

  const liveMessage =
    phase === "flow" && activeQuestion
      ? activeQuestion.question
      : phase === "flow" && currentStep === "contact"
        ? "Last one. Where should we reach you?"
        : "";

  function renderScreen() {
    /* ---- ENTRY ---- */
    if (phase === "entry") {
      return (
        <div className="rounded-3xl border border-cream-300 bg-peach-50 px-6 py-12 text-center md:px-12 md:py-16">
          <p className="font-mono text-xs tracking-[0.2em] text-orange-600 uppercase">
            FREE CONSULTATION
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 font-serif text-heading font-bold text-ink-900 focus-visible:outline-none"
          >
            Tell us what you're up against.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-600">
            Takes about a minute. A real person reads every answer, and you'll
            hear back within one business day.
          </p>
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={start} className={primaryBtn}>
              Start
            </button>
          </div>
          <p className="mt-4 text-sm text-muted">
            No spam, no pressure, no obligation.
          </p>
        </div>
      );
    }

    /* ---- CONFIRMATION ---- */
    if (phase === "confirmation") {
      return (
        <div className="rounded-3xl border border-cream-300 bg-peach-50 px-6 py-12 md:px-12 md:py-16">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-title font-bold text-ink-900 focus-visible:outline-none"
          >
            Got it, {firstName}.
          </h2>
          <p className="mt-4 text-lead text-ink-700">{summary}</p>
          <p className="mt-6 text-ink-600">
            Here's what happens next. Owen reads your answers, takes a look at
            what you have now, and reaches out within one business day to set up
            a free 20 minute conversation. No pitch deck, no pressure. You'll
            leave that call knowing exactly what we'd recommend, whether you
            hire us or not.
          </p>
          <div className="mt-8">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryBtn}
            >
              Pick a time now
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">
            Or sit tight. Owen will reach out within one business day either
            way.
          </p>
          <p className="mt-6 text-sm">
            <a
              href="/"
              className="nav-link font-semibold text-ink-900 hover:text-orange-600"
            >
              Back to the site
            </a>
          </p>
        </div>
      );
    }

    /* ---- FAILURE ---- */
    if (phase === "failure") {
      return (
        <div className="rounded-3xl border border-cream-300 bg-peach-50 px-6 py-12 text-center md:px-12 md:py-16">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-heading font-bold text-ink-900 focus-visible:outline-none"
          >
            Something went wrong on our end, and it's not you.
          </h2>
          <p className="mt-4 text-ink-600">
            Email{" "}
            <a
              href="mailto:hello@vaelro.co"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              hello@vaelro.co
            </a>{" "}
            and we'll take it from there.
          </p>
        </div>
      );
    }

    /* ---- QUESTION STEP ---- */
    if (isQuestion && activeQuestion) {
      return (
        <StepChrome
          stepNumber={stepIndex + 1}
          total={total}
          onBack={goBack}
          showBack={true}
        >
          <fieldset className="border-0 p-0">
            <legend className="w-full p-0">
              <h2
                id={headingId}
                ref={headingRef}
                tabIndex={-1}
                className="font-serif text-heading font-bold text-ink-900 focus-visible:outline-none"
              >
                {activeQuestion.question}
              </h2>
              {activeQuestion.subtext && (
                <p className="mt-3 text-ink-600">{activeQuestion.subtext}</p>
              )}
            </legend>

            <div
              role="radiogroup"
              aria-labelledby={headingId}
              className="mt-6 flex flex-col gap-3"
              onKeyDown={(e) =>
                handleRadioKeys(e, activeQuestion, stepIndex + 1)
              }
            >
              {activeQuestion.options.map((opt, i) => {
                const selected = answers[activeQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={
                      selected || (!answers[activeQuestion.id] && i === 0)
                        ? 0
                        : -1
                    }
                    onClick={() =>
                      selectOption(activeQuestion.id, opt.id, stepIndex + 1)
                    }
                    className={`${optionBase} ${
                      selected ? optionSelected : optionIdle
                    }`}
                  >
                    <span className="block font-semibold text-ink-900">
                      {opt.label}
                    </span>
                    {opt.sub && (
                      <span className="mt-1 block text-sm text-ink-600">
                        {opt.sub}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </StepChrome>
      );
    }

    /* ---- CONTACT STEP ---- */
    return (
      <StepChrome
        stepNumber={stepIndex + 1}
        total={total}
        onBack={goBack}
        showBack={true}
      >
        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-heading font-bold text-ink-900 focus-visible:outline-none"
        >
          Last one. Where should we reach you?
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <Field
            id="cf-name"
            label="Name"
            value={name}
            onChange={setName}
            placeholder="First and last"
            autoComplete="name"
            error={fieldErrors.name}
          />
          <Field
            id="cf-business"
            label="Business name"
            value={business}
            onChange={setBusiness}
            autoComplete="organization"
            error={fieldErrors.business}
          />
          <Field
            id="cf-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            error={fieldErrors.email}
          />
          <Field
            id="cf-phone"
            label="Phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            autoComplete="tel"
            helper="We'll text before we call."
            error={fieldErrors.phone}
          />
          <div>
            <label
              htmlFor="cf-notes"
              className="mb-1.5 block text-sm font-semibold text-ink-900"
            >
              Anything else we should know?
            </label>
            <textarea
              id="cf-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="The more you tell us, the more useful the first conversation is."
              className={fieldClasses}
            />
          </div>

          {/* Honeypot — visually hidden, must stay empty. */}
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
            <label htmlFor="website_url">Leave this field empty</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Turnstile widget renders above the button. */}
          <div ref={turnstileRef} className="mt-1" />

          <div className="mt-1">
            <button
              type="submit"
              disabled={submitState === "sending"}
              className={primaryBtn}
            >
              {submitState === "sending" ? "Sending…" : "Send it"}
            </button>
            <p className="mt-4 text-sm text-muted">
              You'll hear from Owen within one business day.
            </p>
          </div>
        </form>
      </StepChrome>
    );
  }

  return (
    <section
      className="bg-cream-100 py-12 md:py-20"
      aria-label="Start a consultation"
    >
      <div className="container-site">
        <div className="mx-auto max-w-xl">
          {/* Screen-reader live region announces the current question. */}
          <div aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          <motion.div
            key={screenKey}
            initial={{ opacity: 0, x: direction * dist }}
            animate={{ opacity: 1, x: 0 }}
            transition={stepTransition}
          >
            {renderScreen()}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
   Sub-components
--------------------------------------------------------------------------- */
function StepChrome({
  stepNumber,
  total,
  onBack,
  showBack,
  children,
}: {
  stepNumber: number;
  total: number;
  onBack: () => void;
  showBack: boolean;
  children: React.ReactNode;
}) {
  const pct = Math.round((stepNumber / total) * 100);
  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 transition-colors hover:text-orange-600"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          ) : (
            <span />
          )}
          <span className="font-mono text-xs tracking-[0.15em] text-muted">
            {stepNumber} of {total}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-cream-300">
          <div
            className="h-full rounded-full bg-orange-500 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  helper,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  helper?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-ink-900"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : helper ? `${id}-helper` : undefined
        }
        className={`${fieldClasses} ${error ? "border-orange-500" : ""}`}
      />
      {helper && !error && (
        <p id={`${id}-helper`} className="mt-1.5 text-xs text-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-orange-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
