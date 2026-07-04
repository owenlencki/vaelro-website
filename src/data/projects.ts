// ---------------------------------------------------------------------------
// PORTFOLIO DATA
// Adding a new project = adding an object to this array. No component changes
// needed. Leave `image` as an empty string for a designed placeholder card.
// ---------------------------------------------------------------------------

import waypointImg from "../assets/portfolio/waypoint-knowledge-hub.jpg";
import maverickImg from "../assets/portfolio/maverick-dashboard.jpg";
import harvestFestImg from "../assets/portfolio/harvest-fest-site.jpg";
import udoniSalanImg from "../assets/portfolio/udoni-salan-email.jpg";
import meridianImg from "../assets/portfolio/meridian-dashboard.jpg";

export type ProjectCategory = "Client Work" | "Built by Vaelro";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  metrics?: string[];
  techStack: string[];
  image?: string;
  url?: string;
  featured: boolean;
  testimonial?: {
    quote: string;
    name: string;
    role: string;
  } | null;
}

export const projects: Project[] = [
  {
    id: "waypoint",
    title: "Waypoint Financial Solutions",
    category: "Client Work",
    description:
      "A 13-person financial advisory firm was losing hours every week to manual document prep, client tracking, and meeting logistics. We built five custom tools that automate distribution info generation, RMD tracking, prospect meeting prep, client milestones, and conference capture.",
    metrics: ["5 production tools", "13-person firm"],
    techStack: ["n8n", "Anthropic API", "Google Workspace"],
    image: waypointImg,
    featured: true,
    testimonial: null,
  },
  {
    id: "maverick",
    title: "Maverick",
    category: "Built by Vaelro",
    description:
      "Flight schools run on spreadsheets and paper logs. We built a full management platform for student scheduling, flight logging, instructor tracking, and progress monitoring.",
    techStack: ["Next.js", "Supabase", "Prisma", "Tailwind"],
    image: maverickImg,
    featured: false,
    testimonial: null,
  },
  {
    id: "harvest-fest",
    title: "715 Harvest Fest",
    category: "Client Work",
    description:
      "Waupaca's 715 Harvest Fest needed a way for vendors to apply online and for organizers to track applications and event logistics. We built a complete event platform with an integrated vendor application and tracking system, plus the full marketing site.",
    metrics: ["Live event platform", "Vendor management system"],
    techStack: ["React", "Sanity CMS", "Netlify"],
    image: harvestFestImg,
    url: "https://715harvestfest.com",
    featured: true,
    testimonial: null,
  },
  {
    id: "udoni-salan",
    title: "Udoni & Salan Real Estate",
    category: "Client Work",
    description:
      "A real estate team was managing new listing intake on paper and manually importing data into their systems. We built a digital intake form that automatically routes listing information exactly where it needs to go, an AI email generator that writes property descriptions in the agent's voice, and an automated onboarding system for new agents.",
    metrics: [
      "AI email generation",
      "Automated onboarding",
      "Digital intake system",
    ],
    techStack: ["n8n", "Anthropic API", "Google Apps Script", "Notion"],
    image: udoniSalanImg,
    featured: false,
    testimonial: null,
  },
  {
    id: "meridian",
    title: "Meridian",
    category: "Built by Vaelro",
    description:
      "Small landlords manage their properties in spreadsheets and shoeboxes. We built a performance dashboard that tracks property financials, maintenance schedules, and tenant data in one place.",
    techStack: ["React", "TypeScript", "Tailwind"],
    image: meridianImg,
    featured: false,
    testimonial: null,
  },
];
