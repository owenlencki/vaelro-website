import { useEffect, useRef, useState } from "react";
import SplitText from "../../ui/SplitText";
import Reveal from "../../ui/Reveal";
import { session1 } from "../../../data/session1";
import { copyText } from "../../../lib/clipboard";
import { trackEvent } from "../../../lib/analytics";

const COPIED_MS = 1500;

/**
 * One prompt, and the whole block is the copy target: on a phone the thing you
 * want to tap is the prompt itself, not a small button beside it.
 */
export default function PromptBlock() {
  const { prompt } = session1;
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    const ok = await copyText(prompt.text);
    if (!ok) return;
    trackEvent("session1_prompt_copy");
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <section
      id="prompt"
      className="bg-cream-100 py-12 md:py-20"
      aria-label="One prompt to try this week"
    >
      <div className="container-site">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-600 uppercase md:text-sm">
          {prompt.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-ink-900">
          <SplitText text={prompt.heading} />
        </h2>

        <Reveal delay={0.15}>
          <button
            type="button"
            onClick={handleCopy}
            className="group mt-8 block w-full max-w-3xl cursor-pointer rounded-2xl bg-ink-900 p-6 text-left transition-colors duration-200 hover:bg-ink-800 md:mt-10 md:p-8"
          >
            <span className="flex items-center justify-between gap-4 font-mono text-[0.65rem] tracking-[0.18em] uppercase">
              <span className="text-orange-400">
                {copied ? prompt.copiedLabel : prompt.copyLabel}
              </span>
              <CopyMark copied={copied} />
            </span>
            <span className="mt-4 block font-serif text-heading leading-snug font-bold text-cream-100">
              &ldquo;{prompt.text}&rdquo;
            </span>
          </button>
          <span role="status" className="sr-only">
            {copied ? prompt.copiedLabel : ""}
          </span>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-600">
            {prompt.note}
          </p>
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
      className="h-4 w-4 shrink-0 text-orange-400"
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
