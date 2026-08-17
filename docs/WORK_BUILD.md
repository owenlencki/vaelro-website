# WORK_BUILD.md — vaelro.co case-study fan, detail pages, and screenshot capture

You are Claude Code working in the `vaelro-website` repo (React 19, Vite, TypeScript, Tailwind v4, React Router v7, Framer Motion, Lenis, R3F hero, deployed on Netlify from GitHub). Owen is the navigator. Everything you need is in this file. Do not ask Owen to write copy, edit data, or fill in blanks; every value is final here unless the repo or a live site proves it wrong.

**Repo wins.** If anything below conflicts with what is actually in the repo (file names, theme, existing patterns, section order), follow the repo and say so in the plan.

---

## 1. Read first

1. This file, in full.
2. `docs/design-refs/off-track-1.png` through `off-track-4.png` if they exist (reference screenshots of landonorris.com/off-track showing the rest state and three hover states). If the folder is missing, follow the written description in Section 2; do not stop. Add `docs/design-refs/` to `.gitignore` either way. Those images are reference only, never shipped, never committed.
3. `src/data/projects.ts`, `src/components/sections/Portfolio.tsx`, `src/components/ui/ProjectCard.tsx`, `src/pages/HomePage.tsx`, `src/App.tsx`, `src/components/layout/Navbar.tsx`, `src/hooks/useReducedMotion.ts`, `src/lib/animations.ts`, `public/_redirects` or `netlify.toml`, and `ls assets/portfolio/`.

---

## 2. What we are building

Replace the Portfolio section on Home with a fanned "hand of cards" case-study display modeled on the reference, add a detail page per project at `/work/:slug`, and add a re-runnable script that screenshots every live site so cards and detail pages always have current images. We borrow the interaction, not the look: type, color, spacing, and copy come from the existing vaelro.co design system.

Reference behavior:
- **Rest:** portrait cards fanned symmetrically from a common pivot below the row, like cards held in a hand. The center card is upright and on top; each card outward rotates a further step (about 8 degrees) and sits slightly lower. Cards overlap roughly 40 percent of their width. Rounded corners, no borders, soft shadow.
- **Hover:** the hovered card straightens to 0 degrees, lifts a little, scales up slightly (about 1.07), and comes to the top of the stack. Its immediate neighbors slide outward to open a gap around it; cards further out slide a smaller amount. Nothing else animates: no overlays or captions sliding in.
- **Below the fan:** one line of copy and a CTA.

---

## 3. Roster (final)

`rank` is prominence: rank 1 is the center card of the fan on desktop and the first card in the strip on mobile. The fan places rank 1 at center, rank 2 to its right, rank 3 to its left, rank 4 right of 2, rank 5 left of 3, and so on outward. Local client websites sit in the middle, products on the wings.

| rank | slug | name | category | badge | liveUrl | image source |
|---|---|---|---|---|---|---|
| 1 | `health-fitness-headquarters` | Health & Fitness Headquarters | Website | | https://hfhonline.com | capture |
| 2 | `chicken-shack` | The Chicken Shack | Website | | https://chickenshackwi.com | capture |
| 3 | `715-harvest-fest` | 715 Harvest Fest | Website | | https://715harvestfest.com | capture |
| 4 | `meridian` | Meridian | Platform | Built by Vaelro | https://meridianpm.app | capture, with the app fallback rule in Section 5 |
| 5 | `maverick` | Maverick | Platform | Built by Vaelro | https://maverickfs.app | capture, with the app fallback rule in Section 5 |
| 6 | `udoni-salan-real-estate` | Udoni & Salan Real Estate | Custom tool | | none | `assets/portfolio/` (the Udoni email generator screenshot; pick by filename) |
| 7 | `owenlencki` | Owen Lencki | Website | Built by Vaelro | https://owenlencki.com | capture |

Not featured this phase: **Waypoint Financial Solutions**. Keep its existing entry in `projects.ts` with `featured: false` so nothing is lost; it gets no card and no detail page for now. Do not include Huck & Finn, ICC, Chaintiques, Big Mike's, or any spec demo.

---

## 4. Copy (final; public site copy)

Rules for these strings: no em dashes anywhere, plain English, AI is never the headline, no invented numbers or outcomes. Before you write them into `projects.ts`, open each live site and check the copy against what is actually there: correct factual details from the site (city, what the site contains), never add claims. Where a fact is unknown (for example a city), omit the field rather than guess.

**health-fitness-headquarters** · client "Health & Fitness Headquarters" · year 2026 · owns "Domain, hosting, code, and content." · location: read the city from the site's footer or contact section if present, otherwise omit
- tagline: A new site for a local gym, launched on the gym's own domain, with inquiries going straight to the owner.
- situation: Randy wanted a site that matched the gym and worked on a phone, without renting it from a platform he did not control.
- built: A fast, mobile-first site with a contact form that lands in Randy's inbox with the sender's address set as the reply-to, so he answers in one tap. We moved hfhonline.com onto the new site and he is on a month-to-month support agreement.
- changed: Live on the gym's own domain, with every inquiry landing in Randy's inbox.

**chicken-shack** · client "The Chicken Shack" · year 2026 · owns "Domain, hosting, code, and content." · location: read from the site (King or Waupaca, WI area), otherwise omit
- tagline: A single-page site for a Waupaca-area fried chicken spot: menu, hours, and a contact form that goes straight to the restaurant.
- situation: The Chicken Shack needed a simple site people could find on their phones: what is on the menu, when the kitchen is open, and how to get in touch.
- built: A single-page site with the menu, hours, and location, plus a contact form that goes straight to the restaurant's inbox with the sender's address as the reply-to. The Chicken Shack owns the domain and everything on it.
- changed: omit

**715-harvest-fest** · client "715 Harvest Fest" · year 2026 · location "Waupaca, WI" · owns "The event data, documents, and organizer spreadsheet."
- tagline: An event site plus a vendor application system that puts every application in one organizer spreadsheet.
- situation: 715 Harvest Fest needed a public site for the event and a way for vendors to apply online, with the organizers able to see every application in one place.
- built: The event site and a vendor application system. Applications and uploaded files land in an organizer spreadsheet and Drive folder automatically, and the organizers got a short guide plus email templates for follow-up.
- changed: omit

**meridian** · client "Meridian" · year 2026 · badge "Built by Vaelro" · owns omit
- tagline: An owner-first command center for small landlords: what each property made, what it cost, and what needs attention.
- situation: Owners with a handful of units usually run everything from spreadsheets, notes, folders, and reminder emails. The big property management platforms are built for someone else.
- built: A simple platform that shows what each property made and cost, which rent is missing, what maintenance or renovation work is open, which documents matter, and what deadlines are coming, with a portfolio view across everything. Live in production.
- changed: omit

**maverick** · client "Maverick" · year 2026 · badge "Built by Vaelro" · owns omit
- tagline: A student record-keeping platform for Part 61 flight schools, live and in use.
- situation: Flight schools track student progress across paper logs and spreadsheets, and proving readiness against regulatory minimums means digging through all of it.
- built: Student records, flight logs with the Part 61 fields, progress against minimums, and checklists for pre-solo, stage check, and checkride readiness, with instructor and admin roles and school-level branding. Celestial Kinetics Flight Academy in Waupaca is the first school on it.
- changed: omit

**udoni-salan-real-estate** · client "United Country Udoni & Salan Realty Group" · year 2026 · location "Waupaca, WI" · owns omit · liveUrl omit
- tagline: An AI-assisted email generator in Shellady's own voice, plus listing intake and agent onboarding systems for a Waupaca real estate office.
- situation: Shellady Udoni runs marketing for the office and was writing the same kinds of listing and client emails again and again, while every new listing and every new agent meant a pile of manual setup.
- built: An email generator that drafts listing and client emails in her voice from a few guided fields, a listing intake form that routes each new listing to the office tracker and to her inbox formatted the way she needs it, and a self-service onboarding guide that new agents work through on their own.
- changed: omit

**owenlencki** · client "Owen Lencki" · year 2026 · badge "Built by Vaelro" · owns omit
- Read owenlencki.com and write tagline, situation, and built from what is actually on the page, same register and length as the entries above. It is Owen's personal site; describe it as that. Fallback if the page cannot be read: tagline "Owen's personal site: who he is and what he is building." situation "A co-founder needs a place that says who he is beyond the agency." built "A personal site built on the same stack we ship for clients."
- changed: omit

Testimonials: none yet. Liam is collecting written ones. Build the rendering; leave every `testimonial` undefined.

---

## 5. Screenshot capture script

`scripts/capture-work.ts`, run with `npm run capture:work`. Dev dependencies: `playwright`, `sharp`, `tsx`. Run `npx playwright install chromium` once.

- Imports `projects` from `src/data/projects.ts`. No separate manifest; `projects.ts` is the single source of truth.
- For each featured project with a `liveUrl`:
  - Mobile context: `viewport 430x716`, `deviceScaleFactor 2`, `isMobile true`, `hasTouch true`, `reducedMotion 'reduce'`, `colorScheme 'light'`. `goto` with `waitUntil 'networkidle'`, wait 1500ms, scroll to the bottom and back to the top to trigger lazy images, hide common cookie or chat overlays if present, screenshot the viewport (not full page). Output `card.webp` at 720x1200 (3:5 portrait), quality 80.
  - Desktop context: `viewport 1440x900`, `deviceScaleFactor 2`, same waits. Screenshot the viewport. Output `hero.webp` at 1600 wide, quality 80.
  - **App fallback rule** (Meridian, Maverick, and any URL that behaves this way): if the captured page is a login or sign-in wall (a `input[type=password]` is present, or the title or h1 contains "sign in", "log in", or "login") or is near-blank, do not use it. Instead build the images from `assets/portfolio/` (Meridian: the dashboard screenshots; Maverick: dashboard plus one of students/prospects/settings). Keep `liveUrl` as the visit link regardless. Log which path was taken.
- For projects without a `liveUrl`, or under the fallback rule: source images are desktop-shaped, so never center-crop or stretch a dashboard into a phone shape. Build the card by compositing onto a 720x1200 canvas filled with the section's background token color: if two source images are available, stack two, top-aligned with a 24px gap, each fit to 672 wide with rounded corners; if one, place it top-aligned. The hero is the primary source image fit to 1600 wide.
- Writes to `public/work/<slug>/card.webp` and `public/work/<slug>/hero.webp`.
- Flags: `--only <slug>`. A single URL failure logs and continues; the run never aborts as a whole.
- Ends with a summary table: slug, source path or URL, fallback used yes/no, card bytes, hero bytes.
- Targets: each `card.webp` under 120 KB, each `hero.webp` under 250 KB.
- Generated WebPs are committed. Netlify does not run this script.

---

## 6. Data model

Extend `src/data/projects.ts` in place; preserve any fields other components read.

```ts
export type WorkCategory = 'Website' | 'Custom tool' | 'Platform';
export interface Testimonial { quote: string; name: string; role: string; }
export interface Project {
  slug: string;
  name: string;
  client: string;
  location?: string;
  category: WorkCategory;
  badge?: string;                 // "Built by Vaelro"
  year: number;
  tagline: string;                // one sentence; card overlay, page subhead, meta description
  situation: string;
  built: string;
  changed?: string;               // omit rather than invent
  owns?: string;
  liveUrl?: string;
  images: { card: string; hero: string; alt: string };   // absolute paths under /work/
  testimonial?: Testimonial;      // renders only when present; no placeholder UI when absent
  featured: boolean;
  rank: number;                   // 1 = most prominent
}
```

Export helpers: `featuredProjects` (featured, sorted by rank), `fanOrder(projects)` (center-out placement described in Section 3, returning left-to-right), and `getProject(slug)`.

---

## 7. The fan: `src/components/sections/WorkFan.tsx` (replaces Portfolio on Home)

Section `id="work"`. Existing section spacing, background rhythm, and heading treatment. No new fonts, no new colors: Fraunces, Sora, IBM Plex Mono and the existing token set only.

**Heading lockup** (two-line contrast, our faces): line 1 in Sora at the heaviest available weight, uppercase, tight tracking: `WHAT WE'VE BUILT`; line 2 in Fraunces display, regular weight: `for businesses like yours`. If the site already has a two-line heading pattern, use that instead and say so in the plan.

**Pointer devices** (gate with `@media (hover: hover) and (pointer: fine)` plus the md breakpoint, not user-agent sniffing):
- Container is relative with a fixed height sized to card height plus lift room. Cards absolutely positioned from horizontal center. Card size about 260x433 (3:5) at desktop, scaling down at md.
- Each card is a React Router `<Link to={`/work/${slug}`}>` styled as the card, containing the `card.webp` image (`width` and `height` attributes, `object-cover`) and a bottom scrim with the project name in Fraunces and a small category chip (plus the badge chip when present). The label is always visible; nothing animates in on hover.
- Rest transforms for n cards with center index c: card i gets `rotate = (i - c) * STEP_DEG`, `translateX = (i - c) * STEP_X`, `translateY = |i - c| * DROP_Y`, `transform-origin: 50% 120%`, `z-index = n - |i - c|`. Constants in one object at the top of the file: `STEP_DEG 8`, `STEP_X 0.55 * cardWidth`, `DROP_Y 14`, `HOVER_SCALE 1.07`, `HOVER_LIFT -18`, `NEIGHBOR_PUSH 56`, `OUTER_PUSH 22`, `DURATION 420ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)`. The math handles 5 to 9 cards without edits.
- Hover or keyboard focus on card h: h goes to `rotate 0`, `scale HOVER_SCALE`, `translateY += HOVER_LIFT`, top z-index. Cards adjacent to h move outward by `NEIGHBOR_PUSH`; every card beyond adjacent moves outward by `OUTER_PUSH`. Leaving returns everything to rest. Focus and hover are identical.
- Framer Motion (already installed) or plain CSS transitions on `transform`; pick one, keep it consistent. No carousel library.
- Tab order is DOM order, left to right. Focus ring per build rules: 2px accent, 2px offset, on the card. `aria-label="View case study: <name>"` on each link.

**Touch and narrow viewports** (below md, or `hover: none`): no fan. A horizontal scroll-snap strip: `scroll-snap-type: x mandatory`, cards about 72vw wide, next card peeking, no rotation, same overlay label, tap goes to the detail route, ordered by rank. Pure CSS scroll, no JS carousel.

**Reduced motion** (`useReducedMotion` or `prefers-reduced-motion: reduce`): rest layout with all transitions disabled; hover and focus only raise z-index and show the ring. The mobile strip is unaffected.

**Below the fan:** one line, `Real work for real businesses. Click any card to see what we built and why.`, then the site's existing consultation CTA to `/contact`. Check the section order in `HomePage.tsx`: build rules want a CTA right after a proof section, but do not double up if the next section is already the CTA.

**Performance:** card images `loading="lazy"` and `decoding="async"` (this section is below the 3D hero, never above the fold), explicit dimensions to prevent CLS, WebP only. Do not touch the hero or its render budget.

---

## 8. Detail page: `src/pages/WorkDetailPage.tsx` at `/work/:slug`

- Route added in `App.tsx`, lazy-loaded with `React.lazy` so Home's bundle does not grow. Reuse the existing `PageTransition` wrapper. Scroll to top on mount (through Lenis if the site scrolls through Lenis).
- Unknown slug, or a slug whose project is not `featured`: `Navigate` to `/#work`.
- Structure, top to bottom:
  1. Back link `All work` with a left arrow icon, to `/#work`.
  2. Eyebrow: `<category> · <year>` (middle dot). Badge chip when present.
  3. H1 `name` in Fraunces; subhead `tagline`.
  4. Hero: `images.hero`, rounded corners, soft shadow, `alt` from data, full content width.
  5. Two columns at lg, stacked below: left holds three short blocks labeled `The situation`, `What we built`, `What changed` (third only when `changed` exists). Right is a sticky facts card: `Client`, `Location` (when present), `Category`, `Owns` (when present), and a `Visit <domain>` link when `liveUrl` exists (`target="_blank" rel="noopener noreferrer"`, external icon).
  6. Testimonial block only when `testimonial` exists: quote in Fraunces italic at display size, then name and role. When absent, render nothing.
  7. Previous / Next links by rank among featured projects.
  8. Closing CTA band: `Want something like this for your business?` with the site's consultation CTA to `/contact`.
- Metadata: `<title>{name} | Work | Vaelro</title>` and `<meta name="description" content={tagline}>` via React 19 metadata hoisting, unless the repo already uses a head library, in which case use that.

Nav: add a `Work` item that goes to `/#work`. When landing on Home with the `#work` hash from another route, scroll to the section after mount. No `/work` index page this phase.

---

## 9. Routing and hosting

Netlify SPA fallback must exist (`/*  /index.html  200` in `public/_redirects` or the equivalent in `netlify.toml`). Verify it; add it if missing, or shared deep links to `/work/<slug>` 404. Detail pages are client-rendered; that is fine for now.

---

## 10. Rules

1. Post the plan (Section 11), then wait for Owen's `go`. No code before that.
2. Repo wins over this file.
3. No em dashes in any site copy or data string.
4. No fabricated outcomes, metrics, or quotes. Empty fields are omitted, never filled.
5. Only the Section 3 roster. Waypoint stays in the data, unfeatured. Nothing resurrected from git history.
6. No new fonts, colors, icon sets, or carousel/animation libraries.
7. Nothing in this phase touches the 3D hero, the contact form, or the Apps Script.
8. No subagents. Work sequentially; verify each piece before the next.

---

## 11. Plan format (under 40 lines, then stop)

1. Files to add and change, full paths, one line each.
2. `Project` type diff against the current `projects.ts`; mapping of each existing entry to its new slug; confirmation Waypoint is retained unfeatured.
3. Fan math constants and the transform formulas; how the `hover: hover` and breakpoint gates switch fan and strip.
4. Capture script: dependencies, viewports, output paths, how it imports `projects.ts`, how the app fallback and composite rules are implemented.
5. Router changes and lazy-load approach.
6. Where the Home CTA sits after the fan, with the current section order quoted from `HomePage.tsx`.
7. Anything here that conflicts with the repo, and what you will do instead.

---

## 12. Build, then verify (paste the output, do not summarize)

After `go`: install deps, extend the data, write the capture script and run it, build the fan and the detail page, wire routing and nav, then run this block and paste it verbatim:

```
npx tsc --noEmit
npm run build
grep -n "hover: hover" src/components/sections/WorkFan.tsx
grep -n "scroll-snap\|snap-x" src/components/sections/WorkFan.tsx
grep -n "useReducedMotion\|prefers-reduced-motion" src/components/sections/WorkFan.tsx
grep -n "aria-label" src/components/sections/WorkFan.tsx
grep -n "loading=\"lazy\"\|decoding=\"async\"" src/components/sections/WorkFan.tsx
grep -n "/work/:slug" src/App.tsx
grep -n "React.lazy\|lazy(" src/App.tsx
grep -n "testimonial" src/pages/WorkDetailPage.tsx
grep -n "featured: false" src/data/projects.ts
grep -n "—" src/data/projects.ts src/components/sections/WorkFan.tsx src/pages/WorkDetailPage.tsx   # must return nothing
grep -rn "index.html" public/_redirects netlify.toml 2>/dev/null
ls -la public/work/*/
```

Then start `npm run dev`, print the local URL, and stop. Owen checks: desktop rest fan and hover, tab focus, click-through, resize below md for the strip, reduced motion, each detail page, the external visit links, prev/next, back to `/#work`, and a direct load of `/work/health-fitness-headquarters`.

## 13. Ship

On Owen's `ship`: `git add -A`, commit `Work section: fanned case studies, /work/:slug pages, capture script`, `git push`. Netlify auto-deploys. Then tell Owen to open `https://vaelro.co/work/health-fitness-headquarters` directly on his phone (proves the SPA redirect and the mobile strip) and hover the fan on desktop.

Afterward, adding a testimonial or a newly launched site is a data edit: add the entry to `projects.ts`, run `npm run capture:work --only <slug>`, commit, push.
