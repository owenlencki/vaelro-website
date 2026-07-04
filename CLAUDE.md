# Vaelro Website Build

Read `VAELRO_BUILD_PROMPT_FINAL.md` for the complete build spec. It has everything.

## Quick reference
- 3-page site: Home (`/`), About (`/about`), Contact (`/contact`)
- React 19 + Vite + TypeScript + Tailwind v4
- React Three Fiber for 3D hero (Home page only)
- Framer Motion for scroll animations (all pages)
- Lenis for smooth scroll
- React Router v7 for routing
- Google Calendar appointment scheduling on Contact page (placeholder URL)
- Portfolio data in `src/data/projects.ts` - edit to add work
- Testimonial data in a data file - placeholder content for now
- Assets in `/assets` folder (logos, team, backgrounds, portfolio subfolders)
- Deploy: GitHub → Netlify

## Nav structure
5 items: Services (scroll-to on Home), Work (scroll-to on Home), About (page), Contact (page), plus "Book a Call" CTA button → /contact

## Rules
- Do not spawn subagents. Work sequentially.
- Self-verify each section before moving on.
- No default Tailwind colors. No Inter font.
- Mobile: reduce 3D particles, disable postprocessing.
- Respect `prefers-reduced-motion` everywhere.
- Every "Book a Consultation" CTA links to `/contact`.
- Portfolio screenshots may be placeholders - design the cards to look good either way.
