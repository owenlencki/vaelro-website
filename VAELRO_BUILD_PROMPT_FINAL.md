# VAELRO.CO - FULL WEBSITE BUILD

## FABLE 5 INSTRUCTIONS

Do not spawn subagents. Work sequentially.

Act when you have enough information. Don't re-derive established facts, survey options you won't pursue, or narrate your decision process. Recommend and proceed.

Don't add features, refactor, or introduce abstractions beyond this spec. Do the simplest thing that works well.

Before ending your turn, check your last paragraph. If it's a plan or a promise ("I'll…"), do that work now. End only when the build is complete or you need input only I can provide.

Self-verify: after completing each major section, confirm it renders, animates correctly, and is responsive before moving on.

You have ample context. Do not suggest a new session.

---

## MISSION

Build the Vaelro agency website from scratch. Three-page site with React Router:
- **Home** (`/`) - the impressive scroll experience: 3D hero, services, portfolio, social proof, CTA
- **About** (`/about`) - team, story, process, differentiators
- **Contact** (`/contact`) - Google Calendar booking, contact form, info

This is the portfolio and primary sales tool for a two-person AI automation and web agency based in Waupaca, Wisconsin.

This site must accomplish two things simultaneously:
1. **Impress instantly.** The scroll experience, motion design, and interactivity must make anyone - business owner, designer, developer - think "these people clearly know what they're doing." This is the site that proves Vaelro's capability without saying it.
2. **Convert local business owners.** The copy and structure must speak clearly to a non-technical small business owner in rural Wisconsin who needs a website or wants to stop doing everything manually. Premium execution, accessible language.

Every CTA on the site ("Book a Free Consultation") links to `/contact`.

Design north stars: Basement Studio, Locomotive, Linear.app, Vercel.com - that tier of craft adapted for a local agency. NOT a template. NOT a generic SaaS landing page. A statement piece.

---

## TECH STACK

```
React 19 + Vite + TypeScript + Tailwind CSS v4
React Three Fiber (3D hero scene)
Framer Motion (scroll animations, text reveals, section transitions)
Lenis (smooth scroll)
Deploy: Netlify (GitHub connected)
```

Required npm dependencies:
- `react` (^19)
- `react-dom` (^19)
- `react-router-dom` (^7)
- `three` (^0.170)
- `@react-three/fiber` (^9)
- `@react-three/drei` (latest)
- `@react-three/postprocessing` (latest)
- `framer-motion` (^11)
- `lenis` (^1)

Two animation systems, clearly separated: React Three Fiber owns the hero 3D scene (Home page only). Framer Motion owns everything else. They do not overlap.

Routing: React Router v7. Three routes: `/`, `/about`, `/contact`. Shared layout with Navbar and Footer wrapping all pages. Page transitions via Framer Motion `AnimatePresence` (fade or slide).

No other UI frameworks. No Bootstrap, no Material UI, no Chakra. Tailwind + custom CSS only.

---

## BRAND SYSTEM

### Colors
Override ALL Tailwind defaults. No `blue-500`, `slate-*`, `indigo-*` anywhere. Build full 50–950 scales from these brand colors using CSS custom properties.

```
--color-cream:        #F5F0E8    (primary background)
--color-peach:        #F0DFD0    (surface / cards)
--color-orange:       #D4743B    (accent / CTAs)
--color-dark:         #1A1A1A    (dark sections, text primary)
--color-text:         #1A1A1A    (text primary)
--color-text-secondary: #4A4A4A  (text secondary)
--color-text-muted:   #8A8078    (text muted)
--color-border:       #E0D5C7    (borders)
--color-cream-on-dark: #F5F0E8   (text on dark backgrounds)
```

IMPORTANT: This cream + orange + serif palette is the most common AI-generated design pattern on the web right now. The motion, interactivity, and execution quality are what differentiate this from that pattern. Push hard.

### Typography
```
Headings:  Libre Baskerville (serif) - bold, letter-spacing: -0.02em to -0.03em on large sizes
Body:      Source Sans 3 or DM Sans (NOT Inter - Inter is the #1 AI/template tell)
Mono:      JetBrains Mono (sparingly, for tech references)
```

Self-host all fonts. `font-display: swap`. Preload the heading and body fonts.

Type scale: 1.333 (perfect fourth) from 16px base, using `clamp()` for fluid sizing. Hero headlines 56–80px desktop, 32–40px mobile.

### Spacing
8px base grid. Section padding: `py-24` (96px) desktop / `py-12` (48px) mobile. Container max: 1200px. Generous whitespace - this should breathe.

---

## BRAND ASSETS

Scan the `/assets` folder and its subfolders for all image files. Use them:
- **`/assets/logos/`** - logo variations for nav, preloader, favicon
- **`/assets/team/`** - real team photos of Owen and Liam for the Team section
- **`/assets/backgrounds/`** - texture files for section backgrounds if useful
- **`/assets/portfolio/`** - project screenshots for portfolio cards (use as-is or as placeholders)

**Reference files (in `/assets` root, for visual context only - do not import these into the build):**
- `Vaelro-Website-redesign.html` - a prior design mockup from Claude Design. Look at it for visual direction if helpful, but this build spec takes precedence on all design decisions.
- `Vaelro-brand-kit-preview.png` - brand reference sheet
- `colors-signature-copy.html` - color palette reference
- `project-mockups-not-for-use.png` - mockup reference, not for production

These reference files can stay in the folder. They won't be imported into the build. Just use them for visual context if they help inform design decisions.

---

## PAGE ARCHITECTURE

Three pages sharing a layout (Navbar + Footer). Content split:

### HOME PAGE (`/`)
Sections in order: Preloader (first visit only) → Hero (3D) → Marquee → Services → Portfolio → Social Proof → CTA

### ABOUT PAGE (`/about`)
Sections: Page header → Team → Process → Differentiators

### CONTACT PAGE (`/contact`)
Sections: Page header → Booking button (Google Calendar) → Contact form (backup) → Contact info

Build all sections below. Sections marked [HOME], [ABOUT], or [CONTACT] go on that page.

---

### [HOME] SECTION: PRELOADER

Brief (1.5–2s) page intro. Dark (#1A1A1A) full-screen overlay. Vaelro wordmark or logo animates in (letter-by-letter stagger, scale-up, draw-on, or clip-path reveal - pick what looks best with the available logo asset). Overlay slides up or splits to reveal hero. Use `AnimatePresence` to unmount after completion. Skip on return visits via `sessionStorage`.

---

### [SHARED] NAVIGATION

Minimal sticky header. Starts transparent on the Home page hero, transitions to backdrop-blur + subtle background on scroll (use `useScroll` + `useTransform` for the transition). On About and Contact pages, start with the solid background.

**5 nav items:**
- Vaelro logo/wordmark (left, links to `/`)
- **Services** - if on Home page, smooth-scrolls to the services section. If on another page, navigates to `/#services`
- **Work** - same pattern, scrolls to or links to `/#portfolio`
- **About** - links to `/about`
- **Contact** - links to `/contact`
- CTA button: "Book a Call" (right, accent orange, links to `/contact`)
- Scroll progress bar: thin accent-orange line at viewport top, width scales with `scrollYProgress`

Mobile: hamburger → full-screen overlay with staggered link reveals. Primary CTA visible outside hamburger at all times.

Nav link hover: subtle underline animation (clip-path width transition).

---

### [HOME] HERO - 3D INTERACTIVE CONSTELLATION

The hero has TWO layers: a full-viewport React Three Fiber `<Canvas>` as the background, and HTML content overlaid on top. This is the signature moment of the entire site.

**Layer 1 - 3D Canvas (background):**

An interactive particle constellation rendered with React Three Fiber. Real 3D depth, not a flat animation.

**Particle Network Spec:**
- 250-350 particles (THREE.Points or instanced meshes) floating in a 3D volume
- Each particle is a small glowing sphere with emissive material
- Color: warm palette - mix of cream (#F5F0E8 at ~30% opacity), soft orange (#D4743B at ~30% opacity), and white
- Size: vary between 1-4px, with a few larger "anchor" nodes at 6-8px
- Position: randomly distributed (x: -8 to 8, y: -5 to 5, z: -6 to 2)
- Movement: slow continuous drift, each particle with a unique velocity vector (barely perceptible)
- Overall scene: gentle auto-rotation around Y axis (~0.001 rad/frame)

**Connection Lines:**
- Draw thin lines (THREE.LineSegments with BufferGeometry) between particles within a threshold distance
- Line opacity scales inversely with distance (closer = more visible, far = transparent)
- Line color: cream/white at low opacity (~0.15)
- Recalculate connections each frame (or every 2-3 frames for performance)

**Mouse Interaction (desktop only - disable on touch):**
- Track mouse position, convert to 3D coordinates
- Particles gently push away from cursor (repulsion effect, ~2 unit radius)
- Spring-like return: particles slowly drift back after mouse moves away
- Subtle camera drift following mouse position (lerp 0.1-0.3 units toward pointer, creates parallax depth)

**Postprocessing:**
- `<EffectComposer>` from @react-three/postprocessing
- `<Bloom>`: luminanceThreshold ~0.4, intensity ~0.6, radius ~0.8 (soft warm glow)
- `<ToneMapping>` to control brightness
- Optional very subtle `<ChromaticAberration>` (offset ~0.0005) - remove if gimmicky

**Camera:** Perspective, fov ~60, z: 5.5. No OrbitControls. User does NOT manually orbit.

**Performance:**
- Load Canvas with `<Suspense>`, fallback = solid dark background matching the scene
- Mobile: reduce to ~100-150 particles, disable postprocessing, disable mouse interaction
- DPR capped at [1, 1.5]
- Canvas sits BEHIND HTML content (absolute positioned, z-index: 0; content z-index: 1)
- `gl={{ antialias: true, alpha: true }}`

**Layer 2 - HTML Hero Content (overlaid on canvas):**
- Eyebrow: "AI-Powered Agency · Waupaca, WI"
- Headline: bold, 8 words max - "We Build the Systems That Run Your Business" or something better. Word-by-word reveal animation (Framer Motion SplitText).
- Subheadline: one specific sentence about what Vaelro does for whom
- Primary CTA: "Book a Free Consultation" (accent orange button)
- Secondary CTA: "See Our Work ↓" (text link, scrolls to portfolio)
- All text high-contrast against dark 3D background (cream/white text with subtle text-shadow if needed)
- Text animations are Framer Motion (independent from the R3F scene)

**Animation sequence after preloader:**
1. Eyebrow fades in (200ms delay)
2. Headline reveals word-by-word (y: '100%' → '0%', stagger 0.08s, 0.5s delay)
3. Subheadline fades up (y: 20→0, opacity 0→1)
4. CTAs fade up last (stagger 0.1s)
5. 3D scene is already running - particles drifting, connections drawing
6. On scroll: hero content parallaxes up and fades, transitioning to marquee

---

### [HOME] SCROLLING MARQUEE

Horizontal text ticker on dark (#1A1A1A) background. Creates energy and visual transition.

Text items (repeating, separated by styled dots):
"Websites That Convert · AI Automation · Clean Systems · More Time Back · Local Service · Modern Tech · ..."

Two rows moving in opposite directions. CSS `transform: translateX()` - NOT JS-driven. ~35s cycle. Gradient fade at edges. Cream text on dark.

---

### [HOME] SERVICES - "What We Build"

Three service offerings. Clean cards or panels with scroll-triggered reveal animations.

**Service 1 - Custom Websites**
"Websites That Actually Work"
Not templates. Not WordPress. Custom-built on modern infrastructure that loads in under 2 seconds, never gets hacked, and turns visitors into customers. You own everything - code, domain, hosting, data.
Tech: React · Tailwind · Headless CMS · Cloudflare

**Service 2 - AI Automation**
"Stop Doing the Same Thing Twice"
We build workflows that handle follow-ups, scheduling, document processing, data entry, and the repetitive work your team wastes hours on every week. Custom-built, not off-the-shelf.
Tech: n8n · Custom Workflows · CRM Integration · Anthropic AI

**Service 3 - AI Strategy & Consulting**
"Know Exactly Where AI Fits"
Not sure where to start? We audit your operations, map where AI saves real time and money, and build a concrete roadmap. No buzzwords. No hype. Just a plan that pays for itself.
Deliverables: AI Audit · Implementation Roadmap · ROI Analysis

**Animation:** Cards reveal on scroll with stagger (y: 30→0, opacity 0→1, stagger 0.15s between cards). Subtle hover lift (translateY -4px + shadow increase, 200ms easeOut). Icons or illustrations from the brand assets folder if available.

---

### [HOME] PORTFOLIO - "Our Work"

**THIS IS THE MOST IMPORTANT SECTION FOR CREDIBILITY. BUILD IT CAREFULLY.**

**Architecture: Data-driven.** All projects defined in a single array/object in a data file (`src/data/projects.ts`). Each project has: `id`, `title`, `category` (tag: "Website" | "Product" | "Automation" | "AI System"), `description` (2-3 sentences), `metrics` (optional array of stat strings), `techStack` (array of tech names), `image` (path to screenshot/mockup - placeholder if not available), `url` (optional, link to live project), `featured` (boolean). Adding a new project = adding an object to the array. No component changes needed.

**Projects to include (populate the data file with these):**

```typescript
// src/data/projects.ts
export const projects = [
  {
    id: "maverick",
    title: "Maverick - CK Flight Tracker",
    category: "Product",
    description: "A full flight school management platform built for CK Aviation. Student scheduling, flight logging, instructor management, and progress tracking - replacing spreadsheets and paper logs with a real system.",
    metrics: ["Live in production", "Next.js + Supabase"],
    techStack: ["Next.js 15", "Supabase", "Prisma", "Tailwind", "shadcn/ui"],
    image: "", // placeholder
    url: "https://ck-flight-tracker.netlify.app",
    featured: true,
  },
  {
    id: "meridian",
    title: "Meridian - Property Performance Platform",
    category: "Product",
    description: "A performance dashboard for small landlords to track property financials, maintenance, and tenant data in one place. Built to replace the spreadsheet chaos most independent landlords operate in.",
    metrics: ["In active development"],
    techStack: ["React", "TypeScript", "Tailwind"],
    image: "", // placeholder
    featured: true,
  },
  {
    id: "waypoint",
    title: "Waypoint Financial Solutions - AI Operations Suite",
    category: "Automation",
    description: "Five custom AI-powered tools built for a 13-person financial advisory firm: automated distribution info generation, RMD tracking, prospect meeting prep, client milestone tracking, and conference capture. Replaced hours of weekly manual work.",
    metrics: ["5 production tools", "13-person firm"],
    techStack: ["n8n", "Anthropic API", "Google Workspace"],
    image: "", // placeholder
    featured: true,
  },
  {
    id: "harvest-fest",
    title: "715 Harvest Fest - Event Platform",
    category: "Website",
    description: "A complete event website and vendor application system for Waupaca's 715 Harvest Fest. Online vendor registration, event information, and sponsor showcase - all managed through a headless CMS.",
    metrics: ["Launched and live", "Vendor management system"],
    techStack: ["React", "Sanity CMS", "Netlify"],
    image: "", // placeholder
    featured: false,
  },
  {
    id: "united-country",
    title: "United Country Real Estate - AI Email System",
    category: "Automation",
    description: "AI-powered listing email generator that writes property descriptions in the agent's voice, plus an automated agent onboarding system and listing intake workflow. Built to save hours per listing.",
    metrics: ["AI email generation", "Automated onboarding"],
    techStack: ["n8n", "Anthropic API", "Google Apps Script", "Notion"],
    image: "", // placeholder
    featured: false,
  },
  {
    id: "icc",
    title: "Indian Crossing Casino - Web Platform",
    category: "Website",
    description: "Custom event management website with a branded CMS dashboard for a Wisconsin casino. Real-time content management for events, weddings, dining, and promotions - no developer needed for updates.",
    metrics: ["Custom CMS dashboard", "Real-time content"],
    techStack: ["React", "Vite", "Sanity CMS", "TypeScript", "Tailwind"],
    image: "", // placeholder
    featured: false,
  },
];
```

**UI:** A filterable grid. Category filter tabs at the top ("All", "Websites", "Products", "Automation"). Featured projects get larger cards. Each card shows: project title, category tag, one-line description, and tech stack pills. On hover: image zoom/shift, subtle lift, overlay with "View Project →" link (if url exists) or "Case Study" label.

**Animation:**
- Section heading reveals with `SplitText` word animation
- Filter tabs animate active state (underline slides to active tab)
- Cards stagger in on scroll (y: 40→0, opacity 0→1, stagger: 0.1s)
- On filter change: cards animate out/in with `AnimatePresence` (scale 0.95→1, opacity)
- Card hover: image scales 1→1.05, shadow deepens, slight lift

**Section heading:** "What We've Built" or "Our Work"
**Subheading:** "Products, platforms, websites, and AI systems - built and running."

---

### [ABOUT] PROCESS - "How It Works"

3 steps, clean and simple. Demystifies working with Vaelro.

**Step 1 - Discovery**
"You talk. We listen."
A 30-minute conversation about your business, pain points, and what's costing you time. No pitch - just questions.

**Step 2 - Build**
"We design and build."
Custom website, automation system, or both. You see progress, give feedback, and approve before anything goes live.

**Step 3 - Launch & Support**
"We deploy and stay."
We launch, train your team, and stay on as your tech partner. Monthly support keeps everything running and improving.

**Animation:**
- Steps reveal on scroll with stagger
- A connecting SVG path between steps draws/fills as the user scrolls (use `pathLength` animated via `useScroll`)
- Step numbers scale up and gain accent color as they become active
- Alternate layout: steps on alternating sides (left, right, left) with connecting line down the center

---

### [ABOUT] DIFFERENTIATORS - "Why Vaelro"

Dark section (#1A1A1A background, cream text). Creates visual weight.

4 bold statements, each its own block:

1. **"You own everything."** Your domain, your code, your hosting, your data. No lock-in. No hostage games. Ever.
2. **"Built to last."** Our sites load in under 2 seconds, cost dollars per month to host, and don't need constant security patches. No WordPress. No Wix.
3. **"We're 10 minutes away."** When something breaks before a big event, you call us directly. Not a ticket queue. Not a chatbot. Us.
4. **"We don't disappear."** Monthly support that keeps your systems running and improving. We're your tech team, not a one-and-done vendor.

**Animation:**
- Each statement fades and slides in on scroll (stagger)
- Key phrases ("own everything", "under 2 seconds", "10 minutes away", "don't disappear") get a highlight/underline animation that draws on as the block enters viewport - use a `<span>` with an animated background-size or a pseudo-element width transition
- Subtle grain/noise texture overlay on the dark background (CSS, not an image - something like a repeating SVG noise pattern at low opacity)

---

### [HOME] SOCIAL PROOF

Light section. Client trust signals + stats.

**Client names** (display as a styled row/bar - use text if logos aren't available):
Waypoint Financial Solutions · Indian Crossing Casino · 715 Harvest Fest · United Country Real Estate · CK Aviation · Huck & Finn

**Stats (animated counters):**
- "6+ Local Businesses Served"
- "5 AI Systems in Production"
- "2 Software Products Built"

(Update these numbers as real metrics grow. Keep them honest.)

**Testimonials / Reviews section:**
Build this as a data-driven section (testimonials array in a data file, like the portfolio). For now, populate with 2-3 placeholder cards that look designed, not broken:
- Each card: quote text, person name, business name, optional star rating
- Placeholder content: use generic but believable quotes like "Vaelro transformed how we handle our digital presence" - OR use a clean "Reviews coming soon - we're just getting started" treatment if Owen prefers
- Structure must support real testimonials being dropped in later with zero design changes
- Include Google review stars/rating display if available (link to Google Business Profile)
- The section should look intentional even with placeholder content - designed, not empty

**Animation:**
- Client bar fades in on scroll
- Stat numbers count up from 0 when section enters viewport (`useInView` trigger, animate with `useSpring` or tween). Duration ~1.5s with easeOut.
- Testimonial card has a subtle entrance (scale 0.97→1, opacity 0→1)

---

### [ABOUT] TEAM - "Who's Behind This"

Real humans. This is the trust-builder for local business.

**Owen Lencki** - Co-founder
Sales, strategy, client relationships, and website builds. College sophomore and D3 athlete at UW-Stevens Point who started Vaelro because local businesses deserve technology that actually works for them.

**Liam Bloedow** - Co-founder
Automation architect and infrastructure lead. Builds the n8n workflows, manages deployments, and makes the systems run. Currently working with Higgsfield AI on next-generation video content.

Tone: confident and human, not corporate. These are two guys who are genuinely good at this.

**Animation:**
- Team photos (or placeholder blocks) with parallax effect (image moves slower than text on scroll)
- Names/roles reveal with text animation
- Photos could have a masked reveal on scroll entry (clip-path expanding)

---

### [HOME] CTA - "Let's Build Something"

Dark section. The conversion moment.

- Headline: "Ready to stop doing everything manually?" (or something better - write it to convert)
- Subtext: "Book a free 30-minute consultation. We'll map out exactly where your business can save time and get more customers."
- CTA button: "Book Your Free Consultation" (large, prominent, accent orange)
- Below: "hello@vaelro.co · Waupaca, WI"

**Animation:**
- Headline reveals with word-by-word stagger (same treatment as hero for cohesion)
- CTA button: magnetic hover effect (tracks cursor within a radius, subtle x/y transform toward mouse, `useSpring` for smooth follow, disabled on touch devices)
- Background: subtle gradient animation or mesh, or gentle particle effect

---

### [CONTACT] BOOKING & CONTACT PAGE

The conversion destination. Every "Book a Free Consultation" CTA across the site links here.

**Section 1 - Page Header**
- Headline: "Let's talk about your business"
- Subtext: "Book a free 30-minute consultation. No pitch - just a conversation about where we can help."

**Section 2 - Booking**
- A prominent "Book a Free Consultation" button linking to Google Calendar's appointment scheduling page
- URL placeholder for now: `https://calendar.google.com/calendar/appointments/schedules/PLACEHOLDER`
- Owen will set up the Google Calendar appointment schedule and replace the URL
- The booking opens Google's built-in scheduling page (auto-attaches Google Meet, handles availability)
- Style the button as the primary CTA - large, accent orange, centered, unmissable
- Below the button: "Pick a time that works for you. You'll get a Google Meet link automatically."

**Section 3 - Contact Form (backup)**
- Simple 3-field form: Name, Email, Message
- Submit button: "Send Message"
- Form action: frontend form that logs to console for now. Owen will wire to n8n webhook later.
- Note above or below: "Prefer to book directly? Use the button above."

**Section 4 - Contact Info**
- Email: hello@vaelro.co
- Location: Waupaca, WI
- Instagram: @vaelro.co
- Response time: "We typically respond within 24 hours"

**Animation:** Keep it clean and fast. Standard `Reveal` fade-ups. Don't let motion delay the booking flow.

---

### [SHARED] FOOTER

Minimal. Clean.

- Vaelro wordmark
- "Waupaca, WI"
- "hello@vaelro.co"
- Instagram: @vaelro.co
- "© 2026 Vaelro LLC"

**Animation:** Fade-in on scroll. Consider a "reveal" effect where the footer sits behind the CTA section (CTA scrolls up to expose footer - negative margin or fixed positioning trick).

---

## ANIMATION SYSTEM - REUSABLE COMPONENTS

Build these as shared components in `src/components/ui/`:

### `SplitText.tsx`
Split a string by word or character. Each unit wrapped in a span with `overflow: hidden` parent. Animates `y: '100%' → '0%'` with stagger on viewport entry (`useInView`, `once: true`). Props: `text`, `splitBy` ("word" | "char"), `delay`, `staggerDelay`, `duration`, `className`.

### `Reveal.tsx`
Scroll-triggered reveal wrapper. Default: `y: 30→0`, `opacity: 0→1`, duration 0.6s, easeOut. Fires once. Props: `children`, `delay`, `direction` ("up" | "left" | "right"), `className`.

### `Parallax.tsx`
Wraps children and offsets them on Y axis at a configurable rate on scroll. Uses `useScroll` + `useTransform`. Props: `children`, `speed` (multiplier, default 0.3), `className`.

### `MagneticButton.tsx`
Tracks mouse position within a radius and applies subtle x/y transform toward cursor. Uses `useSpring` for smooth follow. Disabled on touch devices (check for `pointer: coarse`). Props: `children`, `strength` (default 0.3), `className`.

### `AnimatedCounter.tsx`
Counts from 0 to target value when in viewport. Uses `useInView` + `useSpring` or tween. Formats number appropriately. Props: `target`, `duration`, `suffix` ("+", "%", etc.), `className`.

### Lenis Setup
Initialize in `App.tsx`:
```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### Shared Animation Variants
Create `src/lib/animations.ts` with reusable Framer Motion variants:
- `fadeUp`: y 30→0, opacity 0→1
- `fadeIn`: opacity 0→1
- `scaleIn`: scale 0.95→1, opacity 0→1
- `slideFromLeft`: x -40→0, opacity 0→1
- `slideFromRight`: x 40→0, opacity 0→1
- Standard transition: `{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }`

### Reduced Motion
ALL animations MUST respect `prefers-reduced-motion`:
- Disable Lenis smooth scroll (native scroll)
- Replace transform animations with simple opacity fades
- Disable parallax
- Disable magnetic hover
- Keep the site fully functional

Use Framer Motion's built-in `useReducedMotion()` hook. Create a context provider if needed.

### Performance
- Only animate `transform` and `opacity` - never layout properties
- `will-change: transform` only on actively animating elements
- All scroll listeners via `requestAnimationFrame`
- Target 60fps on mid-range mobile
- Hero LCP element: `fetchpriority="high"`, preloaded, NOT lazy
- All below-fold images: `loading="lazy"`
- Keep initial JS under 200KB gzipped

---

## SEO

- `<title>`: "Vaelro - AI-Powered Websites & Automation | Waupaca, WI"
- `<meta name="description">`: "Custom websites and AI automation for small businesses. Modern tech, local service, complete ownership. Free consultation - Waupaca, WI."
- One `<h1>` (hero headline), `<h2>` per section
- LocalBusiness JSON-LD (type: ProfessionalService) with Waupaca address, sameAs Instagram
- Open Graph + Twitter Card meta tags
- Canonical URL: https://vaelro.co
- Sitemap.xml, robots.txt

---

## ACCESSIBILITY

- Text contrast ≥4.5:1 (normal), ≥3:1 (large/UI)
- Visible focus indicators on all interactive elements
- Semantic HTML (`nav`, `main`, `section`, `footer`, `button`, `a`)
- Full keyboard navigation, logical tab order
- `prefers-reduced-motion` respected everywhere
- Alt text on all meaningful images
- Skip-to-content link
- 44×44px minimum tap targets
- No `outline: none` without replacement

---

## DEPLOYMENT

### Git + GitHub
After the build is complete:
```bash
git init
git add .
git commit -m "Initial Vaelro website build"
```
Create a repo on GitHub (e.g., `vaelro/vaelro-website`), then:
```bash
git remote add origin <repo-url>
git push -u origin main
```

### Netlify
1. Log into Netlify → Add new site → Import an existing project → Connect GitHub
2. Select the repo
3. Build command: `npm run build` · Publish directory: `dist`
4. Deploy

**Custom domain (vaelro.co):**
The domain stays registered at Wix (paid through Apr 2027). Just change DNS:
1. In Netlify: Domain settings → Add custom domain → `vaelro.co`
2. Netlify gives you a DNS target (something like `your-site.netlify.app`)
3. In Wix: Domains → vaelro.co → DNS settings → Add a CNAME record: `www` → `your-site.netlify.app` and set A records per Netlify's instructions
4. Netlify auto-provisions SSL via Let's Encrypt

**Wix cleanup after site is live:**
- Cancel the "Premium plan (Core)" subscription - that's the hosting you're replacing
- KEEP the "2 business email users @vaelro.co" subscription - that's your Google Workspace email
- KEEP the "Domain vaelro.co" subscription - that's your domain registration (paid through Apr 2027)

---

## FILE STRUCTURE

```
src/
├── App.tsx                           (React Router: layout + 3 routes)
├── main.tsx
├── index.css                         (Tailwind + custom props + fonts)
├── pages/
│   ├── HomePage.tsx                  (assembles Home sections)
│   ├── AboutPage.tsx                 (assembles About sections)
│   └── ContactPage.tsx               (assembles Contact sections)
├── components/
│   ├── 3d/
│   │   ├── ParticleNetwork.tsx       (3D hero scene - Home only)
│   │   ├── PostProcessing.tsx
│   │   └── useMousePosition.ts
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Preloader.tsx
│   │   └── PageTransition.tsx        (AnimatePresence route wrapper)
│   ├── sections/
│   │   ├── Hero.tsx                  [HOME]
│   │   ├── Marquee.tsx              [HOME]
│   │   ├── Services.tsx             [HOME]
│   │   ├── Portfolio.tsx            [HOME]
│   │   ├── SocialProof.tsx          [HOME]
│   │   ├── HomeCTA.tsx              [HOME]
│   │   ├── Team.tsx                 [ABOUT]
│   │   ├── Process.tsx              [ABOUT]
│   │   ├── WhyVaelro.tsx            [ABOUT]
│   │   ├── BookingEmbed.tsx         [CONTACT] Google Cal booking
│   │   └── ContactForm.tsx          [CONTACT]
│   └── ui/
│       ├── SplitText.tsx
│       ├── Reveal.tsx
│       ├── Parallax.tsx
│       ├── MagneticButton.tsx
│       ├── AnimatedCounter.tsx
│       └── ProjectCard.tsx
├── data/
│   └── projects.ts                   (edit this to add portfolio items)
├── hooks/
│   ├── useReducedMotion.ts
│   └── useLenis.ts
├── lib/
│   └── animations.ts
└── assets/                           (images copied from project /assets)
```

**Project root asset folder:**
```
assets/
├── logos/         (full-logo.png, icon-only.png, favicon.png, etc.)
├── team/          (owen-speaking.jpg, liam-explainer.png, etc.)
├── backgrounds/   (dark-texture.png, light-texture.png, etc.)
└── portfolio/     (maverick.png, harvest-fest.png, etc.)
```

---

## WHAT SUCCESS LOOKS LIKE

1. Someone opens the site and within the first 2 seconds thinks "this is different"
2. The 3D particle constellation in the hero makes them pause - that's the moment
3. The portfolio section proves Vaelro has actually built real things for real businesses
4. A Waupaca business owner reads the copy and thinks "these guys get my problems"
5. The path to booking a consultation is obvious from any point on the page
6. It runs at 60fps on an iPhone 12 and scores 90+ on Lighthouse performance

---

## 3D HERO PERFORMANCE CHECKLIST

Before shipping, verify:
- [ ] Canvas loads inside `<Suspense>` with a matching-color fallback (dark bg)
- [ ] Mobile: particle count reduced to ~100-150, postprocessing disabled, mouse interaction disabled
- [ ] Canvas does NOT block hero text LCP (HTML text renders before canvas hydrates)
- [ ] 60fps on a mid-range phone (test in Chrome DevTools with CPU throttling)
- [ ] `prefers-reduced-motion`: disable particle drift, show static particles or hide canvas
- [ ] No console errors or Three.js warnings in production
- [ ] DPR capped at `[1, 1.5]`
- [ ] Canvas has `alpha: true` so page background shows through if needed

## CURRENT VAELRO.CO COPY (reference - improve upon this, don't copy it verbatim)

The current site uses this content. Use it as a starting point for the copy in each section. Improve, sharpen, and rewrite where it's weak - but keep the core messaging DNA.

**Current headline:** "More Time. More Customers. Less Chaos."
**Current subheadline:** "Modern Solutions for Local Businesses"
**Current marquee text:** "Time · Clarity · Systems · Results"
**Pricing note:** "Pricing varies by project - book a free consultation to get a custom quote"

**Current services copy:**

Custom Websites: "We build custom websites, made specifically for your business. We design and build sites that look professional, load fast, and turn visitors into paying customers."

Workflow Automation: "Stop doing the same repetitive tasks every day. We build automations that handle your follow-ups, scheduling, data entry, and more - so you get those hours back."

AI Strategy: "Not sure where AI fits in your business? We'll map out exactly where it can save you time and money, and give you a clear plan to act on it."

**Current differentiators:**
- "Websites built for conversion - Not just looks, designed to get you leads"
- "Local focus - We work exclusively with small businesses like yours. Based in Waupaca, we understand small-city business."
- "Hours back in your week - Automation that eliminates repetitive tasks"

**Contact:** hello@vaelro.co · Waupaca, WI
**Social:** @vaelro.co (Instagram)

The new site should keep the "More Time. More Customers. Less Chaos." tagline if you can't beat it - it's concise and effective. But the headline in the hero can be different and more impactful for the 3D hero context.

---

## AVAILABLE ASSETS IN PROJECT FOLDER

The project folder contains these assets (scan and use them):

**Logos:** `icon w/ transparent background.png`, `full logo.png`, `icon only.png`, `favicon.png`, `white on black logo icon.png`, `black on white logo icon.png`
**Team photos:** In the `current website assets` or `team` subfolder: `owen speaking 2.JPG`, `speaking_edited.jpg`, `liam explainer.png`, `liam and owen talking.png`, `vaelro pointing at screen.png`
**Backgrounds/textures:** `light texture background.png`, `dark texture background.png`, `hero background.png`, `subtle grid background.png`, `vaelro logo pattern.png`
**Portfolio screenshots:** `harvestfestwebsiteforportfolio`, `maverick portfolio`, `project mockups IDEA (NOISE).png`
**Brand reference:** `Vaelro brand kit overview.png`, `colors-signature-copy.html`
**Workflow/content:** `workflow example.png`

Use the team photos in the Team section. Use portfolio screenshots in the Portfolio section project cards. Use the logo assets for nav and preloader. Background textures can augment sections as needed.

---

## WHAT TO AVOID

- Generic agency copy ("empowering businesses", "innovative solutions", "leveraging AI")
- Default Tailwind colors anywhere
- Inter font
- Uniform 3-column card grids without variation
- Animations that delay the user from reading or clicking
- Any stock photography
- Overbuilt hamburger menus
- Chatbots or popup modals
- More than 2 font families
- Gratuitous animation that serves the developer's ego instead of the user's experience
