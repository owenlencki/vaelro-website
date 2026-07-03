// ---------------------------------------------------------------------------
// PORTFOLIO DATA
// Adding a new project = adding an object to this array. No component changes
// needed. Leave `image` as an empty string for a designed placeholder card.
// ---------------------------------------------------------------------------

import maverickImg from "../assets/portfolio/maverick.jpg";
import harvestFestImg from "../assets/portfolio/harvest-fest.jpg";
import workflowImg from "../assets/portfolio/workflow.jpg";

export type ProjectCategory = "Website" | "Product" | "Automation" | "AI System";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  metrics?: string[];
  techStack: string[];
  /** Path to a screenshot/mockup. Empty string renders a designed placeholder. */
  image: string;
  /** Link to the live project, if public. */
  url?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "maverick",
    title: "Maverick — CK Flight Tracker",
    category: "Product",
    description:
      "A full flight school management platform built for CK Aviation. Student scheduling, flight logging, instructor management, and progress tracking — replacing spreadsheets and paper logs with a real system.",
    metrics: ["Live in production", "Next.js + Supabase"],
    techStack: ["Next.js 15", "Supabase", "Prisma", "Tailwind", "shadcn/ui"],
    image: maverickImg,
    url: "https://ck-flight-tracker.netlify.app",
    featured: true,
  },
  {
    id: "meridian",
    title: "Meridian — Property Performance Platform",
    category: "Product",
    description:
      "A performance dashboard for small landlords to track property financials, maintenance, and tenant data in one place. Built to replace the spreadsheet chaos most independent landlords operate in.",
    metrics: ["In active development"],
    techStack: ["React", "TypeScript", "Tailwind"],
    image: "",
    featured: true,
  },
  {
    id: "waypoint",
    title: "Waypoint Financial Solutions — AI Operations Suite",
    category: "Automation",
    description:
      "Five custom AI-powered tools built for a 13-person financial advisory firm: automated distribution info generation, RMD tracking, prospect meeting prep, client milestone tracking, and conference capture. Replaced hours of weekly manual work.",
    metrics: ["5 production tools", "13-person firm"],
    techStack: ["n8n", "Anthropic API", "Google Workspace"],
    image: workflowImg,
    featured: true,
  },
  {
    id: "harvest-fest",
    title: "715 Harvest Fest — Event Platform",
    category: "Website",
    description:
      "A complete event website and vendor application system for Waupaca's 715 Harvest Fest. Online vendor registration, event information, and sponsor showcase — all managed through a headless CMS.",
    metrics: ["Launched and live", "Vendor management system"],
    techStack: ["React", "Sanity CMS", "Netlify"],
    image: harvestFestImg,
    featured: false,
  },
  {
    id: "united-country",
    title: "United Country Real Estate — AI Email System",
    category: "Automation",
    description:
      "AI-powered listing email generator that writes property descriptions in the agent's voice, plus an automated agent onboarding system and listing intake workflow. Built to save hours per listing.",
    metrics: ["AI email generation", "Automated onboarding"],
    techStack: ["n8n", "Anthropic API", "Google Apps Script", "Notion"],
    image: "",
    featured: false,
  },
  {
    id: "icc",
    title: "Indian Crossing Casino — Web Platform",
    category: "Website",
    description:
      "Custom event management website with a branded CMS dashboard for a Wisconsin casino. Real-time content management for events, weddings, dining, and promotions — no developer needed for updates.",
    metrics: ["Custom CMS dashboard", "Real-time content"],
    techStack: ["React", "Vite", "Sanity CMS", "TypeScript", "Tailwind"],
    image: "",
    featured: false,
  },
];
