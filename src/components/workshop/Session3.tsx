import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { useHydrated } from "../../hooks/useHydrated";
import {
  PROMPT_CARD_PDF,
  freePrompts,
  session3,
} from "../../data/session3";
import type { FreeFix, FreePrompt, ToolSettings } from "../../data/session3";
import { copyText } from "../../lib/clipboard";
import { trackEvent } from "../../lib/analytics";
import { withBase } from "../../lib/paths";

/*
 * The Session 3 block on /workshop. Four parts, in order: the free versions of
 * the three fixes, the twelve free prompts (all from the JSON), the two
 * printable prompt card, and the closing text.
 *
 * Built to read with JavaScript off: no scroll reveals (they prerender at
 * opacity 0), accordions are native <details>, and the copy buttons render
 * only once the page has hydrated, so without JavaScript they are simply not
 * there. Every line of text is 16px or larger.
 */

const COPIED_MS = 2000;

const cardShadow =
  "shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]";

const eyebrowClass =
  "mb-3 font-mono text-base tracking-[0.08em] text-orange-700 uppercase";

/** Two-digit number, as the prompt card prints it. */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "November 3, 2026" from "2026-11-03", the same on the server and in the browser. */
function longDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** The prompt with every [bracketed] blank tinted orange. */
function PromptText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]*\])/g).map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="rounded bg-orange-100 font-semibold text-orange-700 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
          >
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

/** A native disclosure: opens and closes with JavaScript off. */
function Disclosure({
  summary,
  children,
  className = "",
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={`group ${className}`}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 text-base font-semibold text-ink-900 [&::-webkit-details-marker]:hidden">
        {summary}
        <Chevron />
      </summary>
      {children}
    </details>
  );
}

function ArrowMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10" />
      <path d="m9 4 4 4-4 4" />
    </svg>
  );
}

function DownloadMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 3.5v9" />
      <path d="m6 9 4 4 4-4" />
      <path d="M4 16.5h12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 1. The free versions
// ---------------------------------------------------------------------------

function FixCard({ fix, index }: { fix: FreeFix; index: number }) {
  return (
    <li
      id={fix.id}
      className={`flex flex-col rounded-2xl bg-cream-50 p-5 md:p-7 ${cardShadow}`}
    >
      <p className="font-mono text-base text-orange-700">{pad(index + 1)}</p>
      <h3 className="mt-1 font-serif text-heading font-bold text-ink-900">
        {fix.title}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-ink-600">{fix.summary}</p>

      {fix.list && (
        <div className="mt-5">
          {fix.listLabel && (
            <p className="text-base font-semibold text-ink-900">{fix.listLabel}</p>
          )}
          <ul className="mt-2 flex flex-wrap gap-2">
            {fix.list.map((item) => (
              <li
                key={item}
                className="rounded-full border border-cream-300 bg-cream-100 px-3 py-1 text-base text-ink-900"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="mt-5 space-y-3">
        {fix.steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-base leading-relaxed text-ink-900">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-base text-cream-50"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span>
              <span className="sr-only">Step {i + 1}: </span>
              {step}
            </span>
          </li>
        ))}
      </ol>

      {fix.link?.href && (
        <a
          href={fix.link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent(fix.link!.event)}
          className="mt-auto inline-flex min-h-12 items-center gap-1.5 self-start pt-5 text-base font-semibold text-ink-900 underline decoration-orange-500 underline-offset-4 hover:text-orange-700"
        >
          {fix.link.label}
          <span className="sr-only"> (opens in a new tab)</span>
          <ArrowMark />
        </a>
      )}
    </li>
  );
}

function FreeVersions() {
  const { freeVersions } = session3;
  return (
    <section
      id="free-versions"
      aria-labelledby="free-versions-heading"
      className="bg-cream-100 pt-14 pb-10 md:pt-24 md:pb-14"
    >
      <div className="container-site">
        <p className={eyebrowClass}>{session3.eyebrow}</p>
        <h2
          id="free-versions-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          {freeVersions.heading}
        </h2>
        <p className="mt-5 max-w-2xl text-lead text-ink-600">{freeVersions.intro}</p>

        <ol className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3 lg:gap-6">
          {freeVersions.fixes.map((fix, i) => (
            <FixCard key={fix.id} fix={fix} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. Free prompts
// ---------------------------------------------------------------------------

/**
 * Writes with the async clipboard API straight from the click. If that is
 * refused, it selects the prompt's text so a long-press or Ctrl+C finishes
 * the job, and tries the legacy copy on that selection.
 */
function CopyPromptButton({
  prompt,
  target,
}: {
  prompt: FreePrompt;
  target: RefObject<HTMLElement | null>;
}) {
  const labels = session3.prompts;
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(next: "copied" | "selected") {
    window.clearTimeout(timer.current);
    setState(next);
    if (next === "copied") {
      trackEvent("session3_prompt_copy", { prompt_id: prompt.id });
      timer.current = window.setTimeout(() => setState("idle"), COPIED_MS);
    }
  }

  function selectText() {
    const node = target.current;
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }
    show(copied ? "copied" : "selected");
  }

  function handleClick() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(prompt.prompt).then(
        () => show("copied"),
        selectText,
      );
    } else {
      selectText();
    }
  }

  const label =
    state === "copied"
      ? labels.copiedLabel
      : state === "selected"
        ? labels.selectedLabel
        : labels.copyLabel;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-base font-semibold text-cream-50 transition-colors duration-200 hover:bg-ink-800 sm:w-auto sm:min-w-40"
      >
        {label}
        <span className="sr-only">
          {" "}
          ({labels.promptLabel} {prompt.id}: {prompt.title})
        </span>
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? `${labels.copiedLabel}: ${prompt.title}` : ""}
      </span>
    </>
  );
}

function PromptCard({ prompt, canCopy }: { prompt: FreePrompt; canCopy: boolean }) {
  const labels = session3.prompts;
  const box = useRef<HTMLParagraphElement>(null);

  return (
    <li
      id={`prompt-${prompt.id}`}
      className={`flex flex-col rounded-2xl bg-cream-50 p-5 md:p-7 ${cardShadow}`}
    >
      <p className="font-mono text-base text-orange-700">
        <span className="sr-only">{labels.promptLabel} </span>
        {pad(prompt.id)}
      </p>
      <h4 className="mt-1 font-serif text-xl leading-snug font-bold text-ink-900 md:text-2xl">
        {prompt.title}
      </h4>
      <p className="mt-2 text-base leading-relaxed text-ink-600">
        <span className="font-semibold text-ink-900">{labels.solvesLabel}: </span>
        {prompt.solves}
      </p>

      <p
        ref={box}
        className="mt-5 rounded-xl border-l-2 border-orange-500 bg-cream-100 px-4 py-4 font-mono text-base leading-relaxed break-words whitespace-pre-wrap text-ink-900 [overflow-wrap:anywhere] md:px-5"
      >
        <PromptText text={prompt.prompt} />
      </p>

      {canCopy && (
        <div className="mt-4">
          <CopyPromptButton prompt={prompt} target={box} />
        </div>
      )}

      <Disclosure
        summary={labels.detailsLabel}
        className="mt-4 border-t border-cream-300 pt-2"
      >
        <dl className="space-y-3 pb-2 text-base leading-relaxed">
          {(
            [
              [labels.fillInLabel, prompt.fill_in],
              [labels.youGetLabel, prompt.you_get],
              [labels.thenLabel, prompt.then],
            ] as const
          ).map(([term, text]) => (
            <div key={term}>
              <dt className="font-semibold text-ink-900">{term}</dt>
              <dd className="text-ink-600">{text}</dd>
            </div>
          ))}
        </dl>
      </Disclosure>
    </li>
  );
}

function ToolAccordion({ tool }: { tool: ToolSettings }) {
  return (
    <li className="rounded-xl border border-cream-300 bg-cream-50 px-4 md:px-5">
      <Disclosure
        summary={
          <span>
            {tool.name}{" "}
            <span className="font-normal text-ink-600">· {tool.plan}</span>
          </span>
        }
      >
        <ul className="space-y-3 pb-4 text-base leading-relaxed text-ink-900">
          {tool.steps.map((step) => (
            <li key={step.text}>
              {step.label ? (
                <>
                  <span className="font-semibold">{step.label}: </span>
                  {step.text}
                </>
              ) : (
                <span className="text-ink-600">{step.text}</span>
              )}
            </li>
          ))}
        </ul>
      </Disclosure>
    </li>
  );
}

function CopyAllButton() {
  const labels = session3.prompts;
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const all = freePrompts.prompts
    .map((p) => `${p.id}. ${p.title}\n${p.prompt}`)
    .join("\n\n");

  function done(ok: boolean) {
    window.clearTimeout(timer.current);
    setState(ok ? "copied" : "failed");
    if (ok) {
      trackEvent("session3_copy_all");
      timer.current = window.setTimeout(() => setState("idle"), COPIED_MS);
    }
  }

  function handleClick() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(all).then(
        () => done(true),
        // Refused: the hidden-textarea copy in copyText is the next best.
        () => copyText(all).then(done),
      );
    } else {
      copyText(all).then(done);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-6 text-base font-bold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-cream-50 sm:w-auto"
      >
        {state === "copied" ? labels.copyAllDone : labels.copyAllLabel}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? labels.copyAllDone : ""}
      </span>
      {state === "failed" && (
        <p className="mt-3 max-w-xl text-base text-ink-600">{labels.copyAllFailed}</p>
      )}
    </div>
  );
}

function FreePromptsSection() {
  const labels = session3.prompts;
  const hydrated = useHydrated();

  return (
    <section
      id="free-prompts"
      aria-labelledby="free-prompts-heading"
      className="bg-cream-100 py-10 md:py-14"
    >
      <div className="container-site">
        <p className={eyebrowClass}>{labels.eyebrow}</p>
        <h2
          id="free-prompts-heading"
          className="max-w-3xl font-serif text-title font-bold text-ink-900"
        >
          {freePrompts.title}
        </h2>
        <p className="mt-5 max-w-2xl text-lead text-ink-600">{freePrompts.subtitle}</p>

        {/* The rule, set apart in the dark tone so nobody scrolls past it. */}
        <div
          role="note"
          className="mt-10 max-w-3xl rounded-2xl border-l-4 border-orange-500 bg-ink-900 p-5 text-cream-50 md:p-7"
        >
          <p className="font-mono text-base tracking-[0.08em] text-orange-300 uppercase">
            {labels.ruleLabel}
          </p>
          <p className="mt-2 font-serif text-xl leading-snug font-bold md:text-2xl">
            {freePrompts.rule}
          </p>
          <p className="mt-3 text-base leading-relaxed text-cream-100/85">
            {freePrompts.rule_detail}
          </p>
        </div>

        <h3 className="mt-12 font-serif text-heading font-bold text-ink-900 md:mt-16">
          {labels.beforeHeading}
        </h3>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">
          {labels.beforeIntro}
        </p>
        <ul className="mt-5 grid max-w-3xl gap-3">
          {freePrompts.tools.map((tool) => (
            <ToolAccordion key={tool.id} tool={tool} />
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-600">
          {freePrompts.limits_note}
        </p>

        <div className="mt-12 max-w-3xl md:mt-16">
          <p className="text-base font-semibold text-ink-900">{labels.howToUseLabel}</p>
          <p className="mt-1 text-base leading-relaxed text-ink-600">
            {freePrompts.how_to_use}
          </p>
        </div>

        {hydrated && <CopyAllButton />}

        {freePrompts.groups.map((group) => {
          const items = freePrompts.prompts.filter((p) => p.group === group.id);
          if (items.length === 0) return null;
          return (
            <div key={group.id} id={`prompts-${group.id}`} className="mt-12 md:mt-16">
              <h3 className="font-serif text-heading font-bold text-ink-900">
                {group.label}
              </h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-600">
                {group.blurb}
              </p>
              <ul className="mt-6 grid gap-5 lg:grid-cols-2 lg:gap-6">
                {items.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} canCopy={hydrated} />
                ))}
              </ul>
            </div>
          );
        })}

        <h3 className="mt-14 font-serif text-heading font-bold text-ink-900 md:mt-20">
          {labels.habitsHeading}
        </h3>
        <ol className="mt-6 max-w-3xl space-y-5">
          {freePrompts.habits.map((habit, i) => (
            <li key={habit.title} className="flex gap-4">
              <span
                className="font-mono text-lg leading-snug text-orange-700"
                aria-hidden="true"
              >
                {pad(i + 1)}
              </span>
              <p className="text-base leading-relaxed text-ink-600">
                <span className="font-semibold text-ink-900">{habit.title}</span>{" "}
                {habit.text}
              </p>
            </li>
          ))}
        </ol>

        <div
          role="note"
          className="mt-10 max-w-3xl rounded-2xl border border-dashed border-orange-500 bg-orange-50 p-5 md:p-7"
        >
          <p className="font-mono text-base tracking-[0.08em] text-orange-700 uppercase">
            {labels.alwaysLabel}
          </p>
          <p className="mt-2 font-serif text-xl leading-snug text-ink-900 md:text-2xl">
            {freePrompts.always}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. Downloads
// ---------------------------------------------------------------------------

function DownloadLink({
  href,
  label,
  line,
  event,
}: {
  href: string;
  label: string;
  line: string;
  event: string;
}) {
  return (
    <li>
      <a
        href={withBase(href)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent(event)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 px-6 py-3 text-base font-bold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-cream-50 sm:w-auto"
      >
        <DownloadMark />
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <p className="mt-2 text-base leading-relaxed text-ink-600">{line}</p>
    </li>
  );
}

function Downloads() {
  const { downloads } = session3;
  if (!PROMPT_CARD_PDF) return null;

  return (
    <section
      id="downloads"
      aria-labelledby="downloads-heading"
      className="bg-cream-100 py-10 md:py-14"
    >
      <div className="container-site">
        <p className={eyebrowClass}>{downloads.eyebrow}</p>
        <h2
          id="downloads-heading"
          className="font-serif text-heading font-bold text-ink-900"
        >
          {downloads.heading}
        </h2>
        <ul className="mt-6 flex flex-col gap-6 sm:flex-row sm:gap-10">
          {PROMPT_CARD_PDF && (
            <DownloadLink
              href={PROMPT_CARD_PDF}
              label={downloads.promptCardLabel}
              line={downloads.promptCardLine}
              event="session3_prompt_card_download"
            />
          )}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4. Closing, then the small print
// ---------------------------------------------------------------------------

function Closing() {
  const { closing, settings_checked_on } = freePrompts;
  return (
    <section
      aria-labelledby="session3-closing-heading"
      className="bg-cream-100 pt-10 pb-14 md:pt-14 md:pb-24"
    >
      <div className="container-site">
        <div className="max-w-3xl border-t border-cream-300 pt-10">
          <h2
            id="session3-closing-heading"
            className="font-serif text-heading font-bold text-ink-900"
          >
            {closing.heading}
          </h2>
          <p className="mt-3 text-lead text-ink-600">{closing.text}</p>
          {/* Plain text on purpose: the address is there to read and copy, not tap. */}
          <p className="mt-4 text-base leading-relaxed text-ink-900 select-text">
            {closing.cta}
          </p>
          <p className="mt-10 text-base text-ink-500">
            {session3.smallPrint.replace("{date}", longDate(settings_checked_on))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Session3() {
  return (
    <div id="session-3">
      <FreeVersions />
      <FreePromptsSection />
      <Downloads />
      <Closing />
    </div>
  );
}
