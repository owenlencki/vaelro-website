// Shared between the lazy-loaded 3D scene and the HTML overlay in Hero.
// Keep this module free of three.js imports so the overlay can use it
// without pulling the 3D chunk into the main bundle.

export interface OrbService {
  id: string;
  name: string;
  title: string;
  desc: string;
  color: string;
}

export const SERVICES: OrbService[] = [
  {
    id: "websites",
    name: "Websites",
    title: "Custom websites",
    desc: "Sites that load fast, convert visitors, and cost almost nothing to host. You own everything.",
    color: "#D4743B",
  },
  {
    id: "automation",
    name: "Automation",
    title: "Workflow automation",
    desc: "Follow-ups, scheduling, data entry, document processing. Your team stops doing the same work twice.",
    color: "#C49050",
  },
  {
    id: "ai-systems",
    name: "AI Systems",
    title: "AI-powered tools",
    desc: "Custom tools for your operations. Email generators, data parsers, document analysis. Built to run without ongoing AI costs.",
    color: "#A07050",
  },
  {
    id: "strategy",
    name: "Strategy",
    title: "AI strategy",
    desc: "A clear roadmap for where technology fits in your business. Audit, implementation plan, ROI analysis.",
    color: "#908070",
  },
];

export const ORB_COUNT = SERVICES.length;

/**
 * DOM nodes the 3D scene positions each frame by projecting orb world
 * positions to screen space. Written imperatively (never via React state)
 * so the 60fps updates cost no re-renders.
 */
export interface OverlayNodes {
  labels: Array<HTMLElement | null>;
  ring: HTMLElement | null;
  desc: HTMLElement | null;
  dots: HTMLElement | null;
}
