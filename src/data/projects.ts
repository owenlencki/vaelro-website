// ---------------------------------------------------------------------------
// WORK DATA
// Single source of truth for the Home fan, the /work/:slug detail pages, and
// scripts/capture-work.ts (which imports this file under tsx, so keep it free
// of JSX, asset imports, and import.meta.* -- plain data only).
//
// Adding a project: add an entry here, run `npm run capture:work -- --only
// <slug>`, commit the generated public/work/<slug>/ images.
//
// Image paths are plain public-root strings ("/work/..."); components prefix
// them with Vite's BASE_URL via src/lib/paths.ts.
// ---------------------------------------------------------------------------

export type WorkCategory = "Website" | "Custom tool" | "Platform";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Project {
  slug: string;
  name: string;
  client: string;
  location?: string;
  category: WorkCategory;
  /** e.g. "Built by Vaelro" */
  badge?: string;
  /** Optional only so unfeatured legacy entries stay honest; required in
   *  practice for every featured entry (capture script flags violations). */
  year?: number;
  /** One sentence; card overlay, page subhead, meta description. */
  tagline: string;
  situation: string;
  built: string;
  /** Omitted rather than invented. */
  changed?: string;
  owns?: string;
  liveUrl?: string;
  /** Public-root paths under /work/. Optional only for unfeatured entries. */
  images?: { card: string; hero: string; alt: string };
  /** Renders only when present; no placeholder UI when absent. */
  testimonial?: Testimonial;
  featured: boolean;
  /** 1 = most prominent (center of the fan, first in the mobile strip). */
  rank: number;
}

export const projects: Project[] = [
  {
    slug: "health-fitness-headquarters",
    name: "Health & Fitness Headquarters",
    client: "Health & Fitness Headquarters",
    location: "Waupaca, WI",
    category: "Website",
    year: 2026,
    tagline:
      "A new site for a local gym, launched on the gym's own domain, with inquiries going straight to the owner.",
    situation:
      "Randy wanted a site that matched the gym and worked on a phone, without renting it from a platform he did not control.",
    built:
      "A fast, mobile-first site with a contact form that lands in Randy's inbox with the sender's address set as the reply-to, so he answers in one tap. We moved hfhonline.com onto the new site and he is on a month-to-month support agreement.",
    changed:
      "Live on the gym's own domain, with every inquiry landing in Randy's inbox.",
    owns: "Domain, hosting, code, and content.",
    liveUrl: "https://hfhonline.com",
    images: {
      card: "/work/health-fitness-headquarters/card.webp",
      hero: "/work/health-fitness-headquarters/hero.webp",
      alt: "The Health & Fitness Headquarters website on a phone",
    },
    featured: true,
    rank: 1,
  },
  {
    slug: "chicken-shack",
    name: "The Chicken Shack",
    client: "The Chicken Shack",
    location: "Waupaca, WI",
    category: "Website",
    year: 2026,
    tagline:
      "A single-page site for a Waupaca-area fried chicken spot: menu, hours, and a contact form that goes straight to the restaurant.",
    situation:
      "The Chicken Shack needed a simple site people could find on their phones: what is on the menu, when the kitchen is open, and how to get in touch.",
    built:
      "A single-page site with the menu, hours, and location, plus a contact form that goes straight to the restaurant's inbox with the sender's address as the reply-to. The Chicken Shack owns the domain and everything on it.",
    owns: "Domain, hosting, code, and content.",
    liveUrl: "https://chickenshackwi.com",
    images: {
      card: "/work/chicken-shack/card.webp",
      hero: "/work/chicken-shack/hero.webp",
      alt: "The Chicken Shack website on a phone",
    },
    featured: true,
    rank: 2,
  },
  {
    slug: "715-harvest-fest",
    name: "715 Harvest Fest",
    client: "715 Harvest Fest",
    location: "Waupaca, WI",
    category: "Website",
    year: 2026,
    tagline:
      "An event site plus a vendor application system that puts every application in one organizer spreadsheet.",
    situation:
      "715 Harvest Fest needed a public site for the event and a way for vendors to apply online, with the organizers able to see every application in one place.",
    built:
      "The event site and a vendor application system. Applications and uploaded files land in an organizer spreadsheet and Drive folder automatically, and the organizers got a short guide plus email templates for follow-up.",
    owns: "The event data, documents, and organizer spreadsheet.",
    liveUrl: "https://715harvestfest.com",
    images: {
      card: "/work/715-harvest-fest/card.webp",
      hero: "/work/715-harvest-fest/hero.webp",
      alt: "The 715 Harvest Fest website on a phone",
    },
    featured: true,
    rank: 3,
  },
  {
    slug: "meridian",
    name: "Meridian",
    client: "Meridian",
    category: "Platform",
    badge: "Built by Vaelro",
    year: 2026,
    tagline:
      "An owner-first command center for small landlords: what each property made, what it cost, and what needs attention.",
    situation:
      "Owners with a handful of units usually run everything from spreadsheets, notes, folders, and reminder emails. The big property management platforms are built for someone else.",
    built:
      "A simple platform that shows what each property made and cost, which rent is missing, what maintenance or renovation work is open, which documents matter, and what deadlines are coming, with a portfolio view across everything. Live in production.",
    liveUrl: "https://meridianpm.app",
    images: {
      card: "/work/meridian/card.webp",
      hero: "/work/meridian/hero.webp",
      alt: "The Meridian website on a phone",
    },
    featured: true,
    rank: 4,
  },
  {
    slug: "maverick",
    name: "Maverick",
    client: "Maverick",
    category: "Platform",
    badge: "Built by Vaelro",
    year: 2026,
    tagline: "A student record-keeping platform for Part 61 flight schools, live and in use.",
    situation:
      "Flight schools track student progress across paper logs and spreadsheets, and proving readiness against regulatory minimums means digging through all of it.",
    built:
      "Student records, flight logs with the Part 61 fields, progress against minimums, and checklists for pre-solo, stage check, and checkride readiness, with instructor and admin roles and school-level branding. Celestial Kinetics Flight Academy in Waupaca is the first school on it.",
    liveUrl: "https://maverickfs.app",
    images: {
      card: "/work/maverick/card.webp",
      hero: "/work/maverick/hero.webp",
      alt: "The Maverick website on a phone",
    },
    featured: true,
    rank: 5,
  },
  {
    slug: "udoni-salan-real-estate",
    name: "Udoni & Salan Real Estate",
    client: "United Country Udoni & Salan Realty Group",
    location: "Waupaca, WI",
    category: "Custom tool",
    year: 2026,
    tagline:
      "An AI-assisted email generator in Shellady's own voice, plus listing intake and agent onboarding systems for a Waupaca real estate office.",
    situation:
      "Shellady Udoni runs marketing for the office and was writing the same kinds of listing and client emails again and again, while every new listing and every new agent meant a pile of manual setup.",
    built:
      "An email generator that drafts listing and client emails in her voice from a few guided fields, a listing intake form that routes each new listing to the office tracker and to her inbox formatted the way she needs it, and a self-service onboarding guide that new agents work through on their own.",
    images: {
      card: "/work/udoni-salan-real-estate/card.webp",
      hero: "/work/udoni-salan-real-estate/hero.webp",
      alt: "The AI email generator built for United Country Udoni & Salan Realty Group",
    },
    featured: true,
    rank: 6,
  },
  {
    slug: "owenlencki",
    name: "Owen Lencki",
    client: "Owen Lencki",
    category: "Website",
    badge: "Built by Vaelro",
    year: 2026,
    tagline:
      "A personal site for a founder and distance runner: the work, the training, and what he is focused on now.",
    situation:
      "Owen is a co-founder and an NCAA Division III distance runner, and he needed one place that says who he is beyond the agency.",
    built:
      "A personal site with his projects and experiments, a training log with racing history, a now page, and a running photo log.",
    liveUrl: "https://owenlencki.com",
    images: {
      card: "/work/owenlencki/card.webp",
      hero: "/work/owenlencki/hero.webp",
      alt: "The Owen Lencki personal site: his name over a collage of running photos",
    },
    featured: true,
    rank: 7,
  },
  // Retained but not featured this phase: no card, no detail page.
  {
    slug: "waypoint",
    name: "Waypoint Financial Solutions",
    client: "Waypoint Financial Solutions",
    category: "Custom tool",
    tagline:
      "Five custom tools for a 13-person financial advisory firm, automating document prep, client tracking, and meeting logistics.",
    situation:
      "A 13-person financial advisory firm was losing hours every week to manual document prep, client tracking, and meeting logistics.",
    built:
      "Five custom tools that automate distribution info generation, RMD tracking, prospect meeting prep, client milestones, and conference capture.",
    featured: false,
    rank: 8,
  },
];

/** Featured projects, most prominent first. */
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.rank - b.rank);

/**
 * Center-out fan placement, returned left to right: rank 1 center, rank 2 to
 * its right, rank 3 to its left, rank 4 right of 2, rank 5 left of 3, and so
 * on outward. Handles any list length without edits.
 */
export function fanOrder(list: Project[]): Project[] {
  const sorted = [...list].sort((a, b) => a.rank - b.rank);
  const left: Project[] = [];
  const right: Project[] = [];
  sorted.slice(1).forEach((p, i) => (i % 2 === 0 ? right : left).push(p));
  return [...left.reverse(), ...sorted.slice(0, 1), ...right];
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
