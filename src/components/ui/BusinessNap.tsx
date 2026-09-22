import { ADDRESS_LINE, business, telHref } from "../../data/business";

interface BusinessNapProps {
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Name, address, phone, and email as crawlable text, rendered from
 * src/data/business.ts so the footer, the Contact page, and the structured
 * data always say exactly the same thing.
 */
export default function BusinessNap({
  tone = "light",
  className = "",
}: BusinessNapProps) {
  const dark = tone === "dark";
  // One line each; w-fit keeps the hover underline to the text's width.
  const link = `nav-link flex w-fit min-h-11 items-center font-semibold md:min-h-9 ${
    dark
      ? "text-cream-100 hover:text-orange-300"
      : "text-ink-900 hover:text-orange-600"
  }`;

  return (
    <address className={`not-italic ${className}`}>
      <span
        className={`block font-semibold ${dark ? "text-cream-100" : "text-ink-900"}`}
      >
        {business.name}
      </span>
      <span className={`block ${dark ? "text-cream-100/70" : "text-ink-600"}`}>
        {ADDRESS_LINE}
      </span>
      {business.phone && (
        <a href={telHref(business.phone)} className={link}>
          {business.phone}
        </a>
      )}
      <a href={`mailto:${business.email}`} className={link}>
        {business.email}
      </a>
    </address>
  );
}
