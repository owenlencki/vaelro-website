import { useContext, useEffect } from "react";
import { SsrContext } from "../lib/ssr";
import {
  SITE_URL,
  absoluteUrl,
  serializeSchema,
  type Schema,
} from "./schema";

interface SeoImage {
  /** Absolute URL, 1200x630. */
  url: string;
  alt: string;
}

interface SeoProps {
  /** Under 60 characters, main keyword first. */
  title: string;
  /** 120 to 158 characters, with the page's keyword. */
  description: string;
  /** Site path, e.g. "/web-design". Omit on pages with no canonical URL (404). */
  path?: string;
  /** JSON-LD for this page, one document per entry. */
  schema?: Schema | Schema[];
  /** Defaults to "index, follow". */
  robots?: string;
  /** Link-preview copy, when it should differ from the title and description. */
  socialTitle?: string;
  socialDescription?: string;
  image?: SeoImage;
}

const DEFAULT_IMAGE: SeoImage = {
  url: `${SITE_URL}/og-image.jpg`,
  alt: "Vaelro. Web & Automation Agency in Waupaca, WI.",
};

const JSON_LD_SELECTOR = 'script[type="application/ld+json"][data-seo]';

/**
 * Keeps this page's JSON-LD in <head> in the browser. After hydration the
 * prerendered scripts already match and are simply adopted; on client-side
 * navigation the old page's scripts go and this page's go in.
 */
function useHeadJsonLd(documents: string[]) {
  // Serialized JSON never contains a raw newline, so this is a safe join.
  const key = documents.join("\n");

  useEffect(() => {
    const wanted = key ? key.split("\n") : [];
    const existing = Array.from(
      document.head.querySelectorAll<HTMLScriptElement>(JSON_LD_SELECTOR),
    );
    const matches =
      existing.length === wanted.length &&
      existing.every((node, i) => node.textContent === wanted[i]);

    let nodes = existing;
    if (!matches) {
      existing.forEach((node) => node.remove());
      nodes = wanted.map((json) => {
        const node = document.createElement("script");
        node.type = "application/ld+json";
        node.setAttribute("data-seo", "");
        node.textContent = json;
        document.head.appendChild(node);
        return node;
      });
    }
    return () => nodes.forEach((node) => node.remove());
  }, [key]);
}

/**
 * Every page's head tags, from its own props: title, description, canonical,
 * robots, Open Graph, Twitter card, and JSON-LD. React 19 hoists the title,
 * meta, and link elements into <head> (the prerender moves them there in the
 * static HTML). JSON-LD is not hoistable, so on the server it is handed to the
 * prerender, which writes it into <head>, and in the browser it is synced by
 * useHeadJsonLd.
 */
export default function Seo({
  title,
  description,
  path,
  schema,
  robots = "index, follow",
  socialTitle = title,
  socialDescription = description,
  image = DEFAULT_IMAGE,
}: SeoProps) {
  const url = path ? absoluteUrl(path) : undefined;
  const documents = (Array.isArray(schema) ? schema : schema ? [schema] : []).map(
    serializeSchema,
  );

  const ssr = useContext(SsrContext);
  if (ssr) ssr.jsonLd = documents;
  useHeadJsonLd(documents);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Vaelro" />
      <meta property="og:locale" content="en_US" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={image.url} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={image.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={image.url} />
      <meta name="twitter:image:alt" content={image.alt} />
    </>
  );
}
