# Vaelro Website Build

Read `VAELRO_BUILD_PROMPT_FINAL.md` for the complete build spec. It has everything.

## Quick reference
- Pages: Home (`/`), Web Design (`/web-design`), Automation (`/automation`), About (`/about`), Contact (`/contact`), plus `/workshop`, `/work/:slug` case studies, and `/privacy`
- Every page is prerendered to static HTML at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`) and hydrated in the browser
- React 19 + Vite + TypeScript + Tailwind v4
- React Three Fiber for 3D hero (Home page only)
- Framer Motion for scroll animations (all pages)
- Lenis for smooth scroll
- React Router v7 for routing
- Google Calendar appointment scheduling on Contact page (URL in `src/lib/booking.ts`)
- Portfolio data in `src/data/projects.ts` - edit to add work
- Client testimonials live on their projects in `src/data/projects.ts`
- Business name, address, email, and socials: `src/data/business.ts` (footer, Contact, and schema all read it)
- Assets in `/assets` folder (logos, team, backgrounds, portfolio subfolders)
- Deploy: GitHub → Netlify

## Nav structure
6 items, all real routes: Home, Web Design, Automation, Workshop, About, Contact, plus the "Book a Call" CTA (opens the Google Calendar booking page). No scroll-anchor nav items.

## Rules
- Do not spawn subagents. Work sequentially.
- Self-verify each section before moving on.
- No default Tailwind colors. No Inter font.
- Mobile: reduce 3D particles, disable postprocessing.
- Respect `prefers-reduced-motion` everywhere.
- Every "Book a Consultation" CTA links to `/contact`.
- Portfolio screenshots may be placeholders - design the cards to look good either way.
- Components must render on the server: no `window`, `document`, or storage during render. Use `useHydrated`, `useMediaQuery`, or `useNow` for browser-only state. Check with `npm run build`, which fails on empty pages, broken internal links, and incomplete heads.
- Every page renders `<Seo>` (`src/seo/Seo.tsx`) with its own title, description, canonical path, and schema. No page-specific tags in `index.html`.
