import { useEffect, useRef, useState } from "react";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import type { PromptItem } from "../../../data/session1";
import { copyText } from "../../../lib/clipboard";
import { trackEvent } from "../../../lib/analytics";

const COPIED_MS = 1600;

const cardShadow =
  "shadow-[0_1px_2px_rgba(26,26,26,0.04),0_12px_32px_rgba(26,26,26,0.06)]";

/**
 * "Friday, September 25, 2026" in the reader's own time zone, which is the
 * "today" they mean. Called on tap only, never during render, so the
 * prerendered page and the browser always agree on the markup.
 */
function todayLong(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

/** The prompt as shown, with the date placeholder marked as a blank to fill. */
function PromptText({ item }: { item: PromptItem }) {
  const { datePlaceholder } = session1.tryThis;
  if (!item.fillsDate) return <>{item.prompt}</>;

  const [before, after] = item.prompt.split(datePlaceholder);
  return (
    <>
      {before}
      <span className="rounded-md bg-orange-100 px-1 py-0.5 font-sans text-[0.8em] font-semibold whitespace-nowrap text-orange-800">
        {datePlaceholder}
      </span>
      {after}
    </>
  );
}

/**
 * One tap puts the prompt on the clipboard. Every button reads the same, so
 * the prompt's name rides along for screen readers.
 */
function CopyButton({ item }: { item: PromptItem }) {
  const { tryThis } = session1;
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    const text = item.fillsDate
      ? item.prompt.replace(tryThis.datePlaceholder, todayLong())
      : item.prompt;
    const ok = await copyText(text);
    window.clearTimeout(timer.current);
    if (!ok) {
      setState("failed");
      return;
    }
    trackEvent("session1_prompt_copy", { prompt_id: item.id });
    setState("copied");
    timer.current = window.setTimeout(() => setState("idle"), COPIED_MS);
  }

  const copied = state === "copied";

  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 font-semibold text-cream-50 transition-colors duration-200 hover:bg-ink-800 sm:w-auto"
      >
        <CopyMark copied={copied} />
        {copied ? tryThis.copiedLabel : tryThis.copyLabel}
        <span className="sr-only"> ({item.name})</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? `${tryThis.copiedLabel}: ${item.name}` : ""}
      </span>
      {state === "failed" && (
        <p className="mt-2 text-sm text-ink-600">{tryThis.copyFailed}</p>
      )}
    </div>
  );
}

function PromptCard({ item }: { item: PromptItem }) {
  return (
    <li className={`flex flex-col rounded-2xl bg-cream-50 p-6 md:p-7 ${cardShadow}`}>
      <h3 className="font-serif text-xl font-bold text-ink-900">{item.name}</h3>
      {item.why && <p className="mt-1.5 leading-relaxed text-ink-600">{item.why}</p>}

      <p className="mt-5 rounded-xl border-l-2 border-orange-500 bg-cream-100 px-4 py-4 font-serif text-lg leading-snug text-ink-900">
        &ldquo;
        <PromptText item={item} />
        &rdquo;
      </p>
      {item.fillsDate && (
        <p className="mt-2 text-sm text-ink-600">{session1.tryThis.dateNote}</p>
      )}

      {/* Pinned to the bottom so the buttons line up across a row. */}
      <div className="mt-auto pt-5">
        <CopyButton item={item} />
      </div>
    </li>
  );
}

/**
 * The three prompts from the session, then the bonus. On a phone they stack,
 * each with a full-width button under the thumb.
 */
export default function TryThis() {
  const { tryThis } = session1;
  const { bonus } = tryThis;

  return (
    <section
      id="try-this-week"
      className="bg-cream-100 py-14 md:py-24"
      aria-labelledby="try-this-week-heading"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-700 uppercase md:text-sm">
          {tryThis.eyebrow}
        </p>
        <h2
          id="try-this-week-heading"
          className="max-w-2xl font-serif text-title font-bold text-ink-900"
        >
          <SplitText text={tryThis.heading} />
        </h2>

        <ul className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {tryThis.items.map((item) => (
            <PromptCard key={item.id} item={item} />
          ))}
        </ul>

        {/* The bonus sits apart and reads lighter: a dashed outline, no card. */}
        <Reveal delay={0.1}>
          <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-dashed border-orange-500 p-6 md:mt-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-7">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-orange-700 uppercase">
                {bonus.name}
              </p>
              <p className="mt-2 font-serif text-heading font-bold text-ink-900">
                &ldquo;{bonus.prompt}&rdquo;
              </p>
              {bonus.why && <p className="mt-1 text-ink-600">{bonus.why}</p>}
            </div>
            <div className="shrink-0">
              <CopyButton item={bonus} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Two overlapping sheets, swapped for a check once the copy lands. */
function CopyMark({ copied }: { copied: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {copied ? (
        <path d="m4.5 10.5 3.5 3.5 7.5-7.5" />
      ) : (
        <>
          <rect x="7" y="7" width="9" height="9" rx="2" />
          <path d="M13 4.5H6a2 2 0 0 0-2 2V13" />
        </>
      )}
    </svg>
  );
}
