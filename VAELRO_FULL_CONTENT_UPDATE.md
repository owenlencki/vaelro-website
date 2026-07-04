# Full Copy, Content & Portfolio Update

Make all of the following changes. Do not touch the hero 3D orbs, the page routing, animations, fonts, or overall page structure. This is a content and copy pass only.

---

## HOME PAGE CHANGES

### Eyebrow text in hero
Change "AI-POWERED AGENCY" to "WEB & AUTOMATION AGENCY". Keep "WAUPACA, WI".

### Marquee
Reduce to ONE scrolling banner (remove the second row if there are two). Remove "You Own Everything" from the items. Keep these items (or similar):
"More Time Back · Websites That Convert · Workflow Automation · Local Service · Modern Tech · Clean Systems"

### Services section

**Section heading:** Keep "Three ways we give you your time back" and the subtext.

**Service 01 — change label from "CUSTOM WEBSITES" to just "WEBSITES":**
- Keep title: "Websites That Actually Work"
- Rewrite description: "Not templates. Not WordPress. Custom-built sites on modern infrastructure that load fast, look great on every device, and turn visitors into customers."
- Remove the "never gets hacked" claim
- Remove "You own everything: code, domain, hosting, data." Replace with: "No lock-in. Everything we build is yours."
- Remove the TECH section entirely (React, Tailwind, Headless CMS, Cloudflare). Nobody visiting this site cares about the stack.

**Service 02 — change label from "AI AUTOMATION" to "WORKFLOW AUTOMATION":**
- Keep title: "Stop Doing the Same Thing Twice" (this is great)
- Keep the description as-is, it reads naturally. Just make sure there are no em dashes.
- Remove the TECH section if there is one.

**Service 03 — keep label "AI STRATEGY & CONSULTING":**
- Keep title: "Know Exactly Where AI Fits"
- Keep description, just polish for flow. Make sure it reads clean.
- Remove DELIVERABLES or TECH section if there is one.

**For all three service cards:** Remove any "TECH" or "DELIVERABLES" footer sections from the cards. The cards should end after the description text. Clean and simple.

### Social proof section

Remove the animated stat counters entirely ("6+ Local Businesses Served", "5 AI Systems in Production", "2 Software Products Built"). All of them, gone.

Remove the "Trusted by Local Businesses" heading and any client logo/name bar.

Replace the entire section with a clean, centered block:
- Heading (Fraunces, modest size): "We're just getting started. Ask our clients what it's like to work with us."
- Button below: "Get in touch" linking to /contact
- Keep it minimal and confident. No placeholder testimonial cards.

### CTA section (bottom of home page)
Keep as-is. "Ready to stop doing everything manually?" is good. Make sure the button links to /contact.

### Footer
Keep as-is. Make sure it includes:
- Vaelro logo
- Waupaca, WI
- hello@vaelro.co
- @vaelro.co (Instagram)
- © 2026 Vaelro LLC. All rights reserved.
- Privacy Policy link (can be a placeholder "#" for now)

---

## ABOUT PAGE CHANGES

### Page header
Change headline from "Two people. Real systems. No fluff." to something stronger. Use one of these:
- "We started Vaelro because local businesses deserve better technology."
- "Built in Waupaca. Here to stay."
- Or write something better that captures: two young founders, local roots, genuine commitment to helping small businesses with technology.

Keep the subtext paragraph: "Vaelro is a two-person AI automation and web agency based in Waupaca, Wisconsin. We build websites and systems for local businesses that want technology working for them, not against them." (Clean up if needed, remove "AI automation" if it feels too techy, maybe "Vaelro is a two-person web and automation agency...")

### Team bios
The team photos are great, keep them. But expand each bio with more story. They should feel personal and real, not corporate.

**Owen Lencki — Co-founder**
Expand beyond the current short bio. Include:
- He's a college sophomore and D3 athlete at UW-Stevens Point
- He started Vaelro because he saw local businesses struggling with outdated websites and wasting hours on manual work
- He leads client relationships, sales, strategy, and website builds
- He grew up in the Waupaca area (local connection matters)
- Tone: confident but approachable, not corporate

**Liam Bloedow — Co-founder**
Expand similarly:
- He's the automation and infrastructure lead
- He builds the n8n workflows, manages deployments, and makes the backend systems run
- He's currently working with Higgsfield AI on next-generation video content
- He handles the technical architecture and makes sure everything actually works in production
- Tone: same — real person, not a corporate bio

Write these as 3-4 sentence paragraphs, not bullet points. They should read like someone talking about themselves naturally.

### Process section ("Three steps. No mystery.")
DO NOT CHANGE THIS. It's perfect. Keep the discovery, build, launch & support flow and the "We don't go anywhere" messaging exactly as it is. Do not touch any copy or animation in this section.

### Differentiators section ("What makes us different")
Rework the four differentiators:

1. **Remove "You own everything."** Replace with: **"No lock-in. Ever."** Description: "Everything we build is yours. Your domain, your code, your data. If you ever want to move on, you take it all with you. No hostage games, no transfer fees."

2. **Change "Built to last" to something more concrete.** Try: **"Built on modern infrastructure."** Description: "Our sites load in under 2 seconds and cost a few dollars a month to host. No constant security patches, no plugin updates breaking things overnight."

3. **Keep "We're 10 minutes away."** This is great. Keep the description as-is or tighten it: "When something breaks before a big event, you call us directly. Not a ticket queue. Not a chatbot. Us."

4. **Keep "We don't disappear."** This is great. Expand slightly to emphasize the long-term partnership: "We're not a one-and-done vendor. We stay on as your technology partner, keeping your systems running and improving month after month. Your growth is our growth."

---

## CONTACT PAGE

Keep it simple as-is. Just make sure:
- The booking button URL should be: `https://calendar.app.google/9eUGdz1BkJnMe4e67`
- Make sure every "Book a Free Consultation" and "Book a Call" button/link across the entire site points to this URL (open in new tab)
- The contact form works (logs to console is fine for now)
- hello@vaelro.co is displayed
- Waupaca, WI is displayed

---

## SEO — WAUPACA, WISCONSIN

Make sure these are in place across the site:
- Meta title: "Vaelro | Web & Automation Agency in Waupaca, WI"
- Meta description: "Custom websites and workflow automation for small businesses in Waupaca, Wisconsin. Local service, modern tech, no lock-in. Book a free consultation."
- "Waupaca" and "Wisconsin" appear naturally in on-page copy at least 2-3 times (hero eyebrow, about page intro, footer, contact page)
- The LocalBusiness JSON-LD schema includes the Waupaca, WI address
- Do NOT keyword-stuff. Keep it natural.

---

## PORTFOLIO RESTRUCTURE

### Replace the projects data file

Replace the entire contents of `src/data/projects.ts` (or wherever portfolio data lives) with:

```typescript
export interface Project {
  id: string;
  title: string;
  category: "Client Work" | "Built by Vaelro";
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
    description: "A 13-person financial advisory firm was losing hours every week to manual document prep, client tracking, and meeting logistics. We built five custom tools that automate distribution info generation, RMD tracking, prospect meeting prep, client milestones, and conference capture.",
    metrics: ["5 production tools", "13-person firm"],
    techStack: ["n8n", "Anthropic API", "Google Workspace"],
    image: "",
    featured: true,
    testimonial: null,
  },
  {
    id: "maverick",
    title: "Maverick",
    category: "Built by Vaelro",
    description: "Flight schools run on spreadsheets and paper logs. We built a full management platform for student scheduling, flight logging, instructor tracking, and progress monitoring. Live in production.",
    metrics: ["Live in production", "Full-stack platform"],
    techStack: ["Next.js", "Supabase", "Prisma", "Tailwind"],
    image: "",
    url: "https://ck-flight-tracker.netlify.app",
    featured: true,
    testimonial: null,
  },
  {
    id: "harvest-fest",
    title: "715 Harvest Fest",
    category: "Client Work",
    description: "Waupaca's 715 Harvest Fest needed a way for vendors to apply online and for organizers to track applications and event logistics. We built a complete event platform with an integrated vendor application and tracking system, plus the full marketing site.",
    metrics: ["Live event platform", "Vendor management system"],
    techStack: ["React", "Sanity CMS", "Netlify"],
    image: "",
    url: "https://715harvestfest.com",
    featured: true,
    testimonial: null,
  },
  {
    id: "udoni-salan",
    title: "Udoni & Salan Real Estate",
    category: "Client Work",
    description: "A real estate team was managing new listing intake on paper and manually importing data into their systems. We built a digital intake form that automatically routes listing information exactly where it needs to go, an AI email generator that writes property descriptions in the agent's voice, and an automated onboarding system for new agents.",
    metrics: ["AI email generation", "Automated onboarding", "Digital intake system"],
    techStack: ["n8n", "Anthropic API", "Google Apps Script", "Notion"],
    image: "",
    featured: false,
    testimonial: null,
  },
  {
    id: "meridian",
    title: "Meridian",
    category: "Built by Vaelro",
    description: "Small landlords manage their properties in spreadsheets and shoeboxes. We built a performance dashboard that tracks property financials, maintenance schedules, and tenant data in one place. Currently in development.",
    metrics: ["In development"],
    techStack: ["React", "TypeScript", "Tailwind"],
    image: "",
    featured: false,
    testimonial: null,
  },
];
```

### Update the Portfolio component

**Category filter tabs:** Use "All", "Client Work", "Built by Vaelro" as the filter tabs.

**Project cards:**
- Featured projects get larger cards (span 2 columns on desktop)
- Each card shows: category tag, title, description, and metrics
- Remove techStack display from the cards (nobody cares about the stack, same principle as the services section)
- If `url` exists, show a "View live site" link
- If `url` does not exist, no link
- Per-project testimonial area: if testimonial is null, show nothing (no placeholder text per card)
- "Built by Vaelro" badge should feel distinct but proud

**For Meridian:** Show an "In development" badge alongside the "Built by Vaelro" tag.

### Images

Scan `/assets/portfolio/` for images. Match by filename prefix:
- Files starting with `maverick` → Maverick (use the best dashboard overview shot)
- Files starting with `meridian` → Meridian (use the dashboard overview)
- Files starting with `harvestfest` → 715 Harvest Fest
- Files starting with `waypoint` → Waypoint Financial
- Files starting with `udoni-salan` → Udoni & Salan Real Estate
- Use the best single image per project as the card thumbnail
- If no match found, render a clean gradient placeholder

### Client name bar

Remove the client name/logo bar entirely from wherever it appears. We'll add it back later when the client list is longer.

---

## GLOBAL

- Remove any remaining em dashes across the entire codebase
- Make sure "Waupaca" appears naturally on the home page (hero eyebrow has it), about page, and contact page
- Do not add tech stack labels to any client-facing section
- Verify all internal links work (nav scroll-to-section, page navigation, CTA buttons to /contact)
- Do not touch the hero 3D orbs, any animations, fonts, colors, or the process section on the about page
