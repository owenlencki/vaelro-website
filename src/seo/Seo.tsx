import { useContext, useEffect } from "react";
import { SsrContext } from "../lib/ssr";
import { absoluteUrl, serializeSchema, type Schema } from "./schema";

interface SeoProps {
  title: string;
  description: string;
  /** Site path, e.g. "/web-design". Omit on pages with no canonical URL (404). */
  path?: string;
  /** JSON-LD for this page, one document per entry. */
  schema?: Schema | Schema[];
}

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
 * Every page's head tags, from its own props. React 19 hoists the title, meta,
 * and link elements into <head> (the prerender moves them there in the static
 * HTML). JSON-LD is not hoistable, so on the server it is handed to the
 * prerender, which writes it into <head>, and in the browser it is synced by
 * useHeadJsonLd.
 */
export default function Seo({ title, description, path, schema }: SeoProps) {
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
      {path && <link rel="canonical" href={absoluteUrl(path)} />}
    </>
  );
}
