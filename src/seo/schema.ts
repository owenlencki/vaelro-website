// ---------------------------------------------------------------------------
// STRUCTURED DATA
// schema.org JSON-LD for each page's <head>. Every fact comes from src/data,
// so the schema always says exactly what the page and the footer say (search
// engines check that the name and address match everywhere).
// ---------------------------------------------------------------------------

import { business } from "../data/business";
import type { FaqItem } from "../data/faqs";

export type Schema = Record<string, unknown>;

export const SITE_URL = business.url;

/** "/" -> "https://vaelro.co/", "/about" -> "https://vaelro.co/about" */
export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

const BUSINESS_ID = `${SITE_URL}/#business`;

const AREA_SERVED = [
  {
    "@type": "County",
    name: "Waupaca County",
    sameAs: "https://en.wikipedia.org/wiki/Waupaca_County,_Wisconsin",
  },
  { "@type": "State", name: "Wisconsin" },
];

/** The business itself, without @context so it can nest inside other nodes. */
function businessNode(): Schema {
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: business.name,
    description:
      "Custom website design and business automation for small businesses in Waupaca County, Wisconsin.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    ...(business.phone ? { telephone: business.phone } : {}),
    email: business.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    areaServed: AREA_SERVED,
    sameAs: business.social.map((profile) => profile.url),
    founder: business.founders.map((founder) => ({
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
    })),
    knowsAbout: [
      "Web Design",
      "Business Automation",
      "AI Automation",
      "Small Business Websites",
    ],
  };
}

/** The local business listing: Home, About, Contact. */
export function businessSchema(): Schema {
  return { "@context": "https://schema.org", ...businessNode() };
}

/** Names the site "Vaelro" in search results. Home only. */
export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: business.brand,
    alternateName: business.name,
    url: absoluteUrl("/"),
    publisher: { "@id": BUSINESS_ID },
  };
}

interface ServiceInput {
  name: string;
  serviceType: string;
  description: string;
  /** The service page's path, e.g. "/web-design". */
  path: string;
  /** Lowest flat-rate price in USD, when the page states one. */
  priceFrom?: number;
}

/** One service page. The provider is the full business, so the page stands alone. */
export function serviceSchema({
  name,
  serviceType,
  description,
  path,
  priceFrom,
}: ServiceInput): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: businessNode(),
    areaServed: AREA_SERVED,
    ...(priceFrom
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: priceFrom,
              priceCurrency: "USD",
            },
          },
        }
      : {}),
  };
}

/** Questions and answers exactly as the page shows them. */
export function faqSchema(faqs: FaqItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * JSON for a <script type="application/ld+json">. "<" is escaped so no value
 * can close the script tag early; JSON parsers read < back as "<".
 */
export function serializeSchema(schema: Schema): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
