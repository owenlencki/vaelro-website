import { useEffect, useRef, useState } from "react";
import SplitText from "../ui/SplitText";
import Reveal from "../ui/Reveal";
import { workshop } from "../../data/workshop";
import type { PromptCard } from "../../data/workshop";
import { trackEvent } from "../../lib/analytics";

const COPIED_MS = 1500;

/**
 * Clipboard write with a fallback for browsers that withhold the async
 * clipboard API (older Safari, any non-secure context).
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or no secure context: fall through.
  }

  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "0";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(field);
    return copied;
  } catch {
    return false;
  }
}

function PromptEntry({ card }: { card: PromptCard }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    const ok = await copyText(card.prompt);
    if (!ok) return;
    trackEvent("workshop_prompt_copy", { prompt_id: card.id });
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <li className="flex flex-col rounded-2xl border border-ink-700 bg-ink-950/40 p-6 md:p-7">
      <p className="font-mono text-[0.65rem] tracking-[0.18em] text-orange-400 uppercase">
        {card.label}
      </p>
      <h3 className="mt-3 font-serif text-heading font-bold text-cream-100">
        {card.title}
      </h3>
      <p className="mt-4 grow rounded-xl bg-ink-950/60 p-4 font-mono text-[0.8rem] leading-relaxed text-cream-100/75">
        {card.prompt}
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-5 inline-flex min-h-11 items-center justify-center self-start rounded-full border border-orange-500/60 px-5 font-semibold text-orange-400 transition-colors duration-200 hover:border-orange-400 hover:text-orange-300"
      >
        {copied ? workshop.prompts.copiedLabel : workshop.prompts.copyLabel}
      </button>
      <span role="status" className="sr-only">
        {copied ? workshop.prompts.copiedLabel : ""}
      </span>
    </li>
  );
}

/**
 * Prompts people can use the same day, before Session 1. Renders nothing until
 * the copy deck's cards are in the data file.
 */
export default function Prompts() {
  const { prompts } = workshop;
  if (prompts.items.length === 0) return null;

  return (
    <section
      id="prompts"
      className="relative overflow-hidden bg-ink-900 bg-noise py-12 md:py-24"
      aria-label="Free to use today"
    >
      <div className="container-site relative">
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-orange-400 uppercase md:text-sm">
          {prompts.eyebrow}
        </p>
        <h2 className="max-w-2xl font-serif text-title font-bold text-cream-100">
          <SplitText text={prompts.heading} />
        </h2>

        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {prompts.items.map((card) => (
            <PromptEntry key={card.id} card={card} />
          ))}
        </ul>

        {prompts.note && (
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-2xl leading-relaxed text-cream-100/70">
              {prompts.note}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
